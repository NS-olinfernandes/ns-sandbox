import { authenticateToken } from "../_config";

// IsLoggedIn User - GET api response
export async function get(req, res) {
  const { authorization = null } = req.headers;
  return authorization === null
    ? res.status(400).json({ message: "Missing authorization header" })
    : authenticateToken(authorization.split(" ")[1], (err, user, info) => {
        err && err.name
          ? res.status(401).json(err)
          : err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json(info)
          : res.status(200).json({ ...user, ...info });
      });
}
