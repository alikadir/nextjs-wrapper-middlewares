import { loggerRequest } from '../../lib/logService.js';

const handler = async (req, res) => {
  throw new Error('custom error message');
};

export default loggerRequest(handler);
