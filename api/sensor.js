import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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

      try {
        await sql`
          INSERT INTO sensor_data (heartrate, spo2, time)
          VALUES (${heartrate}, ${spo2}, NOW())
        `;
        return res.status(200).json({ message: 'Data saved successfully' });
      } catch (err) {
        return res.status(500).json({ message: 'Database insert failed', detail: err.message });
      }

    } else if (req.method === 'GET') {
      try {
        const rows = await sql`
          SELECT heartrate, spo2, time
          FROM sensor_data
          ORDER BY time ASC
        `;
        return res.status(200).json(rows);
      } catch (err) {
        return res.status(500).json({ message: 'Database fetch failed', detail: err.message });
      }

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
}
