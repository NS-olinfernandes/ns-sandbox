import { setOptions, api_routes } from "./config";

const todoApi = api_routes[1]["todos"];
const userApi = api_routes[2]["users"];

// Collection ops api calls

// GET users listings
export async function getUsers(callback = Function()) {
  try {
    const response = await fetch(`${userApi}`, setOptions());
    const dataList = await response.json();
    return callback(null, dataList);
  } catch (error) {
    console.log(error);
    return callback(error);
  }
}
// GET todos listings
export async function getTodos(callback = Function()) {
  try {
    const response = await fetch(`${todoApi}`, setOptions());
    const dataList = await response.json();
    return callback(null, dataList);
  } catch (error) {
    return callback(error);
  }
}

// POST users listings
export async function addUsers(dataList = [], callback = Function()) {
  try {
    const response = await fetch(
      `${userApi}`,
      setOptions({ method: "POST", body: JSON.stringify(dataList) })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
// POST todos listings
export async function addTodos(dataList = [], callback = Function()) {
  try {
    const response = await fetch(
      `${todoApi}`,
      setOptions({ method: "POST", body: JSON.stringify(dataList) })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// Document ops api calls

// GET user document
export async function getUserById(id = String(), callback = Function()) {
  try {
    const response = await fetch(`${userApi}/${id}`, setOptions());
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
// GET todo document
export async function getTodoById(id = String(), callback = Function()) {
  try {
    const response = await fetch(`${todoApi}/${id}`, setOptions());
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// PUT user document
export async function updateUserById(
  id = String(),
  userUpdates = {},
  callback = Function()
) {
  try {
    const response = await fetch(
      `${userApi}/${id}`,
      setOptions({
        method: "PUT",
        body: JSON.stringify(userUpdates)
      })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
// PUT todo document
export async function updateTodoById(
  id = String(),
  todoUpdates = {},
  callback = Function()
) {
  try {
    const response = await fetch(
      `${todoApi}/${id}`,
      setOptions({
        method: "PUT",
        body: JSON.stringify(todoUpdates)
      })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}

// DELETE user document
export async function deleteUserById(id = String(), callback = Function()) {
  try {
    const response = await fetch(
      `${userApi}/${id}`,
      setOptions({ method: "DELETE" })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
// DELETE todo document
export async function deleteTodoById(id = String(), callback = Function()) {
  try {
    const response = await fetch(
      `${todoApi}/${id}`,
      setOptions({ method: "DELETE" })
    );
    const data = await response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
