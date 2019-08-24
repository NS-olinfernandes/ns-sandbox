import { signal, setOptions, User, api_routes } from "./config";

const authApi = api_routes["auth"];

// Login User - GET api call
export async function loginUser(user = {}, callback = Function) {
  try {
    const response = await fetch(`${authApi}/login`, setOptions());
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Logout User - GET api call
export async function logotUser(callback = Function) {
    try {
        const response = await fetch(`${authApi}/logout`, setOptions());
        const data = await response.json();
        return callback(null, data);
    } catch (error) {
        return callback(error);
    }
}
