import { collectionOps, authenticateToken } from '../_config';
const db = 'todos';

export async function get(req, res) {
  if (req.headers.authorization === undefined)
    return res.status(401).json('Invalid Token');
  const token = req.headers.authorization.split(' ')[1];
  authenticateToken(token, (err, payload, info) => {
    if (err) return res.status(500).json(err);
    if (!payload) return res.status(401).json(info.message);
    collectionOps.getList(db, (err, data, info) => {
      if (err) return res.status(500).json(err);
      if (!data) return res.status(401).json(info.message);
      res.status(200).json(data);
    });
  });
}

export async function post(req, res) {
  if (req.headers.authorization === undefined)
    return res.status(401).json('Token missing...');
  const token = req.headers.authorization.split(' ')[1];
  authenticateToken(token, (err, payload, info) => {
    if (err) return res.status(500).json(err);
    if (!payload) return res.status(401).json(info.message);
    if (!Array.isArray(req.body) || req.body.length === 0)
      return res.status(401).json('Invalid Input');
    collectionOps.addList(db, req.body, (err, data, info) => {
      if (err) return res.status(500).json(err);
      if (!data) return res.status(401).json(info);
      res.status(200).json(data);
    });
  });
}
