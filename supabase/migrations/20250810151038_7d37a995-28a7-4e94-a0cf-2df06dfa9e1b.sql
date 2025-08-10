-- Add discount column to dishes table
ALTER TABLE public.dishes 
ADD COLUMN discount_percentage numeric DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Add index for better performance on discount queries
CREATE INDEX idx_dishes_discount ON public.dishes(discount_percentage);

-- Update the update_updated_at trigger to work with the new column
-- (The trigger already exists and will work with the new column)