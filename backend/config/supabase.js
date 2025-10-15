const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam as variáveis de ambiente SUPABASE_URL e SUPABASE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
