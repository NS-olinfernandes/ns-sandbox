import { setOptions, api_routes } from "./config";

const authApi = api_routes[0]["auth"];
// Logout User - GET api call
export async function logoutUser(callback = Function()) {
  try {
    const response = await fetch(`${authApi}/logout`, setOptions());
    if (!response.ok) {
      const message = await response.json();
      return callback(message);
    }
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// IsLoggedIn User - GET api call
export async function isLoggedIn(callback = Function()) {
  try {
    const response = await fetch(`${authApi}/isloggedin`, setOptions());
    if (!response.ok) {
      const message = await response.json();
      return callback(message);
    }
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Login User - POST api call
export async function loginUser(user = {}, callback = Function()) {
  try {
    const response = await fetch(
      `${authApi}/login`,
      setOptions({
        method: "POST",
        body: JSON.stringify(user)
      })
    );
    if (!response.ok) {
      const message = await response.json();
      return callback(message);
    }
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Add/Register User - POST api call
export async function registerUser(user = {}, callback = Function()) {
  try {
    const response = await fetch(
      `${authApi}/register`,
      setOptions({
        method: "POST",
        body: JSON.stringify(user)
      })
    );
    if (!response.ok) {
      const message = await response.json();
      return callback(message);
    }
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
