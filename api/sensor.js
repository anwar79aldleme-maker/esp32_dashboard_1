import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { heartrate, spo2 } = req.body || {};

      if (heartrate == null || spo2 == null) {
        return res.status(400).json({ message: 'Missing sensor data' });
      }

      if (typeof heartrate !== 'number' || typeof spo2 !== 'number') {
        return res.status(400).json({ message: 'Invalid data types' });
      }

      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
        [heartrate, spo2]
      );

      return res.status(200).json({ message: 'Data saved successfully' });
    }

    if (req.method === 'GET') {
      const result = await client.query(
        'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC'
      );

      const data = result.rows.map(r => ({
        heartrate: r.heartrate,
        spo2: r.spo2,
        time: r.time
      }));

      return res.status(200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
}
