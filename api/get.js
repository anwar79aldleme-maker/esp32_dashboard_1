import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const result = await client.query(`
      SELECT heartrate, spo2, time
      FROM sensor_data
      ORDER BY time ASC
      LIMIT 1000
    `);

    const data = result.rows.map(row => ({
      heartrate: row.heartrate,
      spo2: row.spo2,
      time: row.time
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error("Neon fetch error:", err);
    return res.status(500).json({ message: 'Database fetch failed', detail: err.message });
  }
}
