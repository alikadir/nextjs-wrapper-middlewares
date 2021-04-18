import { setCacheKey } from '../../lib/cacheService.js';
import { loggerRequest } from '../../lib/logService.js';

const handler = async (req, res) => {
  await setCacheKey('next', JSON.stringify(req.query));
  res.status(200).json({ name: 'John Doe' });
};

export default loggerRequest(handler);
