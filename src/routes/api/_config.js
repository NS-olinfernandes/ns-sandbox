import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const db_url = "mongodb/Sanbox";
// const db_url = 'ns-mongodb1/Sandbox';
const db_url = "localhost/Sandbox";
// const db_url = "172.18.0.2/Sandbox";

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
const generateToken = (payload = Object()) => {
  const token = jwt.sign(payload, secret);
  return token;
};
const verifyToken = (token = String(), callback = Function()) =>
  jwt.verify(token, secret, callback);

const hashPassword = (password = String()) => {
  let salt = bcrypt.genSaltSync(8);
  let hashedPass = bcrypt.hashSync(password, salt);
  return hashedPass;
};

// Validate Token - Devrypt token & check DB for user
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
        callback(null, ({ name, email, accessToken } = user), {
          message: "Token verified!"
        });
      }
    );
  });
}

// Login User - DB query & callbacl
export async function authenticateUser(
  { email = String(), password = String() },
  callback = Function()
) {
  if (email === "" || password === "")
    return callback(null, false, {
      message: "Email and/or password missing"
    });
  const hashedPassword = hashPassword(password);
  const token = generateToken({ email, hashedPassword });
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

export const collectionOps = {
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
  addList: async (db = String(), lists = Array(), callback = Function()) => {
    if (/users/.test(db)) {
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
      if(dataList.filter(data => data.invalid === undefined).length > 0){
        return callback(null, false, {
          message: 'Encountered Invalid Inputs',
          request: list,
          response: dataList
        })
      }
      return callback(null, dataList, {
        message: 'New entries added to Database'
      })
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
      if(dataList.filter(data => data.invalid === undefined).length > 0){
        return callback(null, false, {
          message: 'Encountered Invalid Inputs',
          request: list,
          response: dataList
        })
      }
      return callback(null, dataList, {
        message: 'New entries added to Database'
      })
    }
    callback(null, false, {
      message: "Invalid Database"
    });
  }
};

export const documentOps = {
  get: (db = String(), id = String(), callback = Function()) => {
    User.findOne({_id: id}, callback)
    Todo.findOne({_id: id}, callback)
  },
  put: (db = String(), id = String(), data = Object(), callback = Function()) => {
    User.findOneAndUpdate({_id: id}, {...data}, callback)
    Todo.findOneAndUpdate({_id: id}, {...data}, callback)
  },
  del: (db = String(), id = String(), callback = Function()) => {
    User.remove({_id: id}, callback)
    Todo.remove({_id: id}, callback)
  }
}