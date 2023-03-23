
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export default supabase


// import { createClient } from '@supabase/supabase-js'

// const isProduction = process.env.NODE_ENV === 'production'
// console.log('NODE_ENV:', process.env.NODE_ENV)
// console.log('NEXT_PUBLIC_SUPABASE_URL_PRODUCTION:', process.env.NEXT_PUBLIC_SUPABASE_URL_PRODUCTION)
// console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY_PRODUCTION:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PRODUCTION)
// console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
// console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


// const supabaseUrl = isProduction
//   ? process.env.NEXT_PUBLIC_SUPABASE_URL_PRODUCTION
//   : process.env.NEXT_PUBLIC_SUPABASE_URL

// const supabaseAnonKey = isProduction
//   ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PRODUCTION
//   : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// console.log('supabaseUrl:', supabaseUrl)
// console.log('supabaseAnonKey:', supabaseAnonKey)

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase URL or Anon Key is missing.')
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey)

// export default supabase