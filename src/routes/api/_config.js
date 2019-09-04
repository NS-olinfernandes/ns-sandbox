import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Todo, User } from "./_models";

// Secret for token signing & password hashing.
const secret = "7FGT5VQ2BU";
// Generate new JWT
const generateToken = (payload = Object()) => jwt.sign(payload, secret);
// Verify existing JWT
const verifyToken = (token = String(), callback = Function()) =>
  jwt.verify(token, secret, callback);
// Generate password hash
const hashPassword = (password = String()) => bcrypt.hashSync(password, 8);

// Register a new user - DB query & callback
export function registerUser(newUser = Object(), callback = Function()) {
  const { firstName = "", lastName = "", email = "", password = "" } = newUser;
  email === "" || password === ""
    ? callback(null, false, {
        message: "Missing email and/or password"
      })
    : User.findOne({ email }, (err, user) => {
        if (err) return callback(err);
        if (user)
          return callback(null, false, {
            message: `${email} already exists in database`
          });
        let registeredUser = new User({
          name: {
            firstName,
            lastName
          },
          email,
          password: hashPassword(password),
          accessToken: generateToken({
            email,
            password: hashPassword(password)
          })
        });
        registeredUser.save((error, data) => {
          error
            ? callback(error)
            : !data
            ? callback(null, false, { message: "Something went wrong" })
            : callback(
                null,
                {
                  firstName: data.name.firstName,
                  lastName: data.name.lastName,
                  email: data.email,
                  token: data.accessToken
                },
                {
                  message: `New user registered \n${registeredUser.email}`
                }
              );
        });
      });
}

// Login User - DB query & callback
export function authenticateUser(
  { email = String(), password = String() },
  callback = Function()
) {
  email === "" || password === ""
    ? callback(null, false, {
        message: "Missing email and/or password"
      })
    : User.findOne({ email }, (err, user) => {
        const hashedPassword = hashPassword(password);
        const token = generateToken({ email, password: hashedPassword });
        err
          ? callback(err)
          : !user
          ? callback(null, false, {
              message: "Incorrect email"
            })
          : !bcrypt.compareSync(password, user.password)
          ? callback(null, false, {
              message: "Incorrect password"
            })
          : User.updateOne(
              { email },
              { accessToken: token },
              (error, response) => {
                error
                  ? callback(error)
                  : response.ok
                  ? callback(
                      null,
                      {
                        firstName: user.name.firstName,
                        lastName: user.name.lastName,
                        email: user.email,
                        token
                      },
                      {
                        message: "Logged in successfully"
                      }
                    )
                  : callback(null, false, {
                      message: "Something went wrong",
                      response
                    });
              }
            );
      });
}

// Validate Token - Decrypt token & check DB for user
export function authenticateToken(token = String(), callback = Function()) {
  token === ""
    ? callback(null, false, {
        message: "Invalid token"
      })
    : verifyToken(token, (err, payload) => {
        const { email } = payload;
        err
          ? callback(err)
          : User.findOne({ email, accessToken: token }, (error, user) => {
              error
                ? callback(error)
                : !user || user === null
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
export function logoutUser(token = String(), callback = Function()) {
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
  getList: (db = String(), callback = Function()) => {
    switch (db) {
      case "users":
        return User.find((err, dataList) => {
          err
            ? callback(err)
            : dataList.length === 0
            ? callback(null, false, {
                message: "No items in database"
              })
            : callback(null, dataList, {
                message: "Data list found"
              });
        });
      case "todos":
        return Todo.find((err, dataList) => {
          err
            ? callback(err)
            : dataList.length === 0
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
  addList: (db = String(), lists = Array(), callback = Function()) => {
    if (!Array.isArray(lists) || lists.length === 0)
      return callback(null, false, {
        message: "Invalid/Empty list provided"
      });
    let dataList;
    switch (db) {
      case "users":
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
      case "todos":
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
  getDoc: (db = String(), id = String(), callback = Function()) => {
    switch (db) {
      case "users":
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
      case "todos":
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
  updateDoc: (
    db = String(),
    id = String(),
    data = Object(),
    callback = Function()
  ) => {
    switch (db) {
      case "users":
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
      case "todos":
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
  deleteDoc: (db = String(), id = String(), callback = Function()) => {
    switch (db) {
      case "users":
        return User.remove({ _id: id }, err => {
          err
            ? callback(err)
            : callback(null, id, {
                message: `User id removed:\n ${id}`
              });
        });
      case "todos":
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
