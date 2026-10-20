import handler from './index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['delivery-spots'] };
  return handler(req, res);
};
