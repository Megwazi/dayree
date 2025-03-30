import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log para debug
console.log('Environment variables:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? 'present' : 'missing',
  key: supabaseAnonKey ? 'present' : 'missing'
})

// Se estiver em desenvolvimento, mostra um aviso mais amigável
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing.')
  console.warn('Please check if you have set up your .env file or environment variables in Vercel.')
  console.warn('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
}

// Cria o cliente mesmo se as variáveis estiverem faltando
// Isso permite que o app carregue e mostre um erro mais amigável
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
) 