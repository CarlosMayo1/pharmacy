import { createClient } from '@supabase/supabase-js'

const supabaseURL = process.env.REACT_APP_SUPABASE_ULR
const supbaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseURL, supbaseAnonKey)
