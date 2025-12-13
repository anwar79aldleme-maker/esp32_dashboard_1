import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // جلب كل البيانات من جدول sensor_data
    const result = await client.query(
      'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC'
    );

    const data = result.rows.map(r => ({
      heartrate: r.heartrate,
      spo2: r.spo2,
      time: r.time
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error('Database fetch error:', err);
    return res.status(500).json({ message: 'Database fetch failed', detail: err.message });
  }
}
