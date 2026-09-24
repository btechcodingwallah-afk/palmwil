const SUPABASE_URL = 'https://hauruoczbsxsgptojglt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdXJ1b2N6YnN4c2dwdG9qZ2x0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk0Njg3MywiZXhwIjoyMTA0NTIyODczfQ.KOumAq0ifEQ3aRuRSmiKAsIrGIBA_xpGij7FlKzDbCk';

async function testSqlApi() {
  // Test pg/sql endpoint
  try {
    const res = await fetch(`${SUPABASE_URL}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ query: 'SELECT 1;' })
    });
    console.log('/pg status:', res.status, await res.text());
  } catch (e) {
    console.log('/pg error:', e.message);
  }

  // Test sql endpoint
  try {
    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({})
    });
    console.log('/rest/v1/rpc status:', res2.status, await res2.text());
  } catch (e) {
    console.log('/rest/v1/rpc error:', e.message);
  }
}

testSqlApi();
