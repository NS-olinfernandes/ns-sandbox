import { authenticateToken } from "../_config";

// IsLoggedIn User - GET api response
export function get(req, res) {
  const { authorization = null } = req.headers;
  authorization === null
    ? res.status(400).json({ message: "Missing authorization header" })
    : authenticateToken(authorization.split(" ")[1], (err, user, info) => {
        console.log(user);
        err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json(info.message)
          : res.status(200).json(user);
      });
}
