import redis from 'redis';

const client = redis.createClient(process.env.CACHE_REDIS_URL);

export const setCacheKey = async (key, value, ttl) =>
  new Promise((resolve, reject) => {
    // ttl is second
    return ttl
      ? client.set(key, value, 'EX', ttl, (err, reply) => {
          err ? reject(err) : resolve(reply);
        })
      : client.set(key, value, (err, reply) => {
          err ? reject(err) : resolve(reply);
        });
  });

export const getCacheKey = (key) =>
  new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      err ? reject(err) : resolve(reply);
    });
  });

export const deleteCacheKey = (key) =>
  new Promise((resolve, reject) => {
    client.del(key, (err, reply) => {
      err ? reject(err) : resolve(reply);
    });
  });

export const deleteAllKey = () =>
  new Promise((resolve, reject) => {
    client.flushall((err, reply) => {
      err ? reject(err) : resolve(reply);
    });
  });

export const cacheResponseWrapper = (handler) => async (req, res) => {
  const cacheKey = `${req.method}--${req.url}--${req.body ? JSON.stringify(req.body) : ''}`;
  const cacheValue = await getCacheKey(cacheKey);
  res.cacheOriginJson = res.json;
  if (cacheValue) {
    await res.cacheOriginJson(JSON.parse(cacheValue));
  } else {
    res.json = async (jsonObj, ttl) => {
      ttl
        ? await setCacheKey(cacheKey, JSON.stringify(jsonObj), ttl)
        : await setCacheKey(cacheKey, JSON.stringify(jsonObj));
      res.cacheOriginJson(jsonObj);
    };
    await handler(req, res);
  }
};
