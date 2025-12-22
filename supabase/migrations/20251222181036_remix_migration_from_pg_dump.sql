CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
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
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
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
-- Name: wines wines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wines
    ADD CONSTRAINT wines_pkey PRIMARY KEY (id);


--
-- Name: wines update_wines_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_wines_updated_at BEFORE UPDATE ON public.wines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: wines Admins can delete wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete wines" ON public.wines FOR DELETE USING (public.is_admin());


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: wines Admins can insert wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert wines" ON public.wines FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());


--
-- Name: wines Admins can update wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update wines" ON public.wines FOR UPDATE USING (public.is_admin());


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());


--
-- Name: wines Anyone can view wines; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view wines" ON public.wines FOR SELECT USING (true);


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: wines; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.wines ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;