import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['suppliers'] };
  return handler(req, res);
};
