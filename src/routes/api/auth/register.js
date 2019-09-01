import { registerUser } from "../_config";

// Register new User - POST api response
export async function post(req, res) {
  const { body = null } = req;
  body === null
    ? res.status(400).json({ message: "Invalid input" })
    : registerUser(req.body, (err, user, info) => {
        err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json(info.message)
          : res.status(200).json(user);
      });
}
