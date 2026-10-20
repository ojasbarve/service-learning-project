import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['listings'] };
  return handler(req, res);
};
