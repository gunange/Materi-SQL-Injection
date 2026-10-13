import mariadb from 'mariadb';

async function seed() {
  let conn;
  try {
    console.log('Menghubungkan ke server MariaDB...');
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'sqli_demo_db';

    console.log('Menyiapkan database...');
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await conn.query(`USE ${dbName}`);

    console.log('Menghapus tabel lama (jika ada)...');
    await conn.query(`DROP TABLE IF EXISTS mahasiswa`);
    await conn.query(`DROP TABLE IF EXISTS users`);

    console.log('Membuat tabel users...');
    await conn.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50)
      )
    `);

    await conn.query(`
      INSERT INTO users (username, password) VALUES 
      ('admin', 'admin123'),
      ('dosen', 'dosenrahasia')
    `);

    console.log('Membuat tabel mahasiswa...');
    await conn.query(`
      CREATE TABLE mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim TEXT,
        nama TEXT,
        jurusan TEXT
      )
    `);

    await conn.query(`
      INSERT INTO mahasiswa (nim, nama, jurusan) VALUES 
      ('101', 'Budi Santoso', 'Teknik Informatika'),
      ('102', 'Siti Rahma', 'Sistem Informasi'),
      ('103', 'Andi Pratama', 'Teknik Komputer'),
      ('104', 'Dewi Lestari', 'Ilmu Komputer')
    `);

    console.log('✅ Seeder berhasil dijalankan! Database dan tabel siap digunakan.');
  } catch (err) {
    console.error('❌ Gagal terhubung atau menjalankan seeder ke database:');
    if (err.code === 'ECONNREFUSED') {
      console.error('-> Pastikan layanan MariaDB Anda sudah aktif/menyala.');
    } else {
      console.error(`-> Pesan Error: ${err.message}`);
    }
  } finally {
    if (conn) conn.end();
  }
}

seed();