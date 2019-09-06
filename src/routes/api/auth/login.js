import { authenticateUser } from "../_config";

// Login User - POST api response
export async function post(req, res) {
  const { body = null } = req;
  return body === null
    ? res.status(400).json({ message: "Invalid input" })
    : authenticateUser(body, (err, user, info) => {
        err && err.name
          ? res.status(401).json(err)
          : err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json({ ...info })
          : res.status(200).json({ ...user, ...info });
      });
}
