const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_kampus',
  port: Number(process.env.DB_PORT || 3306)
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const route = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
app.get('/api/mahasiswa', route(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM mahasiswa ORDER BY id DESC');
  res.json(rows);
}));
function validate(req, res, next) {
  const limits = { nim: 20, nama: 100, jurusan: 50, email: 100 };
  const data = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = req.body?.[key];
    if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
      return res.status(400).json({ success: false, message: `Isian ${key} tidak valid.` });
    }
    data[key] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ success: false, message: 'Email tidak valid.' });
  }
  req.mahasiswa = Object.values(data);
  next();
}
app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({ success: false, message: 'ID tidak valid.' });
  }
  next();
});
app.post('/api/mahasiswa', validate, route(async (req, res) => {
  const [result] = await db.execute('INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES (?, ?, ?, ?)', req.mahasiswa);
  res.status(201).json({ success: true, id: result.insertId, message: 'Data mahasiswa berhasil disimpan!' });
}));
app.put('/api/mahasiswa/:id', validate, route(async (req, res) => {
  const [result] = await db.execute('UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, email = ? WHERE id = ?', [...req.mahasiswa, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan.' });
  res.json({ success: true, message: 'Data mahasiswa berhasil diperbarui!' });
}));
app.delete('/api/mahasiswa/:id', route(async (req, res) => {
  const [result] = await db.execute('DELETE FROM mahasiswa WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan.' });
  res.json({ success: true, message: 'Data mahasiswa berhasil dihapus!' });
}));
app.use((err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'NIM sudah terdaftar!' });
  if (err.status === 400) return res.status(400).json({ success: false, message: 'Format JSON tidak valid.' });
  console.error(err.message);
  res.status(500).json({ success: false, message: 'Gagal mengakses database. Periksa MySQL Laragon.' });
});
if (require.main === module) app.listen(PORT, () => console.log(`Server CRUD aktif di http://localhost:${PORT}`));
module.exports = { app, db };
