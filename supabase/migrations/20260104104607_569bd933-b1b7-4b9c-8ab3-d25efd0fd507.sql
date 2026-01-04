-- Add discount column to orders table
ALTER TABLE public.orders ADD COLUMN discount numeric NOT NULL DEFAULT 0;