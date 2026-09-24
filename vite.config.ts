import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Custom Vite plugin: creates a dev-server API endpoint for Razorpay order creation.
// This keeps the key_secret on the server side — it never reaches the browser.
function razorpayOrderPlugin(): Plugin {
  return {
    name: 'razorpay-order-api',
    configureServer(server) {
      server.middlewares.use('/api/create-razorpay-order', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read request body
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { amount, currency, receipt } = JSON.parse(body);

            const env = loadEnv('development', process.cwd(), '');
            const keyId = env.VITE_RAZORPAY_KEY_ID;
            const keySecret = env.RAZORPAY_KEY_SECRET;

            if (!keyId || !keySecret) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Razorpay keys not configured in .env (VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET required)' }));
              return;
            }

            // Call Razorpay Orders API
            const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
            const response = await fetch('https://api.razorpay.com/v1/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
              },
              body: JSON.stringify({
                amount: amount || 100,
                currency: currency || 'INR',
                receipt: receipt || `pamwill_${Date.now()}`,
              }),
            });

            const data = await response.json();

            res.statusCode = response.ok ? 200 : 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

function apkServePlugin(): Plugin {
  return {
    name: 'apk-serve-middleware',
    configureServer(server) {
      server.middlewares.use('/apks', async (req, res, next) => {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const rawUrl = (req.url || '').split('?')[0];
          const filename = path.basename(rawUrl);
          const filePath = path.resolve(process.cwd(), 'apks', filename);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const stat = fs.statSync(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', stat.size);
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            return;
          }
        } catch (e) {
          console.error('Error serving apk:', e);
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), razorpayOrderPlugin(), apkServePlugin()],
  server: {
    port: 3000,
    host: true,   // allow external devices (phone on same WiFi)
    open: false,
  },
});
