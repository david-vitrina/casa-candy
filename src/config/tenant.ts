/**
 * Configuración de tenant hardcodeado para deployments específicos
 * 
 * En deployments de Netlify, cada sitio puede tener un VITE_TENANT_ID
 * específico que lo ancla a un tenant particular en la base de datos.
 * 
 * Esto permite múltiples frontends independientes conectados al mismo backend.
 */
export const HARDCODED_TENANT_ID = import.meta.env.VITE_TENANT_ID || null;
