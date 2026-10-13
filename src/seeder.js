import mariadb from 'mariadb';

async function seed() {
  // 1. Buat koneksi awal tanpa spesifik database (untuk membuat DB jika belum ada)
  const conn = await mariadb.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    const dbName = process.env.DB_NAME || 'sqli_demo_db';

    console.log('Menyiapkan database...');
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await conn.query(`USE ${dbName}`);

    // 2. Drop tabel lama jika ingin reset total (opsional)
    console.log('Menghapus tabel lama (jika ada)...');
    await conn.query(`DROP TABLE IF EXISTS mahasiswa`);
    await conn.query(`DROP TABLE IF EXISTS users`);

    // 3. Buat tabel users
    console.log('Membuat tabel users...');
    await conn.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50)
      )
    `);

    // Masukkan data dummy users
    await conn.query(`
      INSERT INTO users (username, password) VALUES 
      ('admin', 'admin123'),
      ('dosen', 'dosenrahasia')
    `);

    // 4. Buat tabel mahasiswa
    console.log('Membuat tabel mahasiswa...');
    await conn.query(`
      CREATE TABLE mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim VARCHAR(20),
        nama VARCHAR(100),
        jurusan VARCHAR(50)
      )
    `);

    // Masukkan data dummy mahasiswa
    await conn.query(`
      INSERT INTO mahasiswa (nim, nama, jurusan) VALUES 
      ('101', 'Budi Santoso', 'Teknik Informatika'),
      ('102', 'Siti Rahma', 'Sistem Informasi'),
      ('103', 'Andi Pratama', 'Teknik Komputer'),
      ('104', 'Dewi Lestari', 'Ilmu Komputer')
    `);

    console.log('Seeder berhasil dijalankan! Database dan tabel siap digunakan.');
  } catch (err) {
    console.error('Terjadi kesalahan saat seeding:', err);
  } finally {
    if (conn) conn.end();
  }
}

seed();