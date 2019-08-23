import mongoose from "mongoose";

const Schema = new mongoose.Schema();
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
      type: String
    },
    lastName: {
      type: String
    }
  },
  email: {
    type: String,
    required: true,
    index: true,
    uniquer: true
  },
  password: {
    type: String,
    required: true
  }
});

export const Todo = mongoose.model("Todo", todoSchema);
export const User = mongoose.model("User", userSchema);

export const abortController = new AbortController();
export const signal = abortController.signal;

export const setOptions = () => {
  let token;
  let headers;
  localStorage.length > 0
    ? (token = JSON.parse(localStorage.getItem("token")))
    : (token = "");
  token !== "" && token !== undefined
    ? (headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      })
    : (headers = {
        "Content-Type": "application/json"
      });
  return { headers, signal };
};
