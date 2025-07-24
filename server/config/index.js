import 'dotenv/config';

export const config = {
  port: process.env.PORT || 5002,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  maxFileSize: process.env.MAX_FILE_SIZE || "2mb",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  omdbApiKey: process.env.OMDB_API_KEY || "f20f20b2"
};