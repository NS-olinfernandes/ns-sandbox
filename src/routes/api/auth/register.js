import { registerUser } from "../_config";

// Register new User - POST api response
export async function post(req, res) {
  if (req.body !== undefined && req.body !== null && req.body !== {}) {
    return registerUser(req.body, (err, user, info) => {
      if (err) return res.status(500).json(err);
      if (!user) return res.status(401).json(info.message);
      res.status(200).json(user);
    });
  }
  res.status(400).json({
    message: "Invalid Input"
  });
}
