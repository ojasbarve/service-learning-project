import handler from '../../index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['listings', req.query?.id, 'claim'] };
  return handler(req, res);
};
