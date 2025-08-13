/**
 * Supabase configuration - centralized and secure
 * These keys are safe to expose in the frontend as they are public keys
 */

// Note: These are Supabase public keys (anon role) - safe for frontend use
// They only allow operations permitted by Row Level Security policies
export const SUPABASE_CONFIG = {
  url: "https://lcfoqxvkiyfamgicojej.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZm9xeHZraXlmYW1naWNvamVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTEyODAsImV4cCI6MjA3MDMyNzI4MH0.M617VYFlhafNpzCipNJhMA2yDVXsOnPOTvipZPCGRNU"
} as const;

export const SUPABASE_OPTIONS = {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
} as const;