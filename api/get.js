import { neon } from "@neondatabase/serverless";

// تأكد من وضع DATABASE_URL في Environment Variables على Vercel
const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { lastTime } = req.query;

  try {
    const query = lastTime
      ? `SELECT id, heartrate, spo2, time FROM sensor_data WHERE time > $1 ORDER BY time ASC`
      : `SELECT id, heartrate, spo2, time FROM sensor_data ORDER BY time ASC LIMIT 50`;

    const result = await client.query(query, lastTime ? [lastTime] : []);

    const data = result.rows.map(row => ({
      id: row.id,
      heartrate: row.heartrate,
      spo2: row.spo2,
      time: row.time
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error("Neon fetch error:", err);
    return res.status(500).json({ message: "Database fetch failed", detail: err.message });
  }
}
