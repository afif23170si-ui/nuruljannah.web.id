// ecosystem.config.js — PM2 Configuration
// Ensures PM2 always starts with the correct entry point and settings.
module.exports = {
  apps: [
    {
      name: "nuruljannah",
      script: ".next/standalone/server-wrapper.js", // MUST use wrapper, NOT server.js!
      cwd: "/home/nuruljannah.web.id/app",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        HOSTNAME: "0.0.0.0",
      },
      node_args: "--max-http-header-size=65536",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "/home/nuruljannah.web.id/app/logs/error.log",
      out_file: "/home/nuruljannah.web.id/app/logs/out.log",
      time: true,
    },
  ],
};
