import { authenticateToken } from "../_config";

// IsLoggedIn User - GET api response
export async function get(req, res) {
  const { authorization = null } = req.headers;
  if (authorization === null)
    return res.status(400).json({ message: "Missing valid headers" });
  try {
    const user = await authenticateToken(authorization.split(' ')[1]);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    if (/Error/g.test(error.name)) return res.status(401).json(error);
    res.status(500).json(error);
  }
  // return authorization === null
  //   ? res.status(400).json({ message: "Missing authorization header" })
  //   : authenticateToken(authorization.split(" ")[1], (err, user, info) => {
  //     err && err.name
  //       ? res.status(401).json(err)
  //       : err
  //         ? res.status(500).send(err)
  //         : !user
  //           ? res.status(401).json(info)
  //           : res.status(200).json({ ...user, ...info });
  //   });
}
