import { authenticateToken } from "../_config";

// IsLoggedIn User - GET api response
export async function get(req, res) {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (authorization !== undefined && token !== undefined) {
    return authenticateToken(token, (err, user, info) => {
      if (err) return res.status(500).send(err);
      if (!user) return res.status(401).json(info.message);
      res.status(200).json({
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        email: user.email,
        token: user.accessToken
      });
    });
  }
  res.status(400).json({ message: "Invalid Token" });
}
