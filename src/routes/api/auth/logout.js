import { User } from "../_config";

// Logout user - GET api response
export async function get(req, res) {
  const { authorization } = req.headers;
  if (authorization !== undefined && authorization.token !== "") {
    const token = authorization.split(" ")[1];
    try {
      const log = await User.update(
        { sessionToken: token },
        { sessionToken: "" }
      );
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      return res.end(JSON.stringify(log));
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "application/json"
      });
      return res.end(JSON.stringify(error));
    }
  } else {
    res.writeHead(400, {
      "Content-Type": "application/json"
    });
    return res.end(JSON.stringify({ message: "Missing Token" }));
  }
}
