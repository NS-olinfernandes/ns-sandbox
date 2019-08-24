import { User } from "../_config";

// IsLoggedIn User - GET api response
export async function get(req, res) {
  let user = {};
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if (authorization !== undefined && token !== undefined) {
    if (user !== undefined && user !== {}) {
      try {
        const response = await User.find({sessionToken: token});
        response.token = token;
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        return res.end(JSON.stringify(response));
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
      return res.end(JSON.stringify({ message: "Invalid Input!" }));
    }
  } else {
    res.writeHead(400, {
      "COntent-Type": "application/json"
    });
    return res.end(JSON.stringify({ message: "Invalid Token" }));
  }
}
