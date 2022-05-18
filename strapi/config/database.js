module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: '172.17.0.2',
      // host: '103.116.104.166',
      port: 3306,
      database: 'strapi',
      user: 'strapi',
      password: 'strapi',
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
      },
    },
    debug: false,
  },
});