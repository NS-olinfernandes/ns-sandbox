import { registerUser } from '../_config';

// Register new User - POST api response
export async function post(req, res) {
	const { body = null } = req;
	if (body === null) return res.status(400).json({ message: 'Invalid input' });
	return registerUser(body, (err, user, info) => {
		err && err.name
			? res.status(401).json(err)
			: err
			? res.status(500).send(err)
			: !user
			? res.status(401).json(info.message)
			: res.status(200).json({ ...user, ...info });
	});
}
