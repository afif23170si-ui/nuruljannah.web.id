// Server wrapper to fix duplicate X-Forwarded-Host header
// from Cloudflare + OpenLiteSpeed proxy chain.
const http = require("http");

// Save original
const originalCreateServer = http.createServer;

// Patch createServer to intercept ALL incoming requests
http.createServer = function (...args) {
  // Find the request handler (last function argument)
  const handlerIndex = args.findIndex((a) => typeof a === "function");

  if (handlerIndex !== -1) {
    const originalHandler = args[handlerIndex];
    args[handlerIndex] = function (req, res) {
      // Fix duplicate X-Forwarded-Host
      const fh = req.headers["x-forwarded-host"];
      if (fh && typeof fh === "string" && fh.includes(",")) {
        req.headers["x-forwarded-host"] = fh.split(",")[0].trim();
        console.log("[wrapper] Fixed duplicate X-Forwarded-Host");
      }

      // Fix duplicate X-Forwarded-Proto
      const fp = req.headers["x-forwarded-proto"];
      if (fp && typeof fp === "string" && fp.includes(",")) {
        req.headers["x-forwarded-proto"] = fp.split(",")[0].trim();
      }

      return originalHandler.call(this, req, res);
    };
  }

  return originalCreateServer.apply(this, args);
};

console.log("[wrapper] Header fix loaded, starting Next.js server...");

// Load the actual Next.js server
require("./server.js");
