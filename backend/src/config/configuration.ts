export default () => ({
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
});
