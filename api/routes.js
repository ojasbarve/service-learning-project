import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['routes'] };
  return handler(req, res);
};
