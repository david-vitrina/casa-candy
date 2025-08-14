# David Burger Menu Magic (Privado)

Este repositorio es un proyecto privado para la aplicación React de "David Burger". Contiene el frontend (Vite + React + TypeScript + Tailwind + shadcn-ui) e integración con Supabase.

Importante: Este código y su documentación son confidenciales. No compartas enlaces, capturas ni credenciales fuera del equipo autorizado.

## Requisitos
- Node.js 18+ y npm 9+ (recomendado instalar con nvm: https://github.com/nvm-sh/nvm)
- Acceso al repositorio privado
- (Opcional) Cuenta y proyecto en Netlify para despliegues privados
- (Opcional) Proyecto en Supabase (para autenticación y datos)

## Instalación y ejecución
1. Clonar el repositorio
   ```sh
   git clone <URL_DEL_REPO_PRIVADO>
   cd david-burger-menu-magic
   ```
2. Instalar dependencias
   ```sh
   npm install
   ```
3. Ejecutar en desarrollo
   ```sh
   npm run dev
   ```
   Abrir el navegador en la URL que muestre Vite (por defecto http://localhost:5173).

## Scripts disponibles
- `npm run dev`: Inicia el servidor de desarrollo con recarga en caliente.
- `npm run build`: Genera el build de producción en `dist/`.
- `npm run build:dev`: Build en modo development (útil para diagnósticos de bundling).
- `npm run preview`: Sirve localmente el build de `dist/` para pruebas.
- `npm run lint`: Ejecuta ESLint sobre el proyecto.

## Variables y configuración (Supabase)
Actualmente la configuración de Supabase está centralizada en `src/config/supabase.ts` con URL y anonKey públicas (rol anon). Al ser un proyecto privado, recomendamos mover estos valores a variables de entorno de Vite y no commitear credenciales:

1) Crear un archivo `.env.local` (no se sube al repo) en la raíz del proyecto con:
```
VITE_SUPABASE_URL=... 
VITE_SUPABASE_ANON_KEY=...
```
2) Actualizar `src/config/supabase.ts` para leer desde `import.meta.env`:
```ts
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL!,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
} as const;
```
Si prefieres mantener la configuración hardcodeada por ahora, asegúrate de que los valores correspondan al proyecto correcto de Supabase y que las RLS policies estén configuradas adecuadamente.

La instancia del cliente se crea en `src/integrations/supabase/client.ts`.

## Despliegue (privado)
Este proyecto es una SPA. El directorio `public/_redirects` ya está preparado para SPA routing (React Router). Para un despliegue privado en Netlify:

1. Crear un sitio en Netlify y conectarlo a este repo privado o subir manualmente la carpeta `dist/` tras ejecutar `npm run build`.
2. Configuración recomendada:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18+
   - Variables en Netlify (si usas env vars): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Asegura que el sitio quede restringido (por ejemplo, mediante protección por contraseña en Netlify, o con autenticación en la app) si no debe ser público.

También puedes desplegar en Vercel o cualquier hosting estático compatible con SPA.

## Estructura del proyecto (resumen)
- `src/` Código fuente de la app (páginas, componentes, hooks, estilos)
- `public/` Archivos estáticos y `_redirects` para SPA
- `supabase/` Configuración relacionada con Supabase
- `dist/` Salida del build de producción

## Tecnología
- Vite
- TypeScript
- React 18
- Tailwind CSS + shadcn-ui
- TanStack Query
- Supabase JS
- React Router

## Buenas prácticas y seguridad (proyecto privado)
- No compartas el repositorio, credenciales, ni URLs de despliegue fuera del equipo.
- Usa `.env.local` para variables sensibles y configúralas en el proveedor de hosting.
- Revisa políticas RLS en Supabase antes de exponer endpoints.
- Realiza `npm run lint` y pruebas manuales antes de abrir PRs.

## Solución de problemas
- Error de módulos o tipos: elimina `node_modules` y `package-lock.json`, luego `npm install`.
- Variables de entorno no disponibles en producción: verifica que existan en la plataforma de despliegue con el prefijo `VITE_`.
- Rutas rompen en refresco: confirma que `public/_redirects` esté incluido en el build y que el hosting respete la configuración para SPA.

---
Última actualización: 2025-08-13
