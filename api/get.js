import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const result = await client.query(
      `SELECT heartrate, spo2, time 
       FROM sensor_data 
       ORDER BY time ASC 
       LIMIT 50`
    );

    const data = (result.rows || []).map(r => ({
      heartrate: r.heartrate,
      spo2: r.spo2,
      time: r.time
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Database fetch error:", error);
    return res.status(500).json({ message: "Database fetch failed", detail: error.message });
  }
}
