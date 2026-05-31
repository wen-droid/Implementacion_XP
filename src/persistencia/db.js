// src/persistencia/db.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqzsahvgafyrjgzgtzgk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qhd9xdbSnfbWYwYiiPmUog__jPBtVR8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;