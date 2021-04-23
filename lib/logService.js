import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const loggerOptions = {
  transports: [new ElasticsearchTransport({ clientOpts: { node: process.env.LOG_ELASTICSEARCH_URL } })],
  responseWhitelist: ['body', 'statusCode'],
  requestWhitelist: ['body', 'headers'],
};

export const logger = winston.createLogger(loggerOptions);
export const loggerRequestResponseWrapper = (handler) => async (req, res) => {
  const uniqueRequestId = Math.random();
  try {
    const { body, url, query, headers, method } = req;
    logger.info('incoming-request', {
      uniqueRequestId,
      url,
      body: body ? JSON.stringify(body) : null,
      query,
      headers,
      method,
    });
    res.logOriginJson = res.json;
    res.json = (jsonObject) => {
      logger.info('outgoing-response', {
        uniqueRequestId,
        url,
        method,
        responseJson: JSON.stringify(jsonObject),
        statusCode: res.statusCode,
      });
      res.logOriginJson(jsonObject);
    };
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
