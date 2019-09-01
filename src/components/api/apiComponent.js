import { setOptions, api_routes } from "./config";

const userApi = api_routes["users"];
const todoApi = api_routes["todos"];

// Collection ops api calls

// GET users listings
export async function getUsers(callback = Function()) {
  try {
    const response = await fetch(`${userApi}`, setOptions());
    const dataList = response.json();
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
    const dataList = response.json();
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
      setOptions({ method: "POST", body: dataList })
    );
    const data = response.json();
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
      setOptions({ method: "POST", body: dataList })
    );
    const data = response.json();
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
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
// GET todo document
export async function getTodoById(id = String(), callback = Function()) {
  try {
    const response = await fetch(`${todoApi}/${id}`, setOptions());
    const data = response.json();
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
        body: userUpdates
      })
    );
    const data = response.json();
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
        body: todoUpdates
      })
    );
    const data = response.json();
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
    const data = response.json();
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
    const data = response.json();
    return callback(null, data);
  } catch (error) {
    return callback(error);
  }
}
