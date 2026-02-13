module.exports = {
  apps: [
    {
      name: "nuruljannah",
      script: ".next/standalone/server.js",
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
    },
  ],
};
