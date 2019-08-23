export const abortController = new AbortController();
export const signal = abortController.signal;

export const setOptions = () => {
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
  return { headers, signal };
};
