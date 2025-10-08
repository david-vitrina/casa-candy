-- Agregar políticas RLS para lectura pública de tenants y platos activos
-- Esto permite que usuarios no autenticados puedan ver el menú en builds específicos

-- Política para que tenants activos sean visibles públicamente
CREATE POLICY "Public can view active tenants"
ON tenants FOR SELECT
USING (status = 'active');

-- Política para que platos disponibles sean visibles públicamente
CREATE POLICY "Public can view available dishes"
ON dishes FOR SELECT
USING (
  available = true
  AND tenant_id IN (
    SELECT id FROM tenants WHERE status = 'active'
  )
);