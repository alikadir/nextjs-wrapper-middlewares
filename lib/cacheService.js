import redis from 'redis';

const client = redis.createClient(process.env.REDIS_URL);

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

export const cacheResponse = (handler) => async (req, res) => {
  const cacheKey = `${req.method}--${req.url}--${JSON.stringify(req.body)}`;
  const cacheValue = await getCacheKey(cacheKey);

  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
  } else {
    res.cacheJson = async (jsonObj, ttl) => {
      ttl
        ? await setCacheKey(cacheKey, JSON.stringify(jsonObj), ttl)
        : await setCacheKey(cacheKey, JSON.stringify(jsonObj));
      res.json(jsonObj);
    };
    await handler(req, res);
  }
};
