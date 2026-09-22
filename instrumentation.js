// instrumentation.js (project root বা src/-এ)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log("✅ DNS servers set to Google Public DNS");
  }
}