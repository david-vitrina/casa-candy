-- Update hero_background settings to use the correct image path
UPDATE site_settings 
SET value = jsonb_build_object(
  'image_url', '/src/assets/hero-background.jpg',
  'overlay_opacity', 0.3,
  'gradient_enabled', true
)
WHERE key = 'hero_background';