import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Crée un client Supabase pour le serveur (Server Components)
 * 
 * Ce client est utilisé dans les Server Components et Server Actions
 * pour interagir avec Supabase depuis le serveur Next.js.
 * 
 * Gère automatiquement les cookies pour l'authentification.
 * 
 * @returns {Promise<ReturnType<typeof createServerClient>>} Client Supabase pour le serveur
 */
export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes. ' +
      'Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY sont définies dans .env.local'
    )
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /**
       * Récupère tous les cookies depuis le store Next.js
       */
      getAll() {
        return cookieStore.getAll()
      },
      /**
       * Définit tous les cookies dans le store Next.js
       * Gère les erreurs silencieusement pour les Server Components
       */
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Ignorer les erreurs lors de la définition des cookies
          // dans les Server Components (comportement normal)
        }
      },
    },
  })
}

