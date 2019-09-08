import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Todo, User } from "./_models";

// Secret for token signing & password hashing.
const secret = "7FGT5VQ2BU";
// Generate new JWT
const generateToken = (payload = Object()) =>
  jwt.sign(payload, secret, { expiresIn: "45m" });
// Verify existing JWT
const verifyToken = (token = String()) =>
  jwt.verify(token, secret);
// Generate password hash
const hashPassword = (password = String()) => bcrypt.hashSync(password, 8);

// Register a new user - DB query & callback
export const registerUser = (newUser = {}) =>
  new Promise((resolve, reject) => {
    if (newUser.email === '' || newUser.password === '')
      return reject({
        name: 'UserError',
        message: 'Missing email and/or password'
      });
    User
      .findOne({ email: newUser.email })
      .then(user => {
        if (user) return reject({
          name: 'UserError',
          message: `${newUser.email} is taken. Choose another email`
        });
        let registeredUser = new User({
          name: {
            firstName: newUser.firstName,
            lastName: newUser.lastName
          },
          email: newUser.email,
          password: hashPassword(newUser.password),
          accessToken: generateToken({ email: newUser.email })
        });
        registeredUser
          .save()
          .then(data => resolve({
            firstName: data.name.firstName,
            lastName: data.name.lastName,
            email: data.email,
            token: data.accessToken
          }))
          .catch(error => reject(error))
      })
      .catch(error => reject(error))
  })

// Login User - DB query & callback
export const authenticateUser = ({ email = '', password = '' }) =>
  new Promise((resolve, reject) => {
    if (email === '' || password === '') return reject({
      name: 'UserError',
      message: 'Missing email and/or password'
    });
    User
      .findOne({ email })
      .then(user => {
        if (!user) return reject({
          name: 'UserError',
          message: `Email ${email} not found`
        })
        if (!bcrypt.compareSync(password, user.password)) return reject({
          name: 'UserError',
          message: 'Password mismatch'
        });
        user.accessToken = generateToken({ email });
        user
          .save()
          .then(data => {
            resolve({
              firstName: data.name.firstName,
              lastName: data.name.lastName,
              email: data.email,
              token: data.accessToken
            })
          })
          .catch(error => reject(error))
      })
      .catch(error => reject(error))
  })

// Validate Token - Decrypt token & check DB for user
export const authenticateToken = (token = String()) =>
  new Promise((resolve, reject) => {
    if (token === '') return reject({
      name: 'UserError',
      message: 'Invalid token'
    });
    const payload = verifyToken(token);
    User.findOne({
      email: payload.email,
      accessToken: token
    }).then(user => !user
      ? reject({
        name: 'UserError',
        message: 'User not found / Token is invalid'
      })
      : resolve({
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        email: user.email,
        token: user.accessToken
      })).catch(error => reject(error))
  })

// Logout User - DB query & callback
export const logoutUser = (token = String()) =>
  new Promise((resolve, reject) => {
    if (token === '') return reject({
      name: 'UserError',
      message: 'Invalid token'
    });
    const payload = verifyToken(token);
    User
      .updateOne(
        { email: payload.email, accessToken: token },
        { accessToken: '' }
      )
      .then(data => resolve(data))
      .catch(error => reject(error))
  })

export const collectionOps = class {
  constructor(props) {
    this.db = props || '';

    this.getList() = this.getList.bind(this);
  }
  getList() {
    return new Promise((resolve, reject) => {
      switch (this.db) {
        case "users":
          return User.find()
            .then(dataList => {
              if (dataList.length === 0) return reject({ message: 'Empty collection in database' });
              resolve(dataList);
            })
            .catch(error => reject(error))
        case "todos":
          return Todo.find()
            .then(dataList => {
              if (dataList.length === 0) return reject({ message: 'Empty collection in database' });
              resolve(dataList);
            })
            .catch(error => reject(error));
        default: reject({ message: "Invalid database" })
      }
    })
  }
  addList(lists = []) {
    return new Promise((resolve, reject) => {
      let dataList;
      switch (this.db) {
        case "users":
          dataList = lists.map((list, i) => {
            const {
              firstName,
              lastName,
              email,
              password
            } = list;
            const newUser = new User({
              name: {
                firstName,
                lastName
              },
              email,
              password: hashPassword(password),
              accessToken: generateToken({ email })
            });
            newUser.save()
              .then(user => user)
              .catch(error => ({ invalid: i, error }))
          })
          return resolve(dataList);
        case "todos":
        default: reject({ message: 'Invalid database' })

      }
    })
  }
}
// // Collection Operations - DB query & callback
// export const collectionOps = {
//   // GET document list from collection database.
//   getList: (db = String(), callback = Function()) => {
//     switch (db) {
//       case "users":
//         return User.find((err, dataList) =>
//           err
//             ? callback(err)
//             : dataList.length === 0
//               ? callback({
//                 message: "Empty collection in database"
//               })
//               : callback(null, dataList)
//         );
//       case "todos":
//         return Todo.find((err, dataList) =>
//           err
//             ? callback(err)
//             : dataList.length === 0
//               ? callback(null, false, {
//                 message: "No items in database"
//               })
//               : callback(null, dataList, {
//                 message: "Data list found"
//               })
//         );
//       default:
//         return callback(null, false, {
//           message: "Invalid Database"
//         });
//     }
//   },
//   // Add new document list to collection database.
//   addList: (db = String(), lists = Array(), callback = Function()) => {
//     if (!Array.isArray(lists) || lists.length === 0)
//       return callback(null, false, {
//         message: "Invalid/Empty list provided"
//       });
//     let dataList;
//     switch (db) {
//       case "users":
//         dataList = lists.map((list, i) => {
//           const { firstName, lastName, email, password } = list;
//           const newUser = new User({
//             name: {
//               firstName,
//               lastName
//             },
//             email,
//             password: hashPassword(password)
//           });
//           return newUser.save((err, user) =>
//             err ? { invalid: i, error: err } : user
//           );
//         });
//         (dataList.filter(data => data.invalid === undefined)).length > 0
//           ? callback(null, false, {
//             message: "Encountered Invalid Inputs",
//             request: list,
//             response: dataList
//           })
//           : callback(null, dataList, {
//             message: "New entries added to Database"
//           });
//       case "todos":
//         dataList = lists.map((list, i) => {
//           const { title, body, author } = list;
//           const newTodo = new Todo({
//             title,
//             body,
//             created_by: author
//           });
//           return newTodo.save((err, todo) =>
//             err ? { invalid: i, error: err } : todo
//           );
//         });
//         dataList.filter(data => data.invalid === undefined).length > 0
//           ? callback(null, false, {
//             message: "Encountered Invalid Inputs",
//             request: list,
//             response: dataList
//           })
//           : callback(null, dataList, {
//             message: "New entries added to Database"
//           });
//       default:
//         return callback(null, false, {
//           message: "Invalid Database"
//         });
//     }
//   }
// };

// Document Operations - DB query & callback
export const documentOps = {
  // GET document by id from collection database.
  getDoc: (db = String(), id = String(), callback = Function()) => {
    switch (db) {
      case "users":
        return User.findById(id, (err, user) =>
          err
            ? callback(err)
            : !user
              ? callback(null, false, {
                message: "User not found"
              })
              : callback(null, user, {
                message: "User found"
              })
        );
      case "todos":
        return Todo.findOne({ _id: id }, (err, todo) =>
          err
            ? callback(err)
            : !todo
              ? callback(null, false, {
                message: "Todo not found"
              })
              : callback(null, todo, {
                message: "Todo found"
              })
        );
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
        return User.updateOne({ _id: id }, { ...data }, (err, user) =>
          err
            ? callback(err)
            : !user
              ? callback(null, false, {
                message: "User not found"
              })
              : callback(null, user, {
                message: "User updated"
              })
        );
      case "todos":
        return Todo.updateOne({ _id: id }, { ...data }, (err, todo) =>
          err
            ? callback(err)
            : !todo
              ? callback(null, false, {
                message: "Todo not found"
              })
              : callback(null, todo, {
                message: "Todo updated"
              })
        );
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
        return User.remove({ _id: id }, err =>
          err
            ? callback(err)
            : callback(null, id, {
              message: `User id removed:\n ${id}`
            })
        );
      case "todos":
        return Todo.remove({ _id: id }, err =>
          err
            ? callback(err)
            : callback(null, id, {
              message: `Todo id removed:\n ${id}`
            })
        );
      default:
        return callback(null, false, {
          message: "Invalid Database"
        });
    }
  }
};
