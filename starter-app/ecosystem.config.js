module.exports = {
  apps : [{
    name: 'starter-app',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOGLEVEL: 'debug',
      HTTP_PORT: 8000,
      JAMBONZ_ACCOUNT_SID: 'a0e602ce-3c2a-4698-8e98-0d75303a3208',
      JAMBONZ_API_KEY: '5dea73a1-0838-4fc7-8615-96f77dc1e6e8',
      JAMBONZ_REST_API_BASE_URL: 'https://jambonz.us',
      WEBHOOK_SECRET: 'wh_secret_u3Lf9kD46UVp1cGmkJ8GCH'
    }
  }]
};
