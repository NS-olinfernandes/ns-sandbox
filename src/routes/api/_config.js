import mongoose from "mongoose";

const db_url = 'mongodb://mongodb:27017/Sanbox';

mongoose.connect(`mongodb://${db_url}`, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.connection.on('connected', () => console.log('Connected to Sanbox Database'));
mongoose.connection.on('error', (error) => console.error(error));

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
