import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['health'] };
  return handler(req, res);
};
