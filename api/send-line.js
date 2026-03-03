export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { targetId, messageText } = req.body;
  
  // 🟢 แก้ชื่อตัวแปรให้ตรงกับใน Vercel ของคุณ (VITE_LINE_ACCESS_TOKEN)
  const token = process.env.VITE_LINE_ACCESS_TOKEN;

  if (!token || !targetId) {
    return res.status(400).json({ error: 'Missing LINE token or targetId in Vercel Environment' });
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: targetId,
        messages: [{ type: 'text', text: messageText }]
      })
    });

    const data = await response.json();
    
    // ดักจับเผื่อ Token ผิด หรือส่งไม่ผ่าน
    if (!response.ok) {
       console.error("LINE API Error:", data);
       return res.status(response.status).json({ error: 'LINE API Error', details: data });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}