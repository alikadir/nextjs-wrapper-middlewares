import { getCacheKey, setCacheKey } from 'lib/cacheService.js';

describe('cacheService', () => {
  const testKey = 'test-key';
  const testValue = `sample test value - ${new Date().toString()}`;

  test('set key', async (done) => {
    await setCacheKey(testKey, testValue, 75);
    done();
  });

  test('get value', async () => {
    const keyValue = await getCacheKey(testKey);
    expect(keyValue).toBe(testValue);
  });

  test('get unknown key', async () => {
    const keyValue = await getCacheKey(testKey + 'random');
    expect(keyValue).toBeNull();
  });
});
