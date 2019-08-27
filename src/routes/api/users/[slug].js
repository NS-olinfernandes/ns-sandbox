import { authenticateToken, documentOps } from '../_config';
const db = 'users';
export async function get(req, res) {
  if (req.headers.authorization === undefined || req.params.slug === undefined)
    return res.status(401).json('Invalid Token or Input');
  const token = req.headers.authorization.split(' ')[1];
  const { slug } = req.params;
  authenticateToken(token, (err, payload, info) => {
    if (err) return res.status(500).json(err);
    if (!payload) return res.status(401).json(info.message);
    documentOps.get(db, slug, (err, data, info) => {
      if (err) return res.status(500).json(err);
      if (!data) return res.status(400).json(info.message);
      res.status(200).json(data);
    });
  });
}
export async function put(req, res) {
  if (req.headers.authorization === undefined || req.params.slug === undefined)
    return res.status(401).json('Invalid Token or Input');
  const token = req.headers.authorization.split(' ')[1];
  const { slug } = req.params;
  const data = req.body;
  authenticateToken(token, (err, payload, info) => {
    if (err) return res.status(500).json(err);
    if (!payload) return res.status(401).json(info.message);
    documentOps.put(db, slug, data, (err, user, info) => {
      if (err) return res.status(500).json(err);
      if (!user) return res.status(400).json(info.message);
      res.status(200).json(user);
    });
  });
}
export async function del(req, res) {
  if (req.headers.authorization === undefined || req.params.slug === undefined)
    return res.status(401).json('Invalid Token or Input');
  const token = req.headers.authorization.split(' ')[1];
  const { slug } = req.params;
  authenticateToken(token, (err, payload, info) => {
    if (err) return res.status(500).json(err);
    if (!payload) return res.status(401).json(info.message);
    documentOps.del(db, slug, (err, data, info) => {
      if (err) return res.status(500).json(err);
      if (!data) return res.status(400).json(info.message);
      res.status(200).json(info.message);
    });
  });
}
