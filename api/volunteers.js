import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['volunteers'] };
  return handler(req, res);
};
