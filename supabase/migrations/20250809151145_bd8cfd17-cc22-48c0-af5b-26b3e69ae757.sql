-- Create dishes table
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('appetizer', 'main', 'dessert')),
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Dishes are viewable by everyone" 
ON public.dishes 
FOR SELECT 
USING (true);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = is_admin.user_id 
    AND profiles.role = 'admin'
  );
$$;

-- Admin policies for dishes
CREATE POLICY "Admins can insert dishes" 
ON public.dishes 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update dishes" 
ON public.dishes 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete dishes" 
ON public.dishes 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_dishes_updated_at
BEFORE UPDATE ON public.dishes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial menu data
INSERT INTO public.dishes (name, description, full_description, ingredients, price, image, category, available) VALUES
('Paella Valenciana', 'Arroz tradicional con pollo, judías verdes y azafrán', 'La auténtica paella valenciana preparada con los ingredientes tradicionales: arroz bomba, pollo de corral, judías verdes tiernas, garrofón, tomate rallado, azafrán premium y aceite de oliva virgen extra. Cocinada lentamente en paellera de hierro para conseguir el socarrat perfecto.', ARRAY['Arroz bomba', 'Pollo de corral', 'Judías verdes', 'Garrofón', 'Tomate', 'Azafrán', 'Aceite de oliva', 'Sal marina'], 18.50, '/src/assets/paella-valenciana.jpg', 'main', true),
('Jamón Ibérico', 'Jamón ibérico de bellota cortado a cuchillo', 'Jamón ibérico de bellota de primera calidad, curado durante 36 meses en bodegas naturales. Cortado a mano al momento para conservar toda su jugosidad y sabor. Cada loncha es una experiencia gastronómica única.', ARRAY['Jamón ibérico de bellota', 'Sal marina'], 22.00, '/src/assets/jamon-iberico.jpg', 'appetizer', true),
('Tortilla Española', 'Tortilla de patatas tradicional con huevos camperos', 'La clásica tortilla española elaborada con patatas gallegas, huevos camperos de primera calidad y un toque de sal marina. Preparada al momento con el punto perfecto: cremosa por dentro y dorada por fuera.', ARRAY['Patatas gallegas', 'Huevos camperos', 'Aceite de oliva', 'Sal marina'], 8.50, '/src/assets/tortilla-espanola.jpg', 'appetizer', true),
('Gazpacho Andaluz', 'Sopa fría tradicional con tomates maduros', 'Refrescante gazpacho andaluz preparado con tomates maduros de la huerta, pepino, pimiento verde, cebolla dulce, ajo tierno y pan del día. Aliñado con aceite de oliva virgen extra y vinagre de Jerez.', ARRAY['Tomates maduros', 'Pepino', 'Pimiento verde', 'Cebolla', 'Ajo', 'Pan', 'Aceite de oliva', 'Vinagre de Jerez'], 7.00, '/src/assets/gazpacho.jpg', 'appetizer', true),
('Pulpo a la Gallega', 'Pulpo gallego con patatas, pimentón y aceite de oliva', 'Tierno pulpo gallego cocido tradicionalmente con laurel, servido sobre patatas gallegas cocidas. Aliñado con pimentón dulce de La Vera, sal gruesa y aceite de oliva virgen extra. Una delicia del mar.', ARRAY['Pulpo gallego', 'Patatas', 'Pimentón dulce', 'Aceite de oliva', 'Sal gruesa', 'Laurel'], 16.00, '/src/assets/pulpo-gallega.jpg', 'main', true),
('Croquetas de Jamón', 'Croquetas artesanales con jamón ibérico', 'Croquetas artesanales elaboradas con bechamel cremosa y jamón ibérico desmenuzado. Empanadas con pan rallado casero y fritas en aceite de oliva hasta conseguir una textura crujiente por fuera y cremosa por dentro.', ARRAY['Harina', 'Leche', 'Jamón ibérico', 'Mantequilla', 'Huevo', 'Pan rallado', 'Aceite de oliva'], 9.50, '/src/assets/croquetas.jpg', 'appetizer', true),
('Patatas Bravas', 'Patatas fritas con salsa brava y alioli', 'Patatas cortadas en dados irregulares y fritas hasta conseguir una textura crujiente. Servidas con nuestra salsa brava casera (tomate, pimentón picante, ajo) y alioli tradicional elaborado con ajo y aceite de oliva.', ARRAY['Patatas', 'Tomate', 'Pimentón picante', 'Ajo', 'Aceite de oliva', 'Mayonesa', 'Vinagre'], 6.50, '/src/assets/patatas-bravas.jpg', 'appetizer', true),
('Fabada Asturiana', 'Guiso de alubias blancas con chorizo y morcilla', 'Contundente fabada asturiana con alubias blancas fabes de la granja, chorizo asturiano, morcilla, lacón y panceta. Cocinada lentamente durante horas para conseguir la textura cremosa característica de este plato tradicional.', ARRAY['Alubias blancas', 'Chorizo asturiano', 'Morcilla', 'Lacón', 'Panceta', 'Azafrán', 'Pimentón'], 14.00, '/src/assets/fabada.jpg', 'main', true),
('Churros con Chocolate', 'Churros recién hechos con chocolate espeso', 'Churros tradicionales recién fritos, crujientes por fuera y tiernos por dentro, espolvoreados con azúcar. Acompañados de chocolate caliente espeso preparado con cacao puro y leche entera. El postre perfecto para compartir.', ARRAY['Harina', 'Agua', 'Sal', 'Aceite de girasol', 'Azúcar', 'Chocolate negro', 'Leche', 'Maicena'], 5.50, '/src/assets/churros.jpg', 'dessert', true),
('Crema Catalana', 'Crema tradicional catalana con azúcar quemado', 'Deliciosa crema catalana tradicional elaborada con leche fresca, yemas de huevo, azúcar y un toque de canela y limón. Terminada con una capa de azúcar caramelizado al momento con soplete para conseguir la textura crujiente característica.', ARRAY['Leche fresca', 'Yemas de huevo', 'Azúcar', 'Maicena', 'Canela', 'Limón', 'Vainilla'], 6.00, '/src/assets/crema-catalana.jpg', 'dessert', true);