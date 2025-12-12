import { neon } from '@neondatabase/serverless';

// تأكد من إضافة DATABASE_URL في متغيرات البيئة على Vercel
const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // جلب آخر 50 قراءة من جدول sensor_data
    const result = await client.query(
      `SELECT heartrate, spo2, time 
       FROM sensor_data 
       ORDER BY time ASC 
       LIMIT 50`
    );

    const rows = result.rows || result;

    const data = rows.map(r => ({
      heartrate: r.heartrate,
      spo2: r.spo2,
      time: r.time
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error('Database fetch error:', err.message);
    res.status(500).json({ message: 'Database fetch failed', detail: err.message });
  }
}
