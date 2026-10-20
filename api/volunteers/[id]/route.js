import handler from '../../index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['volunteers', req.query?.id, 'route'] };
  return handler(req, res);
};
