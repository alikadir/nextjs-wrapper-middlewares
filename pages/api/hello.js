import { cacheResponse } from '../../lib/cacheService.js';
import { loggerRequest } from '../../lib/logService.js';

const handler = async (req, res) => {
  if (Math.floor(Math.random() * 100) % 2 === 0)
    res.status(200).cacheJson({ name: 'John Doe', query: req.query, date: new Date().toLocaleString() }, 10);
  else res.json({ name: 'John Doe' });
};

export default loggerRequest(cacheResponse(handler));
