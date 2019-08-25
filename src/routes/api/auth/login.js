import passport from 'passport';

// Login User - POST api response
export async function post(req, res) {
  const user = req.query;
  if (user !== undefined && user !== null && user !== {}) {
    const { email, password } = user;
    passport.authenticate('local', {session: false}, (err, user, info) => {
      err || !user
        ? res.status(400).json({
          message: info.message,
          user
        })
        : req.login(user, {session: false}, (err) => {
          err
            ? res.send(err)
            : res.status(200).json({
              message: info.message,
              token: user.token
            })
        })
    })
  } else {
    res.writeHead(400, {
      "Content-Type": "application/json"
    });
    return res.end(JSON.stringify({ message: "Invalid Input!" }));
  }
}
