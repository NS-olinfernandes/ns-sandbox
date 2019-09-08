import { logoutUser } from "../_config";

// Logout user - GET api response
export async function get(req, res) {
  const { authorization = null } = req.headers;
  if (authorization === null) return res.status(400).json({ message: 'Missing valid headers' });
  try {
    const response = await logoutUser(authorization.split(' ')[1]);
    res.status(200).json(response);
  } catch (error) {
    if (/Error/g.test(error.name)) return res.status(401).json(error);
    console.log(error);
    res.status(500).json(error);
  }
}
