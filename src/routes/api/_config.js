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

// Register a new user - DB query & callback
export async function registerUser(newUser = {}, callback = Function()) {
  const { firstName = "", lastName = "", email = "", password = "" } = newUser;
  if (email === "" || password === "")
    return callback(null, false, {
      message: "Email or password missing!"
    });
  const hashedPassword = hashPassword(password);
  User.findOne({ email }, (err, user) => {
    err
      ? callback(err)
      : user
      ? callback(null, false, {
          message: `${email} already exists in database`
        })
      : () => {
          let registeredUser = new User({
            name: {
              firstName,
              lastName
            },
            email,
            password: hashedPassword,
            accessToken: generateToken({ email, hashedPassword })
          });
          return rregisteredUser.save((err, data) => {
            err
              ? callback(err)
              : !data
              ? callback(null, false, { message: "Something went wrong" })
              : callback(null, data, {
                  message: `New user registered \n${registeredUser.email}`
                });
          });
        };
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

// Validate Token - Decrypt token & check DB for user
export async function authenticateToken(
  token = String(),
  callback = Function()
) {
  token === ""
    ? callback(null, false, {
        message: "Invalid token"
      })
    : verifyToken(token, (err, payload) => {
        err
          ? callback(err)
          : User.findOne({ email: payload.email }, (error, user) => {
              error
                ? callback(err)
                : !user
                ? callback(null, false, {
                    message: `No user found \n${email}`
                  })
                : callback(
                    null,
                    {
                      firstName: user.name.firstName,
                      lastName: user.name.lastName,
                      email: user.email,
                      token: user.accessToken
                    },
                    { message: "Token verified!" }
                  );
            });
      });
}

// Logout User - DB query & callback
export async function logoutUser(token = String(), callback = Function()) {
  token === ""
    ? callback(null, false, {
        message: "Empty token"
      })
    : verifyToken(token, (err, payload) => {
        err
          ? callback(err)
          : User.updateOne(
              { email: payload.email },
              { accessToken: "" },
              (error, response) => {
                error
                  ? callback(error)
                  : !response.ok
                  ? callback(null, false, {
                      message: "Something went wrong",
                      response
                    })
                  : callback(null, response, {
                      message: `${payload.email} Logged out`
                    });
              }
            );
      });
}

// Collection Operations - DB query & callback
export const collectionOps = {
  // GET document list from collection database.
  getList: async (db = String(), callback = Function()) => {
    switch (db) {
      case /[uU]sers/:
        return User.find((err, dataList) => {
          err
            ? callback(err)
            : !dataList
            ? callback(null, false, {
                message: "No items in database"
              })
            : callback(null, dataList, {
                message: "Data list found"
              });
        });
      case /[tT]odos/:
        return Todo.find((err, dataList) => {
          err
            ? callback(err)
            : !dataList
            ? callback(null, false, {
                message: "No items in database"
              })
            : callback(null, dataList, {
                message: "Data list found"
              });
        });
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  },
  // Add new document list to collection database.
  addList: async (db = String(), lists = Array(), callback = Function()) => {
    if (!Array.isArray(lists) || lists.length === 0)
      return callback(null, false, {
        message: "Invalid/Empty list provided"
      });
    let dataList;
    switch (db) {
      case /[uU]sers/:
        dataList = lists.map((list, i) => {
          const { firstName, lastName, email, password } = list;
          const newUser = new User({
            name: {
              firstName,
              lastName
            },
            email,
            password: hashPassword(password)
          });
          return newUser.save((err, user) =>
            err ? { invalid: i, error: err } : user
          );
        });
        dataList.filter(data => data.invalid === undefined).length > 0
          ? callback(null, false, {
              message: "Encountered Invalid Inputs",
              request: list,
              response: dataList
            })
          : callback(null, dataList, {
              message: "New entries added to Database"
            });
      case /[tT]odos/:
        dataList = lists.map((list, i) => {
          const { title, body, author } = list;
          const newTodo = new Todo({
            title,
            body,
            created_by: author
          });
          return newTodo.save((err, todo) =>
            err ? { invalid: i, error: err } : todo
          );
        });
        dataList.filter(data => data.invalid === undefined).length > 0
          ? callback(null, false, {
              message: "Encountered Invalid Inputs",
              request: list,
              response: dataList
            })
          : callback(null, dataList, {
              message: "New entries added to Database"
            });
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  }
};

// Document Operations - DB query & callback
export const documentOps = {
  // GET document by id from collection database.
  getDoc: async (db = String(), id = String(), callback = Function()) => {
    switch (db) {
      case /[uU]sers/:
        return User.findById(id, (err, user) => {
          err
            ? callback(err)
            : !user
            ? callback(null, false, {
                message: "User not found"
              })
            : callback(null, user, {
                message: "User found"
              });
        });
      case /[tT]odos/:
        return Todo.findOne({ _id: id }, (err, todo) => {
          err
            ? callback(err)
            : !todo
            ? callback(null, false, {
                message: "Todo not found"
              })
            : callback(null, todo, {
                message: "Todo found"
              });
        });
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  },
  // Update document by id with new data and save to collection database.
  updateDoc: async (
    db = String(),
    id = String(),
    data = Object(),
    callback = Function()
  ) => {
    switch (db) {
      case /[uU]sers/:
        return User.updateOne({ _id: id }, { ...data }, (err, user) => {
          err
            ? callback(err)
            : !user
            ? callback(null, false, {
                message: "User not found"
              })
            : callback(null, user, {
                message: "User updated"
              });
        });
      case /[tT]odo/:
        return Todo.updateOne({ _id: id }, { ...data }, (err, todo) => {
          err
            ? callback(err)
            : !todo
            ? callback(null, false, {
                message: "Todo not found"
              })
            : callback(null, todo, {
                message: "Todo updated"
              });
        });
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  },
  // Delete document by id from collection database.
  deleteDoc: async (db = String(), id = String(), callback = Function()) => {
    switch (db) {
      case /[uU]sers/:
        return User.remove({ _id: id }, err => {
          err
            ? callback(err)
            : callback(null, id, {
                message: `User id removed:\n ${id}`
              });
        });
      case /[tT]odos/:
        return Todo.remove({ _id: id }, err => {
          err
            ? callback(err)
            : callback(null, id, {
                message: `Todo id removed:\n ${id}`
              });
        });
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  }
};
