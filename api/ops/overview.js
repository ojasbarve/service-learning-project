import handler from '../index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['ops', 'overview'] };
  return handler(req, res);
};
