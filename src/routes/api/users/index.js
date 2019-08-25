import { User } from '../_config';

export async function get(req, res) {
  try {
    const response = await User.find();
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    return res.end(JSON.stringify(response));
  } catch (error) {
    res.writeHead(500, {
      'Content-Type': 'application/json'
    })
    return res.end(JSON.stringify(error));
  }
}
