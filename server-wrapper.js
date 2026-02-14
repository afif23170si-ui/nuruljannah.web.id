// Server wrapper to fix duplicate URL values from proxy chain.
//
// Problem: The proxy chain (Cloudflare + OpenLiteSpeed) causes Auth.js
// to receive a duplicated URL like:
//   'https://nuruljannah.web.id, https://nuruljannah.web.id'
// which fails new URL() parsing.
//
// Solution: Patch the global URL constructor to automatically
// fix duplicated URL patterns before parsing.

const OriginalURL = globalThis.URL;

class PatchedURL extends OriginalURL {
  constructor(input, base) {
    // Fix duplicated URLs: "https://a.com, https://a.com" → "https://a.com"
    if (typeof input === "string" && input.includes(", http")) {
      const parts = input.split(", ");
      if (parts.length > 1) {
        const allUrls = parts.every((p) => p.startsWith("http://") || p.startsWith("https://"));
        if (allUrls) {
          input = parts[0];
        }
      }
    }

    if (base !== undefined) {
      super(input, base);
    } else {
      super(input);
    }
  }
}

Object.setPrototypeOf(PatchedURL, OriginalURL);
globalThis.URL = PatchedURL;

require("./server.js");
