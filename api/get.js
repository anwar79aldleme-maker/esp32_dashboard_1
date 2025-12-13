import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // آخر وقت وصل من الداشبورد
    const { lastTime } = req.query;

    let rows;

    if (lastTime) {
      // جلب القيم الجديدة فقط
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        WHERE time > ${lastTime}
        ORDER BY time ASC
      `;
    } else {
      // أول تحميل → آخر 50 قراءة فقط
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        ORDER BY time DESC
        LIMIT 50
      `;
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("API GET ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}
