// api/get.js
import { neon } from '@neondatabase/serverless';
const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const result = await client.query(
      `SELECT heartrate, spo2, time
       FROM sensor_data
       ORDER BY time DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) return res.status(200).json([]);
    
    const last = result.rows[0];
    return res.status(200).json([{
      heartrate: last.heartrate,
      spo2: last.spo2,
      time: last.time
    }]);
  } catch (error) {
    console.error("Database fetch error:", error);
    return res.status(500).json({ message: "Database fetch failed", detail: error.message });
  }
}
