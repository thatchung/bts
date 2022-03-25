module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: '172.21.0.1',
      port: 3308,
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