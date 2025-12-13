import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {

    /* ================= POST ================= */
    if (req.method === "POST") {
      const { heartrate, spo2 } = req.body || {};

      if (heartrate == null || spo2 == null) {
        return res.status(400).json({ message: "Missing sensor data" });
      }

      // 🔹 حفظ البيانات (الصحيح)
      await sql`
        INSERT INTO sensor_data (heartrate, spo2)
        VALUES (${heartrate}, ${spo2})
      `;

      return res.status(200).json({
        message: "Data saved successfully",
        heartrate,
        spo2
      });
    }

    /* ================= GET ================= */
    if (req.method === "GET") {
      const rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        ORDER BY time ASC
      `;

      return res.status(200).json(rows);
    }

    /* ================= OTHER ================= */
    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      detail: err.message
    });
  }
}
