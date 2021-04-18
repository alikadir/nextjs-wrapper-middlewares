import { loggerRequest } from '../../lib/logService.js';

export default loggerRequest(async (req, res) => {
  throw new Error('custom error message');
});
