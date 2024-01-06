module.exports = {
  apps: [
    {
      name: "client-sandbox",
      cwd: "./sandbox/",
      script: "pnpm run dev",
      env: {
        PORT: 3000,
      },
      restart_delay: 2000,
    },
  ],
};
