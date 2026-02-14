// Server wrapper to fix duplicate X-Forwarded-Host header
// from Cloudflare + OpenLiteSpeed proxy chain.
const http = require("http");
const net = require("net");

// ============================================
// APPROACH: Intercept at the LOWEST level
// by patching net.Server.prototype.emit
// to fix headers on every 'request' event
// ============================================

const originalEmit = net.Server.prototype.emit;

net.Server.prototype.emit = function (event, ...args) {
  if (event === "request") {
    const req = args[0];
    if (req && req.headers) {
      // Fix duplicate X-Forwarded-Host
      const fh = req.headers["x-forwarded-host"];
      if (fh && typeof fh === "string" && fh.includes(",")) {
        req.headers["x-forwarded-host"] = fh.split(",")[0].trim();
        console.log("[wrapper] Fixed X-Forwarded-Host:", fh, "→", req.headers["x-forwarded-host"]);
      }

      // Fix duplicate X-Forwarded-Proto
      const fp = req.headers["x-forwarded-proto"];
      if (fp && typeof fp === "string" && fp.includes(",")) {
        req.headers["x-forwarded-proto"] = fp.split(",")[0].trim();
      }

      // Debug: log first few requests
      if (!global._wrapperLogCount) global._wrapperLogCount = 0;
      if (global._wrapperLogCount < 3) {
        console.log("[wrapper] Request headers:", JSON.stringify({
          "x-forwarded-host": req.headers["x-forwarded-host"] || "(none)",
          "x-forwarded-proto": req.headers["x-forwarded-proto"] || "(none)",
          "host": req.headers["host"] || "(none)",
        }));
        global._wrapperLogCount++;
      }
    }
  }
  return originalEmit.apply(this, [event, ...args]);
};

console.log("[wrapper] Header fix loaded (net.Server.emit patch), starting Next.js server...");

// Load the actual Next.js server
require("./server.js");
