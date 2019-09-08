import { setOptions, api_routes } from "./config";

const authApi = api_routes[0]["auth"];
// Logout User - GET api call
export const logoutUser = () =>
  new Promise((resolve, reject) =>
    fetch(`${authApi}/logout`, setOptions())
      .then(
        response =>
          response.json()
            .then(data => {
              if (response.status !== 200) return reject(data);
              resolve(data);
            }).catch(error => reject(error))
      ).catch(error => reject(error))
  )

// IsLoggedIn User - GET api call
export const isLoggedIn = () =>
  new Promise((resolve, reject) => {
    fetch(`${authApi}/isloggedin`, setOptions())
      .then(response => {
        if (response.status !== 200) return reject(response)
        response.json().then(data => {
          resolve(data)
        });
      }).catch(error => reject(error));
  })

// Login User - POST api call
export const loginUser = (user = { email: '', password: '' }) =>
  new Promise((resolve, reject) =>
    fetch(`${authApi}/login`, setOptions({
      method: "POST",
      body: JSON.stringify(user)
    }))
      .then(
        response =>
          response.json()
            .then(data => {
              if (response.status !== 200) return reject(data);
              resolve(data);
            })
            .catch(error => reject(error))
      ).catch(error => reject(error))
  )

// Add/Register User - POST api call
export const registerUser = (user = { firstName: '', lastName: '', email: '', password: '' }) =>
  new Promise((resolve, reject) =>
    fetch(
      `${authApi}/register`,
      setOptions({
        method: 'POST',
        body: JSON.stringify(user)
      })
    ).then(response => response.json()
      .then(data => {
        if (response.status !== 200) return reject(data);
        resolve(data)
      }).catch(error => reject(error))
    ).catch(error => reject(error))
  )
