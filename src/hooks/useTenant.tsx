import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TenantSettings {
  theme?: string;
  features?: {
    pwa?: boolean;
    offline?: boolean;
  };
  [key: string]: any;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: TenantSettings;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const detectTenantFromUrl = (): string | null => {
    // Detectar tenant por dominio o subdomain
    const hostname = window.location.hostname;
    
    // Si es un dominio personalizado (no lovable.app)
    if (!hostname.includes('lovable.app') && !hostname.includes('localhost')) {
      return null; // Se buscará por dominio en la BD
    }
    
    // Si es subdomain.lovable.app, extraer el slug
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0]; // primer segmento es el slug
    }
    
    // Fallback: buscar en path (para desarrollo local)
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
      return pathParts[1];
    }
    
    return null;
  };

  const fetchTenant = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Primero intentar detectar tenant por URL
      const tenantSlug = detectTenantFromUrl();
      const hostname = window.location.hostname;
      
      let query = supabase
        .from('tenants')
        .select('*')
        .eq('status', 'active');
      
      // Si tenemos un slug de la URL, buscar por slug
      if (tenantSlug) {
        query = query.eq('slug', tenantSlug);
      } 
      // Si es un dominio personalizado, buscar por dominio
      else if (!hostname.includes('lovable.app') && !hostname.includes('localhost')) {
        query = query.eq('domain', hostname);
      }
      // Si no, obtener el tenant del usuario desde tenant_memberships
      else {
        const { data: membership } = await supabase
          .from('tenant_memberships')
          .select('tenant_id')
          .eq('user_id', user.id)
          .single();
        
        if (membership?.tenant_id) {
          query = query.eq('id', membership.tenant_id);
        }
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setTenant(data as Tenant);
        // Aplicar theming dinámico
        applyTenantTheming(data as Tenant);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  const applyTenantTheming = (tenantData: Tenant) => {
    const root = document.documentElement;
    
    // Convertir colores HEX a HSL
    const hexToHSL = (hex: string): string => {
      // Remover el # si existe
      hex = hex.replace('#', '');
      
      // Convertir a RGB
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      return `${h} ${s}% ${l}%`;
    };
    
    // Aplicar colores personalizados
    if (tenantData.primary_color) {
      root.style.setProperty('--primary', hexToHSL(tenantData.primary_color));
    }
    if (tenantData.secondary_color) {
      root.style.setProperty('--secondary', hexToHSL(tenantData.secondary_color));
    }
    if (tenantData.accent_color) {
      root.style.setProperty('--accent', hexToHSL(tenantData.accent_color));
    }
    
    // Actualizar favicon si hay logo
    if (tenantData.logo_url) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = tenantData.logo_url;
      }
    }
    
    // Actualizar título de la página
    document.title = tenantData.name;
  };

  useEffect(() => {
    fetchTenant();
  }, [user]);

  const value = {
    tenant,
    loading,
    refetch: fetchTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
