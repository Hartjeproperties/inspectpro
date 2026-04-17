export default async function handler(req, res) {
  // Set CORS headers so the frontend can call this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { webhookUrl, payload } = req.body;

    if (!webhookUrl || !webhookUrl.includes("hooks.zapier.com")) {
      return res.status(400).json({ error: "Invalid webhook URL" });
    }

    // Server-side call to Zapier — no CORS issues
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      response: text,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
