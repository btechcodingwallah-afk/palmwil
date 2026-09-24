import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hauruoczbsxsgptojglt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdXJ1b2N6YnN4c2dwdG9qZ2x0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk0Njg3MywiZXhwIjoyMTA0NTIyODczfQ.KOumAq0ifEQ3aRuRSmiKAsIrGIBA_xpGij7FlKzDbCk';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('services').select('*').limit(1);
  console.log('Services query result:', { data, error });
}

testConnection().catch(console.error);
