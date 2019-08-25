import { User } from "../_config";

// Logout user - GET api response
export async function get(req, res) {
  const { authorization } = req.headers;
  if (authorization !== undefined && authorization.token !== "") {
    const token = authorization.split(" ")[1];
    try {
      const log = await User.update(
        { accessToken: token },
        { accessToken: "" }
      );
      return res.status(200).json(log);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  res.status(400).json({ message: "Missing Token" });
}
