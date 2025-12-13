import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { heartrate, spo2 } = req.body || {};
    if(heartrate == null || spo2 == null) return res.status(400).json({ message: 'Missing data' });

    await sql`
      INSERT INTO sensor_data (heartrate, spo2)
      VALUES (${heartrate}, ${spo2})
    `;

    return res.status(200).json({ message: 'Data saved successfully' });

  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: 'Database insert failed', detail: err.message });
  }
}
