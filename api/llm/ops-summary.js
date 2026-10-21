import handler from '../index.js';

export default (req, res) => {
  req.query = { ...(req.query || {}), route: ['llm', 'ops-summary'] };
  return handler(req, res);
};
