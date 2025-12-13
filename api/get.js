import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const result = await client.query(
      'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC'
    );
    const rows = result.rows || [];
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database fetch failed",
      detail: err.message
    });
  }
}
