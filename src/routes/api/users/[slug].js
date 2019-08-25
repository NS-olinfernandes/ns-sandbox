import { User } from '../_config';

const usersList = async () => {
  try {
    const lookup = new Map();
    const users = await User.find()
    users.forEach(user => lookup.set(user.email, JSON.stringify(user)));
    return lookup;
  } catch (error) {
    throw error;
  }
}

export function get(req, res) {
  const { slug } = req.params;
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(slug);
}
