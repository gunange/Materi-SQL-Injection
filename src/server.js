import { serve } from "bun";
import { query } from "./db.js";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;

serve({
   port: PORT,
   async fetch(req) {
      const url = new URL(req.url);
      const pathname = url.pathname;

      // --- STATIC FILES SERVING ---
      if (pathname === "/style.css") {
         const css = fs.readFileSync(
            path.join(import.meta.dir, "../public/style.css"),
            "utf-8"
         );
         return new Response(css, { headers: { "Content-Type": "text/css" } });
      }
      if (pathname === "/" || pathname === "/login") {
         const html = fs.readFileSync(
            path.join(import.meta.dir, "../public/login.html"),
            "utf-8"
         );
         return new Response(html, {
            headers: { "Content-Type": "text/html" },
         });
      }
      if (pathname === "/dashboard") {
         const html = fs.readFileSync(
            path.join(import.meta.dir, "../public/dashboard.html"),
            "utf-8"
         );
         return new Response(html, {
            headers: { "Content-Type": "text/html" },
         });
      }

      // --- API: LOGIN (RENTAN SQL INJECTION) ---
      if (pathname === "/api/login" && req.method === "POST") {
         try {
            const body = await req.json();
            const { username, password } = body;

            const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
            console.log("[DEBUG SQL]:", sql);

            const rows = await query(sql);

            if (rows.length > 0) {
               return Response.json({
                  success: true,
                  message: "Login Berhasil",
                  user: rows[0].username,
                  data: rows,
               });
            } else {
               return Response.json(
                  {
                     success: false,
                     message: "Username atau Password salah",
                     error: rows,
                  },
                  { status: 401 }
               );
            }
         } catch (err) {
            return Response.json(
               { success: false, error: err.message },
               { status: 500 }
            );
         }
      }

      // --- API: GET MAHASISWA & PENCARIAN (RENTAN SQL INJECTION) ---
      if (pathname === "/api/mahasiswa" && req.method === "GET") {
         try {
            const search = url.searchParams.get("search") || "";

            let sql = "";
            if (search) {
               sql = `SELECT * FROM mahasiswa WHERE nama LIKE '%${search}%' OR nim LIKE '%${search}%'`;
            } else {
               sql = `SELECT * FROM mahasiswa`;
            }

            console.log("[DEBUG SQL]:", sql);
            const rows = await query(sql);
            return Response.json(rows);
         } catch (err) {
            return Response.json({ error: err.message }, { status: 500 });
         }
      }

      // --- API: TAMBAH MAHASISWA (CREATE) DENGAN VALIDASI ---
      if (pathname === "/api/mahasiswa" && req.method === "POST") {
         try {
            const body = await req.json();
            const { nim, nama, jurusan } = body;

            // Validasi: Pastikan parameter body tidak kosong/undefined
            if (!nim || !nama || !jurusan) {
               return Response.json(
                  {
                     success: false,
                     error: "Parameter nim, nama, dan jurusan wajib diisi!",
                  },
                  { status: 400 }
               );
            }

            const sql = `INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)`;
            await query(sql, [nim, nama, jurusan]);
            return Response.json({
               success: true,
               message: "Data berhasil ditambahkan",
            });
         } catch (err) {
            return Response.json(
               { success: false, error: err.message },
               { status: 500 }
            );
         }
      }

      // --- API: UPDATE MAHASISWA (UPDATE) DENGAN VALIDASI ---
      if (pathname.startsWith("/api/mahasiswa/") && req.method === "PUT") {
         try {
            const id = pathname.split("/").pop();
            const body = await req.json();
            const { nim, nama, jurusan } = body;

            // Validasi: Pastikan parameter body tidak kosong/undefined
            if (!nim || !nama || !jurusan) {
               return Response.json(
                  {
                     success: false,
                     error: "Parameter nim, nama, dan jurusan wajib diisi!",
                  },
                  { status: 400 }
               );
            }

            const sql = `UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ? WHERE id = ?`;
            await query(sql, [nim, nama, jurusan, id]);
            return Response.json({
               success: true,
               message: "Data berhasil diubah",
            });
         } catch (err) {
            return Response.json(
               { success: false, error: err.message },
               { status: 500 }
            );
         }
      }

      // --- API: HAPUS MAHASISWA ---
      if (pathname.startsWith("/api/mahasiswa/") && req.method === "DELETE") {
         try {
            const id = pathname.split("/").pop();
            const sql = `DELETE FROM mahasiswa WHERE id = ?`;
            await query(sql, [id]);
            return Response.json({
               success: true,
               message: "Data berhasil dihapus",
            });
         } catch (err) {
            return Response.json(
               { success: false, error: err.message },
               { status: 500 }
            );
         }
      }

      return new Response("Not Found", { status: 404 });
   },
});

console.log(`Server berjalan di http://localhost:${PORT}`);
