import { cacheResponseWrapper } from '../../lib/cacheService.js';
import { loggerRequestResponseWrapper } from '../../lib/logService.js';

const handler = async (req, res) => {
  res.status(201).json({ name: 'John Doe', query: req.query, date: new Date().toLocaleString() }, 10);
};

export default loggerRequestResponseWrapper(cacheResponseWrapper(handler));
