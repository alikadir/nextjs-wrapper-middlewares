import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const loggerOptions = {
  transports: [new ElasticsearchTransport({ clientOpts: { node: process.env.LOG_ELASTICSEARCH_URL } })],
  responseWhitelist: ['body', 'statusCode'],
  requestWhitelist: ['body', 'headers'],
};

export const logger = winston.createLogger(loggerOptions);
export const loggerRequest = (handler) => async (req, res) => {
  const uniqueRequestId = Math.random();
  try {
    const { body, url, query, headers, method } = req;
    logger.info('incoming-request', {
      uniqueRequestId,
      url,
      body,
      query,
      headers,
      method,
    });
    await handler(req, res);
  } catch (err) {
    logger.error('error-request', {
      uniqueRequestId,
      errorStack: err.stack,
      errorMessage: err.message,
    });
    req.end();
  }
};
