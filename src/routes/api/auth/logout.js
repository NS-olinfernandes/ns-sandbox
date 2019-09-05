import { logoutUser } from "../_config";

// Logout user - GET api response
export function get(req, res) {
  const { authorization = null } = req.headers;
  authorization === null
    ? res.status(400).json({ message: "Missing authorization header" })
    : logoutUser(authorization.split(" ")[1], (err, response, info) => {
        err && err.name
          ? res.status(401).json(err)
          : err
          ? res.status(500).send(err)
          : !response
          ? res.status(401).json(info)
          : res.status(200).json(info);
      });
}
