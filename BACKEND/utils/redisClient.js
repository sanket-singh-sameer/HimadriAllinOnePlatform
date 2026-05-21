import { Redis } from "@upstash/redis";
import xsam from "../config/env.js";

let redisClient;
let hasWarnedAboutRedis = false;

export const isRedisConfigured = () => {
  return Boolean(
    xsam.env.UPSTASH_REDIS_REST_URL && xsam.env.UPSTASH_REDIS_REST_TOKEN
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
    url: xsam.env.UPSTASH_REDIS_REST_URL,
    token: xsam.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return redisClient;
};