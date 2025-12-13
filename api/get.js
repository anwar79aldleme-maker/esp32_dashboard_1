import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // جلب جميع البيانات بترتيب زمني تصاعدي
    const rows = await sql`
      SELECT heartrate, spo2, time
      FROM sensor_data
      ORDER BY time ASC
    `;

    // rows هنا بالفعل مصفوفة جاهزة
    if (!Array.isArray(rows)) throw new Error('Invalid data from database');

    res.status(200).json(rows);

  } catch (err) {
    console.error('Database fetch error:', err);
    res.status(500).json({ message: 'Database fetch failed', detail: err.message });
  }
}
