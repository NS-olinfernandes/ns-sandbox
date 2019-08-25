import { User, hashPassword } from "../_config";

// Register new User - POST api response
export async function post(req, res) {
  const user = req.body;
  const newUser = new User({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hashPassword(user.password)
  });
  try {
    const response = await newUser.save();
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(401).json({ message: "Email already exists!" });
    }
    return res.status(400).send(error);
  }
}
