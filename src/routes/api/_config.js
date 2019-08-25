import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const secret = '7FGT5VQ2BU';
export const generateToken = (payload = {}) => {
    const token = jwt.sign(payload, secret);
    return token;
};
const verifyToken = (token = '', callback = Function) => jwt.verify(token, secret, callback);

// const db_url = "mongodb:27017/Sanbox";
const db_url = 'localhost:27017/Sandbox';

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
  acessToken: {
    type: String,
    default: "",
    index: true
  }
});

export const Todo = mongoose.model("Todo", todoSchema);
export const User = mongoose.model("User", userSchema);

export function hashPassword(password = '') {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("B4c0/\/", salt, (err, hash) => hash)
  })
}