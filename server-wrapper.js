// Server wrapper to fix duplicate X-Forwarded-Host header
// from Cloudflare + OpenLiteSpeed proxy chain.
//
// Problem: Both Cloudflare and OpenLiteSpeed add X-Forwarded-Host,
// resulting in "domain.com, domain.com" which Auth.js can't parse.
//
// Solution: Intercept at HTTP level before Next.js processes the request,
// keeping only the first value.

const http = require("http");

const _createServer = http.createServer.bind(http);

http.createServer = (requestHandler) => {
  return _createServer((req, res) => {
    // Fix duplicate X-Forwarded-Host
    const fh = req.headers["x-forwarded-host"];
    if (fh && typeof fh === "string" && fh.includes(",")) {
      req.headers["x-forwarded-host"] = fh.split(",")[0].trim();
    }

    // Fix duplicate X-Forwarded-Proto (just in case)
    const fp = req.headers["x-forwarded-proto"];
    if (fp && typeof fp === "string" && fp.includes(",")) {
      req.headers["x-forwarded-proto"] = fp.split(",")[0].trim();
    }

    requestHandler(req, res);
  });
};

// Load the actual Next.js server
require("./server.js");
