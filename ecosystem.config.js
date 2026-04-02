module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server_build/server/index.js',
      env: {
        NODE_ENV: 'production',
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/deploy/nsx/logs/server-error.log',
      out_file: '/home/deploy/nsx/logs/server-out.log',
      merge_logs: true,

      // Stability
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
}
