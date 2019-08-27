import { collectionOps } from '../_config';
const db = 'todos';
export async function get(req, res) {
  return collectionOps.getList(db, (err, data, info) => {
    if (err) return res.status(500).json(err);
    if (!data) return res.status(401).json(info.message);
    res.status(200).json(data);
  });
}
export async function post(req, res) {
  if (req.body === undefined || req.body === null || req.body.length === 0)
    return res.status(400).json('Invalid Input');
  return collectionOps.addList(db, req.body, (err, data, info) => {
    if (err) return res.status(500).json(err);
    if (!data) return res.status(400).json(info);
    res.status(200).json(data);
  });
}
