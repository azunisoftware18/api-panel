import Redis from "ioredis";
import { envConfig } from "./env.config.js";

export const redis = new Redis({
  host: envConfig.REDIS_HOST,
  port: Number(envConfig.REDIS_PORT),
  password: envConfig.REDIS_PASSWORD,

  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
