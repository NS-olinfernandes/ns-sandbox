import { registerUser } from "../_config";

// Register new User - POST api response
export function post(req, res) {
  const { body = null } = req;
  if (body === null) return res.status(400).json({ message: "Invalid input" });
  registerUser(body, (err, user, info) => {
    err
      ? res.status(500).send(err)
      : !user
      ? res.status(401).json(info.message)
      : res.status(200).json(user);
  });
}
