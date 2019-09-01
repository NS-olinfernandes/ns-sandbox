<script>
  import { onMount } from "svelte";
  import {
    loginUser,
    logoutUser,
    isLoggedIn,
    registerUser
  } from "../components/api/authComponent";

  let framework = String();
  let firstName = String();
  let lastName = String();
  let email = String();
  let password = String();

  function handleFramework(e = Object()) {
    console.log(e.target.value);
  }
  function handleRegister(e = Object()) {
    e.preventDefault();
    registerUser({ firstName, lastName, email, password }, (err, data) => {
      if (err) return console.warn(err);
      const { message = "", token = "" } = data;
      if (token !== "") localStorage.setItem("token", JSON.stringify(token));
      console.info(message);
      (firstName = ""), (lastName = ""), (email = ""), (password = "");
    });
  }
  function handleLogin(e = Object()) {
    e.preventDefault();
    loginUser({ email, password }, (err, data) => {
      if (err) return console.warn(err);
      const { message = "", token = "" } = data;
      if (token !== "") localStorage.setItem("token", JSON.stringify(token));
      console.info(message);
      (email = ""), (password = "");
    });
  }
  function handleLoggedIn() {
    isLoggedIn((err, data) => {
      if (err) return console.warn(err);
      localStorage.setItem("token", JSON.stringify(data.token));
    });
  }

  onMount(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (localStorage.length > 0) {
      handleLoggedIn();
    }

    return abortController.abort;
  });
</script>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
    font-size: 1.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }
  button {
    cursor: pointer;
    outline: none;
  }
  button:visited {
    display: none;
  }
  .container {
    padding: 10px 15px;
    margin: 0 auto;
  }
  .container form .form-group input {
    width: 100%;
    height: 25px;
    border-radius: 15px;
    padding: 0 10px;
  }
  .container form .button-group button {
    width: 100%;
    height: 30px;
    text-align: center;
    margin: 12px 15px;
    border-radius: 15px;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 3em;
    }
  }
</style>

<svelte:head>
  <title>NS Framework Sandbox</title>
</svelte:head>

<h1>Select your Framework!</h1>
<select bind:value={framework} on:change={handleFramework}>
  <option value="">Select ...</option>
  <option value="angular">Angular</option>
  <option value="react">React</option>
  <option value="vue">Vue</option>
</select>
<div class="container">
  <form on:submit={handleLogin}>
    <div class="form-group">
      <label>Email</label>
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
        bind:value={email} />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        bind:value={password} />
    </div>
    <div class="button-group">
      <button type="submit">Login</button>
    </div>
  </form>
</div>
