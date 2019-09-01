import { authenticateUser } from "../_config";

// Login User - POST api response
export async function post(req, res) {
  !req.body
    ? res.status(400).json({ message: "Invalid input" })
    : authenticateUser(req.body, (err, user, info) => {
        err
          ? res.status(500).send(err)
          : !user
          ? res.status(401).json(info.message)
          : res.status(200).json(user);
      });
}
