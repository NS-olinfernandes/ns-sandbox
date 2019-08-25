import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const db_url = "mongodb:27017/Sanbox";
const db_url = "localhost:27017/Sandbox";

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
const generateToken = (payload = {}) => {
  const token = jwt.sign(payload, secret);
  return token;
};
const verifyToken = (token = "", callback = Function) =>
  jwt.verify(token, secret, callback);

export function hashPassword(password = "") {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => hash);
  });
}

export async function authenticateUser(
  email = "",
  password = "",
  callback = Function
) {
  // password = hashPassword(password);
  User.findOne(
    {
      email
    },
    (err, user) => {
      if (err) return callback(err);
      if (!user) {
        return callback(null, false, {
          message: "Incorrect email or password"
        });
      }
      user.token = generateToken({ email, password });
      User.updateOne(
        { email },
        {
          accessToken: user.token,
          password: hashPassword(password)
        }
      );
      callback(null, user, {
        message: "Logged in successfully"
      });
    }
  );
}

export async function authenticateToken(token = "", callback = Function) {
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
