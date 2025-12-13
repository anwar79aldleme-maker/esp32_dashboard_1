import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const { lastTime } = req.query;

    let rows;

    if (lastTime) {
      // 🔹 جلب البيانات الجديدة فقط
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        WHERE time > ${lastTime}
        ORDER BY time ASC
        LIMIT 50
      `;
    } else {
      // 🔹 أول تحميل للصفحة
      rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        ORDER BY time DESC
        LIMIT 50
      `;
      rows = rows.reverse(); // ترتيب زمني صحيح
    }

    // حماية
    if (!rows || !Array.isArray(rows)) {
      return res.status(200).json([]);
    }

    res.status(200).json(rows);

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      message: "Database fetch failed",
      detail: err.message
    });
  }
}
