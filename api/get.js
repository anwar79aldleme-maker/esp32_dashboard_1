import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const { lastTime } = req.query;

    let rows;
    if(lastTime){
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        WHERE time > ${lastTime}
        ORDER BY time ASC
      `;
    } else {
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        ORDER BY time ASC
      `;
    }

    if (!rows || !Array.isArray(rows)) return res.status(200).json([]);

    return res.status(200).json(rows);

  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Database fetch failed", detail: err.message });
  }
}
