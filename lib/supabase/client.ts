import { createBrowserClient } from '@supabase/ssr'

/**
 * Crée un client Supabase pour le navigateur (Browser)
 * 
 * Ce client est utilisé dans les composants React côté client (avec "use client")
 * pour interagir avec Supabase depuis le navigateur.
 * 
 * @returns {ReturnType<typeof createBrowserClient>} Client Supabase pour le navigateur
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes. ' +
      'Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY sont définies dans .env.local'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

