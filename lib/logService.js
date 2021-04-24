import winston from 'winston';
import { v4 as uuIdV4 } from 'uuid';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const loggerOptions = {
  transports: [
    new ElasticsearchTransport({ clientOpts: { node: process.env.LOG_ELASTICSEARCH_URL } }),
    new winston.transports.Console(),
  ],
};

export const logger = winston.createLogger(loggerOptions);
export const loggerRequestResponseWrapper = (handler) => async (req, res) => {
  const customRequestId = uuIdV4();
  res.setHeader('Custom-Request-Id', customRequestId);

  try {
    const { body, url, query, headers, method } = req;
    logger.info('incoming-request', {
      customRequestId,
      url,
      body: body ? JSON.stringify(body) : null,
      query,
      headers,
      method,
    });
    res.logOriginJson = res.json;
    res.json = (jsonObject) => {
      logger.info('outgoing-response', {
        customRequestId,
        url,
        method,
        headers: res.headers,
        responseJson: JSON.stringify(jsonObject),
        statusCode: res.statusCode,
      });
      res.logOriginJson(jsonObject);
    };
    await handler(req, res);
  } catch (err) {
    logger.error('error-request', {
      customRequestId,
      errorStack: err.stack,
      errorMessage: err.message,
    });
    req.end();
  }
};
