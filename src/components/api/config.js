const api_url = "/api";
const routes = ["auth", "todos", "users"];
export const api_routes = routes.map(route => {
  return {
    [route]: `${api_url}/${route}`
  };
});

export const abortController = new AbortController();
export const signal = abortController.signal;

export const setOptions = (params = {}) => {
  let token;
  let headers;
  localStorage.length > 0
    ? (token = JSON.parse(localStorage.getItem("token")))
    : (token = "");
  token !== "" && token !== undefined
    ? (headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      })
    : (headers = {
        "Content-Type": "application/json"
      });
  return params !== {} ? { headers, signal, ...params } : { headers, signal };
};
