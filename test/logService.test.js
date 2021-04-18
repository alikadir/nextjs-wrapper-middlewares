import { logger } from 'lib/logService.js';

describe('logService', () => {
  test('write info log', (done) => {
    logger.info('write test log');
    done();
  });
  test('write error log', (done) => {
    logger.error('write test log');
    done();
  });
});
