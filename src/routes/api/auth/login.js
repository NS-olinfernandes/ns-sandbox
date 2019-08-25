import passport from '../../../passport';

// Login User - POST api response
export async function post(req, res) {
  const user = req.query;
  if (user !== undefined && user !== null && user !== {}) {
    // res.writeHead(200, {
    //   'Content-Type': 'application/json'
    // });
    // return res.end(JSON.stringify(user));
    passport.authenticate("local", { session: false }, (err, data, info) => {
      console.log("Reached Passport");
      if (err || !data) {
        return res.status(400).json({
          message: info.message,
          user: data
        });
      }
      return req.login(data, { session: false }, err => {
        if (err) {
          return res.send(err);
        }
        return res.status(200).json({
          message: info.message,
          token: data.accessToken
        });
      });
    });
  }
  res.writeHead(400, {
    "Content-Type": "application/json"
  });
  return res.end(JSON.stringify({ message: "Invalid Input!" }));
}
