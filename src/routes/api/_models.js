import mongoose from "mongoose";
const db_url = "ns-mongodb/Sandbox";
// const db_url = 'localhost/Sandbox';

// MongoDB connection.
mongoose
  .connect(`mongodb://${db_url}`, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log(`Connected to MongoDB @${db_url}`))
  .catch(error => console.error(error));

const { Schema } = mongoose;
// Todo model Schema
const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  body: {
    type: String,
    default: "",
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
// User model Schema
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
    type: String,
    default: ''
  }
});

export const Todo = mongoose.model("Todo", todoSchema);
export const User = mongoose.model("User", userSchema);
