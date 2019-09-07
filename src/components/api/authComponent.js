import { setOptions, api_routes } from "./config";

const authApi = api_routes[0]["auth"];
// Logout User - GET api call
export async function logoutUser(callback = Function()) {
  try {
    const response = await fetch(`${authApi}/logout`, setOptions());
    if (!response.ok) {
      const { message } = response;
      return callback(message);
    }
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
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
export async function registerUser(user = {}, callback) {
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
}
