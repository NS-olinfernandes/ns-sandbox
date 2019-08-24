import { User } from "../_config";

// Login User - POST api response
export async function post(req, res) {
  const { user } = req.body;
  if (user !== undefined && user !== null && user !== {}) {
    const { email } = user;
    try {
      const response = await User.find(email);
      response.token = "";
      const log = await User.update(email, { sessionToken: response.token });
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
}
