import { authenticateUser } from "../_config";

// Login User - POST api response
export function post(req, res) {
  const { body = null } = req;
  body === null
    ? res.status(400).json({ message: "Invalid input" })
    : authenticateUser(body, (err, user, info) => {
        err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json(info)
          : res.status(200).json({ message: info.message, token: user.token });
      });
}
