-- =====================================================
-- CATEGORÍAS PROPIAS DEL NEGOCIO (fase 1)
-- =====================================================
-- Aditiva: no toca la columna dishes.category (enum dish_category), que
-- el código desplegado hoy sigue leyendo. Se retirará en una migración
-- posterior, cuando todo el frontend use category_id.

-- 1. TABLA CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.categories (slug, name, position) VALUES
  ('raciones',     'Raciones',                 1),
  ('patatas',      'Patatas',                  2),
  ('combinados',   'Platos combinados',        3),
  ('huevos-rotos', 'Huevos rotos',             4),
  ('pescados',     'Pescados y mariscos',      5),
  ('bocadillos',   'Bocadillos y sándwiches',  6),
  ('hamburguesas', 'Hamburguesas',             7),
  ('parrilla',     'A la parrilla',            8),
  ('quesos',       'Quesos',                   9),
  ('ensaladas',    'Ensaladas',               10),
  ('postres',      'Postres',                 11),
  ('otros',        'Otros',                   12);

-- 2. RELACIÓN 1:N CON DISHES
-- ON DELETE RESTRICT: no se puede borrar una categoría con platos dentro.
ALTER TABLE public.dishes
  ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT;

CREATE INDEX dishes_category_id_idx ON public.dishes(category_id);

-- El formulario nuevo ya no envía el enum; con este default los INSERT
-- siguen cumpliendo el NOT NULL mientras la columna exista.
ALTER TABLE public.dishes ALTER COLUMN category SET DEFAULT 'main';

-- 3. CLASIFICACIÓN DE LOS 53 PLATOS (ids de producción a 2026-09-23)
UPDATE public.dishes d SET category_id = c.id
FROM public.categories c, (VALUES
  -- Raciones
  ('5700d422-8af3-4033-9145-e6c7c0a3e7fa'::uuid, 'raciones'),     -- Magro con tomate o al ajillo
  ('f07a2425-742d-411b-a1c9-d1cf5390971a'::uuid, 'raciones'),     -- Morros de vely
  ('20ba69de-07a5-4322-b175-8d385ba5c670'::uuid, 'raciones'),     -- Orejas plancha
  ('88af882d-aa0c-4737-8f06-bc14117efbc0'::uuid, 'raciones'),     -- Pollo crujiente
  ('b4f6c86e-b181-4675-bf3d-7197b2a0cda6'::uuid, 'raciones'),     -- Alitas de pollo
  ('f8017c90-60b0-442c-98cc-5b3379e733ab'::uuid, 'raciones'),     -- Croquetas variadas
  ('0d4f04e7-703a-401b-b006-769ef9e6b462'::uuid, 'raciones'),     -- Croquetas de Jamón
  ('753d0a84-2954-4703-872e-1306d3e4add8'::uuid, 'raciones'),     -- Tablas
  -- Patatas
  ('9b51a4de-c88a-45b5-b8eb-104556a2b22d'::uuid, 'patatas'),      -- Fuente de Patatas con Salchichas
  ('89142644-2707-4f64-9a83-74085c1ed368'::uuid, 'patatas'),      -- Fuente de Patatas con Salsas
  ('4c98383e-05cf-43bd-bfd3-ea7cec107f5f'::uuid, 'patatas'),      -- Patatas Extremadura
  ('d80c9c44-2ef7-4c60-b20c-fd8b7cd7549a'::uuid, 'patatas'),      -- Patatas Casa Candy
  ('36ac2a00-1260-4e64-8e9e-b88be12cbe7c'::uuid, 'patatas'),      -- Patatas con salsas
  ('b4c385bf-6da7-401d-bccc-9c26b391a5b0'::uuid, 'patatas'),      -- Patatas, salchichas y salsas
  -- Platos combinados
  ('3676be2a-50bb-4f2e-838a-a7d8cbc633ce'::uuid, 'combinados'),   -- Plato 1. Lomo de Cerdo
  ('be61ef30-fe42-4d14-994b-f5ccff19edbd'::uuid, 'combinados'),   -- Plato 2. Combinado de Bacalao
  ('114c2bc9-995b-44a0-907f-bf53e5481bf4'::uuid, 'combinados'),   -- Plato 3. Combinado de Ternera
  ('7d4ac0fb-b7a0-406a-955d-cc1ddc4e4d99'::uuid, 'combinados'),   -- Plato 4. Combinado de Pechuga
  ('c07de158-1efa-4dd1-a4da-2f65974f7f19'::uuid, 'combinados'),   -- Plato 5. Combinado de Merluza
  ('a8d43447-5da8-42bd-8181-08433b009c01'::uuid, 'combinados'),   -- Plato 6. Combinado de Panceta
  -- Huevos rotos
  ('a603446e-f4dc-4c82-b5b6-370b2e7df1a6'::uuid, 'huevos-rotos'), -- Cazuela de huevos rotos con jamón ibérico
  ('1e1175fb-6372-4766-a3eb-17d0317052f2'::uuid, 'huevos-rotos'), -- Cazuela de huevos rotos con Morcilla
  ('536d403e-e69d-412a-b0e3-27acbbfe8db4'::uuid, 'huevos-rotos'), -- Cazuela de huevos rotos con panceta y pimientos
  ('fc45b237-9dbc-4491-9b2b-aadc7cf87eb0'::uuid, 'huevos-rotos'), -- Cazuelas de huevos rotos con gulas y gambas
  ('a973ca1c-62b3-49b7-90f4-f7797e480c69'::uuid, 'huevos-rotos'), -- Cazuela de Jamón Ibérico
  -- Pescados y mariscos
  ('82da01af-e7b2-46fe-a303-dc6e3abbe5d5'::uuid, 'pescados'),     -- Pincho de Bacalao
  ('004beb37-df28-40f3-9343-b4a6edfc1c33'::uuid, 'pescados'),     -- Pata de pulpo
  ('f59d4a33-1de6-4853-976c-42da206b2dc1'::uuid, 'pescados'),     -- Rejos
  ('09ef8cdf-c024-4811-91c6-d2b81b0e245e'::uuid, 'pescados'),     -- Rejos fritos
  ('c1c1f94d-d22e-4d8a-bedd-02425f22a075'::uuid, 'pescados'),     -- Sepia a la Plancha
  -- Bocadillos y sándwiches
  ('6031b862-a52a-4757-9a67-f93e4f176f0f'::uuid, 'bocadillos'),   -- Bocadillos
  ('64418b82-c652-4a17-89fe-2821a82149d7'::uuid, 'bocadillos'),   -- Pepito de Ternera
  ('e3473243-3751-4542-82a3-58d79581067f'::uuid, 'bocadillos'),   -- Sándwich Mixto
  ('e272b2df-9d78-4f04-899f-bf1f4869abeb'::uuid, 'bocadillos'),   -- Sándwich Vegetal
  ('bee31940-e256-4c44-ad26-5f7611fcc413'::uuid, 'bocadillos'),   -- Serranito Casa Candy
  -- Hamburguesas
  ('b474f095-e7ee-461b-be29-006901afcd57'::uuid, 'hamburguesas'), -- Hamburguesa Candy al cuadrado
  ('384226c1-2cce-46a0-8094-57ab3f40af14'::uuid, 'hamburguesas'), -- Hamburguesa Completa
  ('7173a172-27f1-4694-8f78-ed59979da065'::uuid, 'hamburguesas'), -- Hamburguesa Crispy de Pollo
  ('40ada31c-c085-47f4-ae4f-99496ef8ad4a'::uuid, 'hamburguesas'), -- Hamburguesa Simple
  -- A la parrilla
  ('002e898f-6ef0-4c1e-908f-7e9c7ca0a35c'::uuid, 'parrilla'),     -- Chuletón vaca madurada a la parrilla
  ('d2b4d5d7-62a5-496d-b002-8d552c0f2982'::uuid, 'parrilla'),     -- Entrecot a la parrilla
  ('bb1b9921-1454-41d4-b3c1-ddeb0221f15d'::uuid, 'parrilla'),     -- Pluma ibérica a la parrilla
  ('5a3751da-0790-4a27-9a83-0334b496b325'::uuid, 'parrilla'),     -- Secreto Ibérico a la Parrilla
  -- Quesos
  ('b9890a2c-5f28-48a2-ad60-b1f4b726ba97'::uuid, 'quesos'),       -- Camembert
  ('a97b89dd-eae1-4fe2-86f3-a4fb6add0251'::uuid, 'quesos'),       -- Rulo de cabra
  ('39af5ba1-741a-40aa-a431-c7e0e572a854'::uuid, 'quesos'),       -- Surtido de quesos
  -- Ensaladas
  ('7a9fc4a6-f009-4d1b-b88b-a5cdab5a324a'::uuid, 'ensaladas'),    -- Ensalada Casa Candy
  -- Postres
  ('d1bc0435-a422-432d-b78f-1ca7c72d43aa'::uuid, 'postres'),      -- Tartas Artesanas
  -- Otros
  ('a79afc56-045c-456d-9fa7-1adcdf6f729e'::uuid, 'otros'),        -- Servicio Pan
  ('b41850b8-ad78-4683-aa70-963545e076a3'::uuid, 'otros'),        -- Litro + Ración a elegir
  -- No disponibles (available = false), invisibles con la anon key
  ('36f51706-05fc-4d18-ae2f-9f21602bfa1b'::uuid, 'pescados'),     -- Trucha a la Navarra
  ('eea2d1d3-74df-4b4b-84f3-925c2bdcd6c9'::uuid, 'postres'),      -- Gofre Casero
  ('3bc7ca4a-974d-4ad4-a647-170f2bf3909b'::uuid, 'postres')       -- Sapillo o Torrijas con Nata
) AS m(dish_id, slug)
WHERE d.id = m.dish_id AND c.slug = m.slug;

-- 4. COMPROBACIÓN: debe devolver 0 filas. Si sale algún plato, se creó
-- después de preparar esta migración.
SELECT id, name, category FROM public.dishes WHERE category_id IS NULL;
