import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const rows = await sql`
      SELECT heartrate, spo2, time
      FROM sensor_data
      ORDER BY time DESC
      LIMIT 50
    `;

    // 🔒 حماية مهمة
    if (!rows || !Array.isArray(rows)) {
      return res.status(200).json([]);
    }

    res.status(200).json(rows.reverse()); // ⬅️ ترتيب زمني صحيح

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database fetch failed",
      detail: err.message
    });
  }
}

