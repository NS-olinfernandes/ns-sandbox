import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import {
  User,
  generateToken,
  hashPassword,
  secret
} from "./routes/api/_config";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, callback) => {
    //   password = hashPassword(password);
      try {
        const user = await User.findOne({ email, password });
        !user
          ? callback(null, false, { message: "Incorrect email or password" })
          : () => {
              const token = generateToken(user);
              user.token = token;
              User.update(email, { acessToken: token }, (err, response) => {
                if (err) return callback(err);
                console.log(
                  `DB updated with access token: ${response.accessToken}`
                );
              });
              return callback(null, user, {
                message: "Logged in successfully"
              });
            };
      } catch (error) {
        return callback(error);
      }
    }
  ),
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    },
    async (jwtPayload, callback) => {
      try {
        const user = await User.findById({ _id: jwtPayload._id });
        !user
          ? callback(null, false, { message: "No user found" })
          : callback(null, user, { message: "User token authorized" });
      } catch (error) {
        return callback(error);
      }
    }
  )
);
