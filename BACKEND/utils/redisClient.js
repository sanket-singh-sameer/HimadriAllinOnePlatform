import { Redis } from "@upstash/redis";

let redisClient;
let hasWarnedAboutRedis = false;

export const isRedisConfigured = () => {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
};

export const getRedisClient = () => {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (!isRedisConfigured()) {
    if (!hasWarnedAboutRedis) {
      console.warn(
        "Redis is not configured. OTP sessions and caches will fall back to database-only behavior."
      );
      hasWarnedAboutRedis = true;
    }
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return redisClient;
};