import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC LIMIT 50');
      const data = result.rows.map(r => ({
        heartrate: r.heartrate,
        spo2: r.spo2,
        time: r.time
      }));
      return res.status(200).json(data);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database fetch failed', detail: err.message });
  }
}
