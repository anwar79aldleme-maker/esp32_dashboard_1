import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { heartrate, spo2 } = req.body;
    if (heartrate == null || spo2 == null) {
      return res.status(400).json({ message: 'Missing sensor data' });
    }

    try {
      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
        [heartrate, spo2]
      );
      return res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Database insert failed', detail: err.message });
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
