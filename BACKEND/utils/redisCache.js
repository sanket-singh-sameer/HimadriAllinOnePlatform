import { getRedisClient } from "./redisClient.js";

const parseJson = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

export const redisGetJson = async (key) => {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const value = await redis.get(key);
  return parseJson(value);
};

export const redisSetJson = async (key, value, ttlSeconds) => {
  const redis = getRedisClient();
  if (!redis) {
    return false;
  }

  const options = ttlSeconds ? { ex: ttlSeconds } : undefined;
  await redis.set(key, JSON.stringify(value), options);
  return true;
};

export const redisDelete = async (key) => {
  const redis = getRedisClient();
  if (!redis) {
    return false;
  }

  await redis.del(key);
  return true;
};

export const redisIncrement = async (key, ttlSeconds) => {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const nextValue = await redis.incr(key);
  if (nextValue === 1 && ttlSeconds) {
    await redis.expire(key, ttlSeconds);
  }

  return nextValue;
};