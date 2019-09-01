import { setOptions, api_routes } from "./config";

const userApi = api_routes["users"];
const todoApi = api_routes["todos"];

// GET Requests - api calls

// GET users listings
export async function getUsers(callback = Function) {
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
export async function getTodos(callback = Function) {
  try {
    const response = await fetch(`${todoApi}`, setOptions());
    const dataList = response.json();
    return callback(null, dataList);
  } catch (error) {
    console.log(error);
    return callback(error);
  }
}
