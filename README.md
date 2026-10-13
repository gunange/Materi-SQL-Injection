# SQL Injection (SQLi) Demonstration Project

Aplikasi web sederhana yang dibangun menggunakan **Bun** dan **MariaDB** untuk demonstrasi teknis materi kerentanan **SQL Injection (SQLi)**. Project ini memisahkan logika backend dan frontend untuk kemudahan pemahaman.

> **PERINGATAN:** Aplikasi ini secara sengaja dirancang **TIDAK AMAN** (vulnerable) untuk tujuan edukasi dan demonstrasi materi pembelajaran keamanan siber. **Jangan pernah menerapkan sintaks query dalam project ini pada lingkungan produksi (production).**

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terpasang:
- [Bun](https://bun.sh/) (v1.0.0 atau lebih baru)
- [MariaDB](https://mariadb.org/) / MySQL Database Server

---

## 📁 Struktur Folder Project

```text
sqli-demo/
├── package.json
├── .env
├── README.md
├── src/
│   ├── db.js          # Koneksi pool MariaDB
│   ├── seeder.js      # Script otomatisasi database & dummy data
│   └── server.js      # Server HTTP & Endpoint API (Vulnerable)
└── public/
    ├── index.html     # Landing page
    ├── login.html     # Form Login
    └── dashboard.html # CRUD Mahasiswa & Fitur Pencarian
```

---

## 🚀 Langkah Instalasi & Inisialisasi

### 1. Clone / Siapkan Project
Buka terminal dan masuk ke direktori project Anda:
```bash
cd Materi-SQL-Injeqtion
```

### 2. Install Dependensi
Jalankan perintah berikut untuk menginstal library pendukung (`mariadb`):
```bash
bun install
```

### 3. Konfigurasi Environment (`.env`)
Buat file bernama `.env` pada root direktori project, lalu atur kredensial MariaDB Anda:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mariadb_anda
DB_NAME=sqli_demo_db
PORT=3000
```

### 4. Inisialisasi Database (Seeder)
Jalankan perintah seeder untuk membuat database `sqli_demo_db`, membuat tabel `users` & `mahasiswa`, serta mengisinya dengan data awal:
```bash
bun run db:seed
```

### 5. Jalankan Server
Jalankan server aplikasi dalam mode pengembangan (*hot-reload*):
```bash
bun run dev
```
Buka browser dan akses aplikasi di: **`http://localhost:3000`**

---

## 🧪 Skenario Demonstrasi SQL Injection

### 1. Bypass Authentication (Halaman Login)
* **URL:** `http://localhost:3000/login.html`
* **Kerentanan:** Menggunakan string concatenation pada query SQL login (`src/server.js`).
* **Payload Contoh:**
  - **Username:** `' OR '1'='1`
  - **Password:** *(Bebas/Kosong)*
* **Ekspektasi:** Berhasil masuk ke halaman dashboard tanpa mengetahui kreden sebenarnya dari pengguna (`admin`).

### 2. SQLi pada Fitur Pencarian (Dashboard)
* **URL:** `http://localhost:3000/dashboard.html`
* **Kerentanan:** Input kata kunci pencarian dimasukkan langsung ke klausa `LIKE` tanpa pembersihan/sanitasi.
* **Payload Contoh:**
  - **Input Cari:** `' OR '1'='1` (Menampilkan seluruh isi tabel tanpa filter)
  - **Input Cari:** `' UNION SELECT 1, username, password, 'Exposed' FROM users -- ` (Mengambil data dari tabel `users` lewat tabel `mahasiswa`).

---

## ⚙️ Perbaikan / Pengamanan (Remediation)

Untuk menutupi kerentanan SQL Injection pada aplikasi ini, ubah query berbasis rekonsiliasi string menjadi **Parameterized Queries / Prepared Statements**:

```javascript
// ❌ RENTAN (Vulnerable)
const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
const rows = await query(sql);

// ✅ AMAN (Secure)
const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
const rows = await query(sql, [username, password]);
```