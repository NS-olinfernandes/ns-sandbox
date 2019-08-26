import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const db_url = "mongodb:27017/Sanbox";
// const db_url = "localhost:27017/Sandbox";
const db_url = "172.18.0.2:27017/Sandbox";

mongoose.connect(`mongodb://${db_url}`, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.connection.on("connected", () =>
  console.log("Connected to Sanbox Database")
);
mongoose.connection.on("error", error => console.error(error));

const Schema = mongoose.Schema;
const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  body: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  created_by: {
    type: String,
    required: true,
    index: true
  }
});
const userSchema = new Schema({
  name: {
    firstName: {
      type: String,
      default: ""
    },
    lastName: {
      type: String,
      default: ""
    }
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String
  }
});

export const Todo = mongoose.model("Todo", todoSchema);
export const User = mongoose.model("User", userSchema);

export const secret = "7FGT5VQ2BU";
const generateToken = (payload = Object) => {
  const token = jwt.sign(payload, secret);
  return token;
};
const verifyToken = (token = String(), callback = Function()) =>
  jwt.verify(token, secret, callback);

const hashPassword = async (password = String()) => {
  let salt = await bcrypt.genSalt(8);
  let hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
};

export async function authenticateToken(
  token = String(),
  callback = Function()
) {
  verifyToken(token, (err, payload) => {
    if (err) return callback(err);
    const { email, password } = payload;
    User.findOne(
      {
        email,
        password
      },
      (err, user) => {
        if (err) return callback(err);
        if (!user)
          return callback(null, false, {
            message: "No User found"
          });
        callback(null, user, {
          message: "Token verified!"
        });
      }
    );
  });
}

export async function authenticateUser(
  { email = String(), password = String() },
  callback = Function()
) {
  if (email === "" || password === "")
    return callback(null, false, {
      message: "Email and/or password missing"
    });
  const hashedPassword = await hashPassword(password);
  const token = await generateToken({ email, hashedPassword });
  User.findOne({ email }, (err, user) => {
    if (err) return callback(err);
    if (!user)
      return callback(null, false, {
        message: "Incorrect email"
      });
    if (!bcrypt.compareSync(password, user.password))
      return callback(null, false, {
        message: "Password mismatch"
      });
    User.updateOne({ email }, { accessToken: token }, (err, response) => {
      if (err) return callback(err);
      if (response.ok)
        return callback(null, user, {
          message: "Logged in successfully"
        });
      callback(null, false, {
        message: "Something went wrong"
      });
    });
  });
}

export async function registerUser(newUser = {}, callback = Function()) {
  const { firstName, lastName, email, password } = newUser;
  if (email === undefined || password === undefined)
    return callback(null, false, {
      message: "Email or password missing!"
    });
  const hashedPassword = await hashPassword(password);
  User.findOne({ email }, (err, user) => {
    if (err) return callback(err);
    if (!user) {
      let registeredUser = new User({
        name: {
          firstName,
          lastName
        },
        email,
        password: hashedPassword,
        accessToken: generateToken({ email, password })
      });
      registeredUser.save((err, data) => {
        if (err) return callback(err);
        if (!data)
          return callback(null, false, { message: "Something went wrong" });
        callback(null, data, {
          message: `New user registered! ${registeredUser.email}`
        });
      });
    }
    callback(null, false, {
      message: "Email already exists!"
    });
  });
}
