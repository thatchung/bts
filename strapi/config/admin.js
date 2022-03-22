module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '54b9c15eb3125a8e1c1753ca259799f7'),
  },
});
