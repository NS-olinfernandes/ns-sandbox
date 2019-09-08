import { registerUser } from '../_config';

// Register new User - POST api response
export async function post(req, res) {
  const { body = null } = req;
  if (body === null) return res.status(400).json({ message: 'Invalid input' });
  try {
    const user = await registerUser(body);
    res.status(200).json(user);
  } catch (error) {
    if (/Error/g.test(error.name)) return res.status(400).json(error);
    console.log(error);
    res.status(500).json(error);
  }
}
