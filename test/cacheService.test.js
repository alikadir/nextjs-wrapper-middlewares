import { deleteAllKey, getCacheKey, setCacheKey } from 'lib/cacheService.js';

describe('cacheService', () => {
  const testKey = 'test-key';
  const testValue = `sample test value - ${new Date().toString()}`;

  test('remove all keys', async (done) => {
    await deleteAllKey();
    done();
  });

  test('set key', async (done) => {
    await setCacheKey(testKey, testValue);
    done();
  });

  test('get value', async () => {
    const keyValue = await getCacheKey(testKey);
    expect(keyValue).toBe(testValue);
  });
});
