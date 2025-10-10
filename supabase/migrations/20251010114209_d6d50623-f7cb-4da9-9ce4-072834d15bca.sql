-- Fix hero_background settings to use empty string so it falls back to the imported default image
UPDATE site_settings 
SET value = jsonb_build_object(
  'image_url', '',
  'overlay_opacity', 0.3,
  'gradient_enabled', true
)
WHERE key = 'hero_background';