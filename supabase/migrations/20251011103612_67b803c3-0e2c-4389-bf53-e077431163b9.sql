-- Agregar columna is_daily_menu a la tabla dishes
ALTER TABLE public.dishes 
ADD COLUMN is_daily_menu boolean DEFAULT false NOT NULL;

-- Comentario para documentar el campo
COMMENT ON COLUMN public.dishes.is_daily_menu IS 'Indica si el plato forma parte del menú diario';