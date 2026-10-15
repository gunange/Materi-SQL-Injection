# SQL Dasar dan SQL Injection (SQLi)

## 1. Pengertian SQL

SQL (*Structured Query Language*) adalah bahasa yang digunakan untuk berinteraksi dengan database, seperti MariaDB. Dalam pengujian keamanan web, pemahaman SQL membantu kita mengetahui bagaimana aplikasi mengambil data dan bagaimana kesalahan dalam pengolahan input dapat menyebabkan SQL Injection.

## 2. Query SQL yang Sering Digunakan

### SELECT
Digunakan untuk mengambil data dari tabel.

```sql
SELECT * FROM users;
```

### WHERE
Digunakan untuk menentukan kondisi data yang ingin dicari.

```sql
SELECT * FROM users
WHERE username = 'admin';
```

### AND
Menggabungkan dua kondisi. Kedua kondisi harus benar agar hasil memenuhi syarat.

```sql
SELECT * FROM users
WHERE username = 'admin'
AND id = 1;
```

### OR
Menggabungkan dua kondisi. Salah satu kondisi yang benar sudah cukup untuk membuat hasil memenuhi syarat.

```sql
SELECT * FROM users
WHERE username = 'admin'
OR username = 'user';
```

### LIKE
Digunakan untuk mencari data berdasarkan pola tertentu.

```sql
SELECT * FROM users
WHERE username LIKE 'adm%';
```

Simbol `%` mewakili nol atau lebih karakter.

### ORDER BY
Mengurutkan hasil query.

```sql
SELECT * FROM users
ORDER BY id DESC;
```

### LIMIT
Membatasi jumlah data yang ditampilkan.

```sql
SELECT * FROM users
LIMIT 5;
```

### UNION SELECT
Menggabungkan hasil dari dua query `SELECT`. Jumlah kolom yang dipilih harus sama, dan tipe data kolom yang berpasangan harus kompatibel.

```sql
SELECT id, username FROM users
UNION
SELECT id, username FROM admins;
```

`UNION` secara default menghilangkan baris duplikat. `UNION ALL` mempertahankan duplikat.

## 3. Memahami SQL Injection

SQL Injection (SQLi) adalah kerentanan yang terjadi ketika input pengguna dapat mengubah struktur atau logika query SQL yang dibuat oleh aplikasi.

Contohnya, aplikasi login dapat membentuk query seperti berikut:

```sql
SELECT * FROM users
WHERE username = 'INPUT_USERNAME'
AND password = 'INPUT_PASSWORD';
```

Apabila input digabungkan langsung ke dalam query tanpa penanganan yang tepat, input tersebut berpotensi mengubah cara database mengevaluasi kondisi.

### Memahami `OR 1=1`

Perhatikan ekspresi berikut:

```sql
OR 1=1
```

Penjelasan:
- `OR`: operator logika yang menggabungkan kondisi.
- `1=1`: kondisi yang selalu benar.
- Jika salah satu kondisi yang dihubungkan dengan `OR` benar, hasil keseluruhan menjadi benar.

Contoh query untuk memahami logikanya:

```sql
SELECT * FROM users
WHERE username = 'admin'
OR 1=1;
```

Karena `1=1` selalu benar, kondisi `WHERE` terpenuhi untuk semua baris tabel.

Namun, ekspresi tersebut tidak otomatis melewati proses login. Dampaknya bergantung pada struktur query aplikasi dan bagaimana hasil database digunakan untuk memutuskan autentikasi.

### Membandingkan `1=1` dan `1=2`

```sql
SELECT * FROM users WHERE id = 1 AND 1=1;
```

Kondisi tambahan benar, sehingga hasil tetap mengikuti kondisi `id = 1`.

```sql
SELECT * FROM users WHERE id = 1 AND 1=2;
```

Kondisi tambahan salah, sehingga tidak ada baris yang dapat memenuhi keseluruhan kondisi.

Perbandingan ini membantu menjelaskan bagaimana operator logika memengaruhi hasil query.

## 4. Komentar SQL

Komentar digunakan untuk menandai bagian query yang tidak perlu dieksekusi sebagai perintah SQL.

### Komentar dengan `--`

```sql
SELECT * FROM users; -- komentar
```

Di MariaDB, `--` harus diikuti whitespace atau karakter kontrol agar dikenali sebagai awal komentar.

### Komentar dengan `#`

```sql
SELECT * FROM users; # komentar
```

MariaDB juga mendukung `#` sebagai penanda komentar hingga akhir baris.

### Komentar blok `/* ... */`

```sql
SELECT * FROM users /* komentar */;
```

Komentar blok dapat berada di antara bagian query.

Dalam konteks SQL Injection, sintaks komentar perlu dipahami karena dapat memengaruhi cara database membaca sisa query. Dampaknya bergantung pada konteks input dan struktur query yang dibentuk aplikasi.

## 5. Pola yang Sering Ditemui Saat Pengujian SQLi

| Pola | Tujuan pembelajaran |
|---|---|
| `'` | Mengamati apakah tanda kutip memicu kesalahan sintaks |
| `OR 1=1` | Memahami kondisi alternatif yang selalu benar |
| `OR 1=2` | Memahami kondisi alternatif yang selalu salah |
| `AND 1=1` | Menguji kondisi tambahan yang benar |
| `AND 1=2` | Menguji kondisi tambahan yang salah |
| `--` | Memahami komentar satu baris pada MariaDB |
| `#` | Memahami komentar satu baris khas MariaDB |
| `UNION SELECT` | Memahami penggabungan hasil query |

Pola-pola tersebut merupakan bahan untuk memahami dan menguji perilaku SQL. Keberhasilan eksploitasi tidak dapat disimpulkan hanya dari penggunaan satu pola.

## 6. Kesimpulan

SQL Injection bukan sekadar memasukkan karakter khusus ke dalam form. Kerentanan terjadi ketika input pengguna dapat memengaruhi struktur atau logika query SQL yang dieksekusi aplikasi.

Pemahaman terhadap `SELECT`, `WHERE`, `AND`, `OR`, komentar SQL, dan `UNION SELECT` merupakan dasar untuk memahami bagaimana SQL Injection bekerja pada aplikasi web yang terhubung ke database.

Seluruh pengujian praktik sebaiknya dilakukan pada aplikasi lab sendiri dengan akun dan data dummy.
