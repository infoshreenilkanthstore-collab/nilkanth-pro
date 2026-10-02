export default async function handler(req, res) {
  try {
    // Parse body parameters whether URL-encoded, JSON, or stream
    let body = {};
    if (req.body) {
      if (typeof req.body === "object") {
        body = req.body;
      } else if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch {
          body = Object.fromEntries(new URLSearchParams(req.body).entries());
        }
      }
    } else {
      // Buffer read fallback
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawText = Buffer.concat(buffers).toString("utf-8");
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch {
          body = Object.fromEntries(new URLSearchParams(rawText).entries());
        }
      }
    }

    const query = req.query || {};

    // Combine all parameters into URLSearchParams
    const searchParams = new URLSearchParams();

    // Append query params
    for (const [key, value] of Object.entries(query)) {
      if (key !== "provider" && value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }

    // Append body params (overrides/supplements query)
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }

    // Determine provider
    let provider = query.provider || body.provider || "";
    const reqUrl = req.url || "";
    if (!provider) {
      if (reqUrl.includes("icici") || body["Unique Ref Number"] || body.ReferenceNo) {
        provider = "icici";
      } else {
        provider = "easebuzz";
      }
    }
    searchParams.set("provider", provider);

    // Extract order_id / payment_id from txnid if missing (e.g. TXN_123_456_timestamp)
    const txnid = searchParams.get("txnid") || "";
    if (txnid.startsWith("TXN_")) {
      const parts = txnid.split("_");
      if (parts.length >= 2 && !searchParams.get("order_id")) {
        searchParams.set("order_id", parts[1]);
      }
      if (parts.length >= 3 && !searchParams.get("payment_id")) {
        searchParams.set("payment_id", parts[2]);
      }
    }

    const targetPath = `/checkout/callback/${provider}?${searchParams.toString()}`;

    // Return HTML bridge with instant client-side redirect and fallback
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifying Payment - Nilkanth Store</title>
  <meta http-equiv="refresh" content="0;url=${targetPath}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #fcfaf7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      color: #1c1917;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-radius: 24px;
      padding: 32px 24px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #fef3c7;
      border-top-color: #700b10;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h2 { font-size: 20px; font-weight: 700; color: #1c1917; margin-bottom: 8px; }
    p { font-size: 13px; color: #78716c; line-height: 1.5; margin-bottom: 20px; }
    .btn {
      display: inline-block;
      background: #700b10;
      color: #ffffff;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 12px 24px;
      border-radius: 9999px;
      transition: background 0.2s;
    }
    .btn:hover { background: #54060b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Verifying Payment</h2>
    <p>Please wait while we confirm your transaction and prepare your order receipt...</p>
    <a href="${targetPath}" class="btn">Click here if not redirected</a>
  </div>
  <script>
    window.location.replace(${JSON.stringify(targetPath)});
  </script>
</body>
</html>`);
  } catch (err) {
    console.error("Gateway callback bridge error:", err);
    res.writeHead(302, { Location: "/checkout" });
    res.end();
  }
}
