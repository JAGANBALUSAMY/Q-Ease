const redis = require('redis');

/**
 * Redis Service for Caching
 * Optional service for performance optimization
 * 
 * To use Redis caching:
 * 1. Install Redis: npm install redis
 * 2. Start Redis server
 * 3. Set REDIS_URL in .env
 * 4. Uncomment the code below
 */

// Uncomment when Redis is needed
/*
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('✅ Redis connected');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};

// Get cached data
const get = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
};

// Set cached data with expiration (in seconds)
const set = async (key, value, expirationInSeconds = 3600) => {
  try {
    await client.setEx(key, expirationInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
};

// Delete cached data
const del = async (key) => {
  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
};

// Clear all cache
const flushAll = async () => {
  try {
    await client.flushAll();
    return true;
  } catch (error) {
    console.error('Redis FLUSH error:', error);
    return false;
  }
};

// Cache keys
const CACHE_KEYS = {
  ORGANIZATIONS: 'organizations:all',
  ORGANIZATION: (id) => `organization:${id}`,
  QUEUES: 'queues:all',
  QUEUE: (id) => `queue:${id}`,
  QUEUE_STATS: (id) => `queue:${id}:stats`,
  USER: (id) => `user:${id}`,
};

module.exports = {
  connectRedis,
  get,
  set,
  del,
  flushAll,
  CACHE_KEYS
};
*/

// Placeholder for when Redis is not used
module.exports = {
    connectRedis: async () => console.log('Redis not configured'),
    get: async () => null,
    set: async () => false,
    del: async () => false,
    flushAll: async () => false,
    CACHE_KEYS: {}
};