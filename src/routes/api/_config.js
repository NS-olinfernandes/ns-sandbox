import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const db_url = "mongodb/Sanbox";
// const db_url = "ns-mongodb1/Sandbox";
const db_url = "localhost/Sandbox";
// const db_url = "172.18.0.2/Sandbox";

// MongoDB connection.
mongoose.connect(`mongodb://${db_url}`, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.connection.on("connected", () =>
  console.log("Connected to Sanbox Database")
);

const Schema = mongoose.Schema;
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
    type: String
  }
});

export const Todo = mongoose.model("Todo", todoSchema);
export const User = mongoose.model("User", userSchema);

// Secret for token signing & password hashing.
export const secret = "7FGT5VQ2BU";
// Generate new JWT
const generateToken = (payload = Object()) => {
  const token = jwt.sign(payload, secret);
  return token;
};
// Verify existing JWT
const verifyToken = (token = String(), callback = Function()) =>
  jwt.verify(token, secret, callback);
// Generate password hash
const hashPassword = (password = String()) => bcrypt.hashSync(password, secret);

// Validate Token - Devrypt token & check DB for user
export async function authenticateToken(
  token = String(),
  callback = Function()
) {
  token === ""
    ? callback(null, false, {
        message: "Invalid token"
      })
    : verifyToken(token, (err, payload) => {
        if (err) return callback(err);
        User.findOne(
          {
            email: payload.email
          },
          (err, user) => {
            if (err) return callback(err);
            if (!user)
              return callback(null, false, {
                message: "No User found from token"
              });
            const { name, email, accessToken } = user;
            callback(
              null,
              { name, email, accessToken },
              {
                message: "Token verified!"
              }
            );
          }
        );
      });
}

// Register a new user - DB query & callback
export async function registerUser(newUser = {}, callback = Function()) {
  const { firstName, lastName, email, password } = newUser;
  if (email === undefined || password === undefined)
    return callback(null, false, {
      message: "Email or password missing!"
    });
  const hashedPassword = hashPassword(password);
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

// Login User - DB query & callback
export async function authenticateUser(
  { email = String(), password = String() },
  callback = Function()
) {
  if (email === "" || password === "")
    return callback(null, false, {
      message: "Email and/or password missing"
    });
  const hashedPassword = hashPassword(password);
  const token = generateToken({ email, password: hashedPassword });
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

// Logout User - DB query & callback
export async function logoutUser(token = String(), callback = Function()) {
  if (token === "")
    return callback(null, false, {
      message: "Invalid Token"
    });
  User.updateOne(
    { accessToken: token },
    { accessToken: "" },
    (err, response) => {
      if (err) return callback(err);
      if (response.ok)
        return callback(null, response, {
          message: "Logged out successfully"
        });
      callback(null, false, {
        message: "Something went wrong"
      });
    }
  );
}

// Collection Operations - DB query & callback
export const collectionOps = {
  // GET document list from collection database.
  getList: async (db = String(), callback = Function()) => {
    if (/users/.test(db)) {
      return User.find((err, dataList) => {
        if (err) return callback(err);
        if (!dataList)
          return callback(null, false, {
            message: "No items in database"
          });
        callback(null, dataList, {
          message: "Data list found"
        });
      });
    }
    if (/todos/.test(db)) {
      return Todo.find((err, dataList) => {
        if (err) return callback(err);
        if (!dataList)
          return callback(null, false, {
            message: "No items in database"
          });
        callback(null, dataList, {
          message: "Data list found"
        });
      });
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  },
  // Add new document list to collection database.
  addList: async (db = String(), lists = Array(), callback = Function()) => {
    console.log(typeof lists);
    if (/users/.test(db)) {
      if (!Array.isArray(lists) || lists.length === 0)
        return callback(null, false, {
          message: "Invalid list provided"
        });
      const dataList = lists.map((list, i) => {
        const { firstName, lastName, email, password } = list;
        const newUser = new User({
          name: {
            firstName,
            lastName
          },
          email,
          password: hashPassword(password)
        });
        return newUser.save((err, user) => {
          if (err) return { invalid: i, error: err };
          return user;
        });
      });
      if (dataList.filter(data => data.invalid === undefined).length > 0) {
        return callback(null, false, {
          message: "Encountered Invalid Inputs",
          request: list,
          response: dataList
        });
      }
      callback(null, dataList, {
        message: "New entries added to Database"
      });
    }
    if (/todos/.test(db)) {
      const dataList = lists.map((list, i) => {
        const { title, body, author } = list;
        const newTodo = new Todo({
          title,
          body,
          created_by: author
        });
        return newTodo.save((err, todo) => {
          if (err) return { invalid: i, error: err };
          return todo;
        });
      });
      if (dataList.filter(data => data.invalid === undefined).length > 0) {
        return callback(null, false, {
          message: "Encountered Invalid Inputs",
          request: list,
          response: dataList
        });
      }
      callback(null, dataList, {
        message: "New entries added to Database"
      });
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  }
};

// Document Operations - DB query & callback
export const documentOps = {
  // GET document by id from collection database.
  get: async (db = String(), id = String(), callback = Function()) => {
    if (/[uU]sers/.test(db)) {
      return User.findById(id, (err, user) => {
        if (err) return callback(err);
        if (!user)
          return callback(null, false, {
            message: "User not found"
          });
        callback(null, user, {
          message: "User found"
        });
      });
    }
    if (/[tT]odos/.test(db)) {
      return Todo.findOne({ _id: id }, (err, todo) => {
        if (err) return callback(err);
        if (!todo)
          return callback(null, false, {
            message: "Todo not found"
          });
        callback(null, todo, {
          message: "Todo found"
        });
      });
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  },
  // Update document by id with new data and save to collection database.
  put: async (
    db = String(),
    id = String(),
    data = Object(),
    callback = Function()
  ) => {
    if (/users/.test(db)) {
      return User.findOneAndUpdate({ _id: id }, { ...data }, (err, user) => {
        if (err) return callback(err);
        if (!user)
          return callback(null, false, {
            message: "User not found"
          });
        callback(null, user, {
          message: "User updated"
        });
      });
    }
    if (/todos/.test(db)) {
      return Todo.findOneAndUpdate({ _id: id }, { ...data }, (err, todo) => {
        if (err) return callback(err);
        if (!todo)
          return callback(null, false, {
            message: "Todo not found"
          });
        callback(null, todo, {
          message: "Todo updated"
        });
      });
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  },
  // Delete document by id from collection database.
  del: async (db = String(), id = String(), callback = Function()) => {
    if (/users/.test(db)) {
      return User.remove({ _id: id }, err => {
        if (err) return callback(err);
        callback(null, id, {
          message: `User id removed: ${id}`
        });
      });
    }
    if (/todos/.test(db)) {
      return Todo.remove({ _id: id }, err => {
        if (err) return callback(err);
        callback(null, id, {
          message: `Todo id removed: ${id}`
        });
      });
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  }
};
