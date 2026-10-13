// scanner.ts

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    dim: "\x1b[2m",
  };
  
  const DEFAULT_WORDLIST = [
    "admin",
    "login",
    "dashboard",
    "api",
    "api/login-vulnerable",
    "api/login-secure",
    "secret",
    "config",
    ".env",
    "backup.sql",
    "database.sql",
    "robots.txt",
    "phpmyadmin",
  ];
  
  // Bungkus dalam fungsi async
  async function runScan() {
    const targetUrl = process.argv[2] || "http://localhost:3000";
  
    console.log(`${colors.cyan}==========================================${colors.reset}`);
    console.log(`${colors.cyan}  🔍 Web Path Scanner (Bun Native Demo)  ${colors.reset}`);
    console.log(`${colors.cyan}==========================================${colors.reset}`);
    console.log(`Target  : ${colors.yellow}${targetUrl}${colors.reset}`);
    console.log(`Wordlist: ${DEFAULT_WORDLIST.length} path`);
    console.log(`Memulai pemindaian...\n`);
  
    const cleanBaseUrl = targetUrl.replace(/\/+$/, "");
  
    for (const path of DEFAULT_WORDLIST) {
      const fullUrl = `${cleanBaseUrl}/${path}`;
      const startTime = performance.now();
  
      try {
        const res = await fetch(fullUrl, {
          method: "GET",
          signal: AbortSignal.timeout(2000),
        });
  
        const elapsed = Math.round(performance.now() - startTime);
        const status = res.status;
  
        if (status >= 200 && status < 300) {
          console.log(
            `${colors.green}[${status} OK]${colors.reset}    /${path.padEnd(25)} ${colors.dim}(${elapsed}ms)${colors.reset}`
          );
        } else if (status === 301 || status === 302) {
          console.log(
            `${colors.yellow}[${status} REDIR]${colors.reset} /${path.padEnd(25)} ${colors.dim}(${elapsed}ms)${colors.reset}`
          );
        } else if (status === 401 || status === 403) {
          console.log(
            `${colors.yellow}[${status} FORBID]${colors.reset}/${path.padEnd(25)} ${colors.dim}(${elapsed}ms)${colors.reset}`
          );
        } else {
          console.log(
            `${colors.dim}[${status} NOT]   /${path.padEnd(25)} (${elapsed}ms)${colors.reset}`
          );
        }
      } catch (err: any) {
        console.log(
          `${colors.red}[ERR]        /${path.padEnd(25)} ${err.message}${colors.reset}`
        );
      }
    }
  
    console.log(`\n${colors.cyan}Pemindaian selesai!${colors.reset}`);
  }
  
  // Jalankan fungsinya
  runScan().catch((err) => console.error("Fatal Error:", err));
  