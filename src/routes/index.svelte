<script>
  import { getContext, onMount } from "svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import {
    loginUser,
    registerUser,
    logoutUser,
    isLoggedIn
  } from "../components/api/authComponent";

  $: framework = getContext("framework");
  $: register = getContext("register");
  $: user = getContext("user");

  function toggleRegister() {
    register = !register;
  }

  function handleFramework(e = Object()) {
    framework = e.target.value;
    console.log(framework);
  }

  function handleRegister(e = Object()) {
    e.preventDefault();
    let firstName = e.target[0].value;
    let lastName = e.target[1].value;
    let email = e.target[2].value;
    let password = e.target[3].value;
    if (email === "" || password === "")
      return console.warn("Missing email and/or password!");
    registerUser({ firstName, lastName, email, password }, (err, data) => {
      if (err) {
        e.target[0].value = "";
        e.target[1].value = "";
        e.target[2].value = "";
        e.target[3].value = "";
        return console.warn(err);
      }
      const { message = "", token = "" } = data;
      if (token !== "") localStorage.setItem("token", JSON.stringify(token));
      user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        isLoggedIn: true
      };
      toggleRegister();
      console.info(message);
      // TODO - add popup info modal to display message
    });
  }

  function handleLogin(e = Object()) {
    e.preventDefault();
    let email = e.target[0].value;
    let password = e.target[1].value;
    loginUser({ email, password }, (err, data) => {
      if (err) {
        if (/password/.test(err.message)) {
          e.target[1].value = "";
          return console.warn(err.message);
        }
        e.target[0].value = "";
        e.target[1].value = "";
        return console.warn(err.message);
      }
      const { message = "", token = "" } = data;
      if (token !== "") localStorage.setItem("token", JSON.stringify(token));
      user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        isLoggedIn: true
      };
      // TODO - add popup info modal to display message
      console.info(message);
    });
  }

  function handleLoggedIn() {
    isLoggedIn((err, data) => {
      if (err) return console.warn(err);
      if (!data) return console.warn(`Access token invalid`);
      const { message = "", token = "" } = data;
      if (token !== "") {
        user = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          isLoggedIn: true
        };
        localStorage.setItem("token", JSON.stringify(token));
        return console.info(
          `Access token verified and ${user.email} logged in`
        );
      }
      console.warn(`Access token is invalid \n${token}`);
    });
  }

  async function handleLogout() {
    try {
      const data = await logoutUser();
      user = {
        firstName: "",
        lastName: "",
        email: "",
        isLoggedIn: false
      };
      return (
        localStorage.clear(),
        console.log("Logged out successfully"),
        console.log(data)
      );
    } catch (error) {
      return console.warn(error);
    }
  }

  onMount(() => {
    let testUser = user;
    console.log(testUser);
    localStorage.length > 0 && handleLoggedIn();
  });
</script>

<style>
  h1 {
    text-align: center;
    margin: 0.25em auto;
    font-size: 1.8em;
    text-transform: uppercase;
    font-weight: 700;
  }

  img {
    max-width: 80vw;
    margin: 0 5vw 0.25em 0 5vw;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 3em;
      margin: 0.5em auto;
    }
  }
</style>

<svelte:head>
  <title>NS Framework Sandbox</title>
</svelte:head>

<div on:click={() => window.location.replace('/')}>
  <img alt="banner" src="ninestack_banner.jpg" />
</div>
{#if !user.$isLoggedIn}
  {#if !register}
    <h1>Login!</h1>
    <Login {toggleRegister} {handleLogin} />
  {:else}
    <h1>Register!</h1>
    <Register {toggleRegister} {handleRegister} />
  {/if}
{:else}
  <h1>Welcome {user.firstName}</h1>
  <p>Select your Framework!</p>
  <select bind:value={framework} on:change={handleFramework}>
    <option value="">Select ...</option>
    <option value="angular">Angular</option>
    <option value="react">React</option>
    <option value="vue">Vue</option>
  </select>
  <button on:click={handleLogout}>Logout</button>
{/if}
