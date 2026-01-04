CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: get_birthday_gift_request_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_birthday_gift_request_status(p_tracking_token uuid) RETURNS TABLE(tracking_token uuid, status text, created_at timestamp with time zone, recipient_name text, sender_name text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    bgr.tracking_token,
    bgr.status,
    bgr.created_at,
    bgr.recipient_name,
    bgr.sender_name
  FROM public.birthday_gift_requests bgr
  WHERE bgr.tracking_token = p_tracking_token
$$;


--
-- Name: get_invitation_by_slug_with_pin(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_invitation_by_slug_with_pin(p_url_slug text, p_pin_code text) RETURNS TABLE(id uuid, title text, event_date timestamp with time zone, location text, location_url text, dress_code text, message text, agenda text, cover_image_url text, url_slug text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ei.id,
    ei.title,
    ei.event_date,
    ei.location,
    ei.location_url,
    ei.dress_code,
    ei.message,
    ei.agenda,
    ei.cover_image_url,
    ei.url_slug
  FROM public.event_invitations ei
  WHERE ei.url_slug = p_url_slug AND ei.pin_code = p_pin_code;
END;
$$;


--
-- Name: get_personalized_wine_request_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_personalized_wine_request_status(p_tracking_token uuid) RETURNS TABLE(tracking_token uuid, status text, created_at timestamp with time zone, customer_name text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    pwr.tracking_token,
    pwr.status,
    pwr.created_at,
    pwr.customer_name
  FROM public.personalized_wine_requests pwr
  WHERE pwr.tracking_token = p_tracking_token;
$$;


--
-- Name: get_wine_recommendation_by_slug(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_wine_recommendation_by_slug(p_url_slug text) RETURNS TABLE(request_id uuid, customer_name text, recommendation_message text, recommendation_published_at timestamp with time zone, wines jsonb)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    pwr.id as request_id,
    pwr.customer_name,
    pwr.recommendation_message,
    pwr.recommendation_published_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', wr.id,
            'wine_id', wr.wine_id,
            'wine_name', wr.wine_name,
            'wine_price', wr.wine_price,
            'wine_image_url', wr.wine_image_url,
            'recommendation_reason', wr.recommendation_reason,
            'display_order', wr.display_order
          ) ORDER BY wr.display_order
        )
        FROM public.wine_recommendations wr
        WHERE wr.request_id = pwr.id
      ),
      '[]'::jsonb
    ) as wines
  FROM public.personalized_wine_requests pwr
  WHERE pwr.url_slug = p_url_slug
  AND pwr.recommendation_published_at IS NOT NULL;
$$;


--
-- Name: get_wine_recommendation_by_token(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_wine_recommendation_by_token(p_tracking_token uuid) RETURNS TABLE(request_id uuid, customer_name text, recommendation_message text, recommendation_published_at timestamp with time zone, wines jsonb)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    pwr.id as request_id,
    pwr.customer_name,
    pwr.recommendation_message,
    pwr.recommendation_published_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', wr.id,
            'wine_id', wr.wine_id,
            'wine_name', wr.wine_name,
            'wine_price', wr.wine_price,
            'wine_image_url', wr.wine_image_url,
            'recommendation_reason', wr.recommendation_reason,
            'display_order', wr.display_order
          ) ORDER BY wr.display_order
        )
        FROM public.wine_recommendations wr
        WHERE wr.request_id = pwr.id
      ),
      '[]'::jsonb
    ) as wines
  FROM public.personalized_wine_requests pwr
  WHERE pwr.tracking_token = p_tracking_token
  AND pwr.recommendation_published_at IS NOT NULL;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: birthday_gift_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.birthday_gift_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_name text NOT NULL,
    sender_phone text NOT NULL,
    recipient_name text NOT NULL,
    recipient_birthday date,
    recipient_gender text,
    relationship text,
    wine_types text[],
    wine_style text,
    cuisine_types text[],
    taste_preferences text[],
    food_allergies text,
    music_genres text[],
    hobbies text[],
    favorite_colors text[],
    style_preferences text[],
    birthday_message text,
    budget text,
    additional_notes text,
    status text DEFAULT 'pending'::text NOT NULL,
    tracking_token uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT additional_notes_length_birthday CHECK (((additional_notes IS NULL) OR (char_length(additional_notes) <= 1000))),
    CONSTRAINT birthday_message_length CHECK (((birthday_message IS NULL) OR (char_length(birthday_message) <= 1000))),
    CONSTRAINT recipient_name_length CHECK (((char_length(recipient_name) >= 1) AND (char_length(recipient_name) <= 100))),
    CONSTRAINT sender_name_length CHECK (((char_length(sender_name) >= 1) AND (char_length(sender_name) <= 100))),
    CONSTRAINT sender_phone_format CHECK ((sender_phone ~ '^[0-9]{10,11}$'::text))
);


--
-- Name: event_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    event_date timestamp with time zone NOT NULL,
    location text NOT NULL,
    location_url text,
    dress_code text,
    message text,
    cover_image_url text,
    pin_code text NOT NULL,
    url_slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    agenda text
);


--
-- Name: invitation_rsvps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitation_rsvps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invitation_id uuid NOT NULL,
    guest_name text NOT NULL,
    phone text,
    attending boolean DEFAULT true NOT NULL,
    guest_count integer DEFAULT 1,
    note text,
    checked_in_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: personalized_wine_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personalized_wine_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tracking_token uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_name text NOT NULL,
    phone text NOT NULL,
    wine_types text[],
    wine_styles text[],
    cuisine_types text[],
    taste_sweet_level integer,
    taste_spicy_level integer,
    music_genres text[],
    hobbies text[],
    budget_range text,
    occasions text[],
    additional_notes text,
    status text DEFAULT 'pending'::text NOT NULL,
    recommendation_message text,
    recommendation_published_at timestamp with time zone,
    url_slug text,
    CONSTRAINT additional_notes_length_wine CHECK (((additional_notes IS NULL) OR (char_length(additional_notes) <= 1000))),
    CONSTRAINT customer_name_length CHECK (((char_length(customer_name) >= 1) AND (char_length(customer_name) <= 100))),
    CONSTRAINT customer_phone_format CHECK ((phone ~ '^[0-9]{10,11}$'::text)),
    CONSTRAINT taste_spicy_level_range CHECK (((taste_spicy_level IS NULL) OR ((taste_spicy_level >= 0) AND (taste_spicy_level <= 100)))),
    CONSTRAINT taste_sweet_level_range CHECK (((taste_sweet_level IS NULL) OR ((taste_sweet_level >= 0) AND (taste_sweet_level <= 100))))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: wine_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wine_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    request_id uuid NOT NULL,
    wine_id text NOT NULL,
    wine_name text NOT NULL,
    wine_price text NOT NULL,
    wine_image_url text,
    recommendation_reason text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: wines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    origin text NOT NULL,
    grapes text NOT NULL,
    price text NOT NULL,
    description text NOT NULL,
    story text,
    image_url text,
    category text NOT NULL,
    temperature text,
    alcohol text,
    pairing text,
    tasting_notes text,
    flavor_notes text[],
    vintage text,
    region text,
    sweetness numeric(3,1) DEFAULT 0,
    body numeric(3,1) DEFAULT 0,
    tannin numeric(3,1) DEFAULT 0,
    acidity numeric(3,1) DEFAULT 0,
    fizzy numeric(3,1),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT wines_category_check CHECK ((category = ANY (ARRAY['red'::text, 'white'::text, 'sparkling'::text])))
);


--
-- Name: birthday_gift_requests birthday_gift_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.birthday_gift_requests
    ADD CONSTRAINT birthday_gift_requests_pkey PRIMARY KEY (id);


--
-- Name: event_invitations event_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_invitations
    ADD CONSTRAINT event_invitations_pkey PRIMARY KEY (id);


--
-- Name: event_invitations event_invitations_url_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_invitations
    ADD CONSTRAINT event_invitations_url_slug_key UNIQUE (url_slug);


--
-- Name: invitation_rsvps invitation_rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation_rsvps
    ADD CONSTRAINT invitation_rsvps_pkey PRIMARY KEY (id);


--
-- Name: personalized_wine_requests personalized_wine_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personalized_wine_requests
    ADD CONSTRAINT personalized_wine_requests_pkey PRIMARY KEY (id);


--
-- Name: personalized_wine_requests personalized_wine_requests_tracking_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personalized_wine_requests
    ADD CONSTRAINT personalized_wine_requests_tracking_token_key UNIQUE (tracking_token);


--
-- Name: personalized_wine_requests personalized_wine_requests_url_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personalized_wine_requests
    ADD CONSTRAINT personalized_wine_requests_url_slug_key UNIQUE (url_slug);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: wine_recommendations wine_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wine_recommendations
    ADD CONSTRAINT wine_recommendations_pkey PRIMARY KEY (id);


--
-- Name: wines wines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wines
    ADD CONSTRAINT wines_pkey PRIMARY KEY (id);


--
-- Name: idx_birthday_gift_requests_tracking_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_birthday_gift_requests_tracking_token ON public.birthday_gift_requests USING btree (tracking_token);


--
-- Name: idx_personalized_wine_requests_url_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_personalized_wine_requests_url_slug ON public.personalized_wine_requests USING btree (url_slug);


--
-- Name: idx_wine_recommendations_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wine_recommendations_request_id ON public.wine_recommendations USING btree (request_id);


--
-- Name: birthday_gift_requests update_birthday_gift_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_birthday_gift_requests_updated_at BEFORE UPDATE ON public.birthday_gift_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: event_invitations update_event_invitations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_event_invitations_updated_at BEFORE UPDATE ON public.event_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: personalized_wine_requests update_personalized_wine_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_personalized_wine_requests_updated_at BEFORE UPDATE ON public.personalized_wine_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: wines update_wines_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_wines_updated_at BEFORE UPDATE ON public.wines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: invitation_rsvps invitation_rsvps_invitation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation_rsvps
    ADD CONSTRAINT invitation_rsvps_invitation_id_fkey FOREIGN KEY (invitation_id) REFERENCES public.event_invitations(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: wine_recommendations wine_recommendations_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wine_recommendations
    ADD CONSTRAINT wine_recommendations_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.personalized_wine_requests(id) ON DELETE CASCADE;


--
-- Name: invitation_rsvps Admin can manage RSVPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage RSVPs" ON public.invitation_rsvps USING (public.is_admin());


--
-- Name: event_invitations Admin can manage invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage invitations" ON public.event_invitations USING (public.is_admin());


--
-- Name: personalized_wine_requests Admins can delete personalized wine requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete personalized wine requests" ON public.personalized_wine_requests FOR DELETE USING (public.is_admin());


--
-- Name: wine_recommendations Admins can delete recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete recommendations" ON public.wine_recommendations FOR DELETE USING (public.is_admin());


--
-- Name: birthday_gift_requests Admins can delete requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete requests" ON public.birthday_gift_requests FOR DELETE USING (public.is_admin());


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: wines Admins can delete wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete wines" ON public.wines FOR DELETE USING (public.is_admin());


--
-- Name: wine_recommendations Admins can insert recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert recommendations" ON public.wine_recommendations FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: wines Admins can insert wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert wines" ON public.wines FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: personalized_wine_requests Admins can update personalized wine requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update personalized wine requests" ON public.personalized_wine_requests FOR UPDATE USING (public.is_admin());


--
-- Name: wine_recommendations Admins can update recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update recommendations" ON public.wine_recommendations FOR UPDATE USING (public.is_admin());


--
-- Name: birthday_gift_requests Admins can update requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update requests" ON public.birthday_gift_requests FOR UPDATE USING (public.is_admin());


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: wines Admins can update wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update wines" ON public.wines FOR UPDATE USING (public.is_admin());


--
-- Name: birthday_gift_requests Admins can view all requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all requests" ON public.birthday_gift_requests FOR SELECT USING (public.is_admin());


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());


--
-- Name: personalized_wine_requests Admins can view personalized wine requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view personalized wine requests" ON public.personalized_wine_requests FOR SELECT USING (public.is_admin());


--
-- Name: invitation_rsvps Anyone can create RSVP; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create RSVP" ON public.invitation_rsvps FOR INSERT WITH CHECK (true);


--
-- Name: birthday_gift_requests Anyone can insert birthday gift requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert birthday gift requests" ON public.birthday_gift_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: personalized_wine_requests Anyone can insert personalized wine requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert personalized wine requests" ON public.personalized_wine_requests FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: invitation_rsvps Anyone can read RSVPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read RSVPs" ON public.invitation_rsvps FOR SELECT USING (true);


--
-- Name: event_invitations Anyone can read invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read invitations" ON public.event_invitations FOR SELECT USING (true);


--
-- Name: wine_recommendations Anyone can view published recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published recommendations" ON public.wine_recommendations FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.personalized_wine_requests pwr
  WHERE ((pwr.id = wine_recommendations.request_id) AND (pwr.recommendation_published_at IS NOT NULL)))));


--
-- Name: wines Anyone can view wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view wines" ON public.wines FOR SELECT USING (true);


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: birthday_gift_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.birthday_gift_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: event_invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: invitation_rsvps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invitation_rsvps ENABLE ROW LEVEL SECURITY;

--
-- Name: personalized_wine_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.personalized_wine_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: wine_recommendations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.wine_recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: wines; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.wines ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;