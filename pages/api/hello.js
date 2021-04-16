// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { setCacheKey } from '../../lib/cacheService.js';

export default async (req, res) => {
  await setCacheKey('next', JSON.stringify(req.query));
  res.status(200).json({ name: 'John Doe' });
};
