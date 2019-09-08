import { setOptions, api_routes } from "./config";

const authApi = api_routes[0]["auth"];
// Logout User - GET api call
export async function logoutUser(callback = Function()) {
  try {
    const response = await fetch(`${authApi}/logout`, setOptions());
    const data = await response.json();
    if (response.status !== 200) return callback(data)
    callback(null, data);
  } catch (error) {
    callback(error);
  }
}

// IsLoggedIn User - GET api call
export function isLoggedIn() {
  return new Promise((resolve, reject) => {
    fetch(`${authApi}/isloggedin`, setOptions())
      .then(response => {
        if (response.status !== 200) return reject(response)
        response.json().then(data => {
          resolve(data)
        });
      }).catch(error => reject(error));
  })
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
export function registerUser(user = { firstName: '', lastName: '', email: '', password: '' }) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${authApi}/register`,
        setOptions({
          method: "POST",
          body: JSON.stringify(user)
        })
      );
      const data = await response.json();
      if (response.status !== 200) return reject(data)
      resolve(data);
    } catch (error) {
      reject(error);
    }

  })
}
