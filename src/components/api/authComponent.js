import { setOptions, api_routes } from "./config";

const authApi = api_routes["auth"];

// Logout User - GET api call
export async function logotUser(callback = Function) {
  try {
    const response = await fetch(`${authApi}/logout`, setOptions());
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// IsLoggedIn User - GET api call
export async function isloggedin(callback = Function) {
  try {
    const response = await fetch(`${authApi}/isloggedin`, setOptions());
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Login User - POST api call
export async function loginUser(user = {}, callback = Function) {
  try {
    const response = await fetch(
      `${authApi}/login`,
      setOptions({
        method: "POST",
        body: user
      })
    );
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Add/Register User - POST api call
export async function register(user = {}, callback = Function) {
  try {
    const response = await fetch(
      `${authApi}/register`,
      setOptions({
        method: "POST",
        body: user
      })
    );
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
