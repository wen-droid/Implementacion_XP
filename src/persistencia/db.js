// src/persistencia/db.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://TU_URL.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;