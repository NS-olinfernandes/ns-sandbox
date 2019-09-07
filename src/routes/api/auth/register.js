import { registerUser } from '../_config';

// Register new User - POST api response
export async function post(req, res) {
  const { body = null } = req;
  if (body === null) return res.status(400).json({ message: 'Invalid input' });
  try {
    const user = await registerUser(body);
    res.status(200).json(user);
  } catch (error) {
    // console.log(error);
    if (/Error/g.test(error.name)) return res.status(400).json(error);
    res.status(500).send(error);
  }
  // return body === null
  // 	? res.status(400).json({ message: 'Invalid input' })
  // 	: registerUser(body, (err, user, info) => {
  // 		return err && err.name
  // 			? res.status(401).json(err)
  // 			: err
  // 				? res.status(500).send(err)
  // 				: !user
  // 					? res.status(401).json(info.message)
  // 					: res.status(200).json({ ...user, ...info });
  // 	});
}
