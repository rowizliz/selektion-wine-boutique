-- Create table for birthday gift requests
CREATE TABLE public.birthday_gift_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Thông tin liên hệ
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  
  -- Thông tin người nhận
  recipient_name TEXT NOT NULL,
  recipient_birthday DATE,
  recipient_gender TEXT,
  relationship TEXT,
  
  -- Gu rượu
  wine_types TEXT[],
  wine_style TEXT,
  
  -- Gu ẩm thực
  cuisine_types TEXT[],
  taste_preferences TEXT[],
  food_allergies TEXT,
  
  -- Gu âm nhạc & giải trí
  music_genres TEXT[],
  hobbies TEXT[],
  
  -- Phong cách
  favorite_colors TEXT[],
  style_preferences TEXT[],
  
  -- Lời chúc
  birthday_message TEXT,
  
  -- Ngân sách
  budget TEXT,
  
  -- Ghi chú
  additional_notes TEXT,
  
  -- Trạng thái xử lý
  status TEXT DEFAULT 'pending' NOT NULL
);

-- Enable RLS
ALTER TABLE public.birthday_gift_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can insert birthday gift requests"
  ON public.birthday_gift_requests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view all requests"
  ON public.birthday_gift_requests
  FOR SELECT
  USING (public.is_admin());

-- Only admins can update
CREATE POLICY "Admins can update requests"
  ON public.birthday_gift_requests
  FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete
CREATE POLICY "Admins can delete requests"
  ON public.birthday_gift_requests
  FOR DELETE
  USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_birthday_gift_requests_updated_at
  BEFORE UPDATE ON public.birthday_gift_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();