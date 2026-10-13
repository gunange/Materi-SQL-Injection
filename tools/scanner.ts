// scanner.ts

const warnah = {
   reset: "\x1b[0m",
   green: "\x1b[32m",
   red: "\x1b[31m",
   yellow: "\x1b[33m",
   cyan: "\x1b[36m",
   magenta: "\x1b[35m",
   blue: "\x1b[34m",
   dim: "\x1b[2m",
};

const SHOW_VERBOSE = process.argv.includes("--verbose") || false;

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

// Warna tag untuk masing-masing HTTP method
const methodColors: Record<string, string> = {
   GET: warnah.green,
   POST: warnah.cyan,
   PUT: warnah.yellow,
   DELETE: warnah.red,
};

const DEFAULT_WORDLIST = [
   "admin",
   "login",
   "dashboard",
   "api",
   "api/login",
   "api/dosen",
   "api/admin",
   "api/mahasiswa",
];

async function runScan() {
   const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
   const targetUrl = args[0] || "http://localhost:3000";

   console.log(
      `${warnah.cyan}====================================================${warnah.reset}`
   );
   console.log(
      `${warnah.cyan}  🔍 Multi-Method Path Scanner (GET, POST, PUT, DEL) ${warnah.reset}`
   );
   console.log(
      `${warnah.cyan}====================================================${warnah.reset}`
   );
   console.log(`Target   : ${warnah.yellow}${targetUrl}${warnah.reset}`);
   console.log(`Wordlist : ${DEFAULT_WORDLIST.length} path`);
   console.log(`Methods  : ${HTTP_METHODS.join(", ")}`);
   console.log(
      `Verbose  : ${
         SHOW_VERBOSE
            ? warnah.green + "ON (tampilkan semua)"
            : warnah.yellow + "OFF (hanya path yang aktif/ada)"
      }${warnah.reset}`
   );
   console.log(`Memulai pemindaian...\n`);

   const cleanBaseUrl = targetUrl.replace(/\/+$/, "");
   let foundCount = 0;

   for (const path of DEFAULT_WORDLIST) {
      const fullUrl = `${cleanBaseUrl}/${path}`;

      for (const method of HTTP_METHODS) {
         const startTime = performance.now();
         const methodBadge = `${methodColors[method]}${method.padEnd(6)}${
            warnah.reset
         }`;

         try {
            const res = await fetch(fullUrl, {
               method: method,
               signal: AbortSignal.timeout(2000),
               headers: ["POST", "PUT"].includes(method)
                  ? { "Content-Type": "application/json" }
                  : undefined,
               body: ["POST", "PUT"].includes(method) ? "{}" : undefined,
            });

            const elapsed = Math.round(performance.now() - startTime);
            const status = res.status;
            if (status !== 404) {
               foundCount++;

               if (status >= 200 && status < 300) {
                  console.log(
                     `${warnah.green}[${status} OK]${
                        warnah.reset
                     }    ${methodBadge} /${path.padEnd(25)} ${
                        warnah.dim
                     }(${elapsed}ms)${warnah.reset}`
                  );
               } else if (status === 301 || status === 302) {
                  console.log(
                     `${warnah.yellow}[${status} REDIR]${
                        warnah.reset
                     } ${methodBadge} /${path.padEnd(25)} ${
                        warnah.dim
                     }(${elapsed}ms)${warnah.reset}`
                  );
               } else if (status === 401 || status === 403) {
                  console.log(
                     `${warnah.yellow}[${status} FORBID]${
                        warnah.reset
                     }${methodBadge} /${path.padEnd(25)} ${
                        warnah.dim
                     }(${elapsed}ms)${warnah.reset}`
                  );
               } else if (status === 405) {
                  console.log(
                     `${warnah.magenta}[405 METHOD]${
                        warnah.reset
                     }${methodBadge} /${path.padEnd(25)} ${
                        warnah.dim
                     }(${elapsed}ms)${warnah.reset}`
                  );
               } else {
                  console.log(
                     `${warnah.blue}[${status} INFO]${
                        warnah.reset
                     }  ${methodBadge} /${path.padEnd(25)} ${
                        warnah.dim
                     }(${elapsed}ms)${warnah.reset}`
                  );
               }
            } else if (SHOW_VERBOSE) {
               console.log(
                  `${warnah.dim}[404 NOT]   ${method.padEnd(6)} /${path.padEnd(
                     25
                  )} (${elapsed}ms)${warnah.reset}`
               );
            }
         } catch (err: any) {
            if (SHOW_VERBOSE) {
               console.log(
                  `${warnah.red}[ERR]        ${methodBadge} /${path.padEnd(
                     25
                  )} ${err.message}${warnah.reset}`
               );
            }
         }
      }
   }

   console.log(
      `\n${warnah.cyan}Pemindaian selesai! Menemukan ${foundCount} endpoint aktif.${warnah.reset}`
   );
}

runScan().catch((err) => console.error("Fatal Error:", err));
