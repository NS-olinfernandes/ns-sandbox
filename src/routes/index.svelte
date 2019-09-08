<script>
  import { getContext, onMount } from "svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import {
    loginUser,
    registerUser,
    logoutUser,
    isLoggedIn as isUserLoggedIn
  } from "../components/api/authComponent";

  $: framework = getContext("framework");
  $: register = getContext("register");
  const user = getContext("user");
  let { firstName, lastName, email, token, isLoggedIn } = user;

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
    return registerUser(
      { firstName, lastName, email, password },
      (err, data) => {
        if (err) {
          e.target[0].value = "";
          e.target[1].value = "";
          e.target[2].value = "";
          e.target[3].value = "";
          return console.warn(err);
        }
        const { message = "", token = "" } = data;
        if (token !== "") localStorage.setItem("token", JSON.stringify(token));
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.isLoggedIn = true;
        toggleRegister();
        console.info(message);
        // TODO - add popup info modal to display message
      }
    );
  }

  function handleLogin(e = Object()) {
    e.preventDefault();
    loginUser(
      { email: e.target[0].value, password: e.target[1].value },
      (err, data) => {
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
        firstName.update(v => data.firstName);
        lastName.update(v => data.lastName);
        email.update(v => data.email);
        isLoggedIn.update(v => true);
        // TODO - add popup info modal to display message
        console.info(message);
      }
    );
  }

  async function handleLoggedIn() {
    try {
      const data = await isUserLoggedIn();
      if (!data) return console.warn("Data is undefined");
      console.log(data);
      firstName.update(v => data.firstName);
      lastName.update(v => data.lastName);
      email.update(v => data.email);
      token.update(v => data.token);
      isLoggedIn.update(v => !!data.email);
    } catch (error) {
      console.warn(error);
    }
    // isUserLoggedIn((err, data) => {
    //   if (err) return console.warn(err);
    //   if (!data) return console.warn(`Access token invalid`);
    //   const { message = "", token = "" } = data;
    //   if (token !== "") {
    //     firstName.update(v => data.firstName);
    //     lastName.update(v => data.lastName);
    //     email.update(v => data.email);
    //     isLoggedIn.update(v => true);
    //     localStorage.setItem("token", JSON.stringify(token));
    //     return console.info(`Access token verified and ${$email} logged in`);
    //   }
    //   console.warn(`Access token is invalid \n${token}`);
    // });
  }

  async function handleLogout() {
    try {
      const data = await logoutUser();
      firstName.update(v => "");
      lastName.update(v => "");
      email.update(v => "");
      isLoggedIn.update(v => false);
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
{#if !$isLoggedIn}
  {#if !register}
    <h1>Login!</h1>
    <Login {toggleRegister} {handleLogin} />
  {:else}
    <h1>Register!</h1>
    <Register {toggleRegister} handleRegister={user.register} />
  {/if}
{:else}
  <h1>Welcome {$firstName}</h1>
  <p>Select your Framework!</p>
  <select bind:value={framework} on:change={handleFramework}>
    <option value="">Select ...</option>
    <option value="angular">Angular</option>
    <option value="react">React</option>
    <option value="vue">Vue</option>
  </select>
  <button on:click={handleLogout}>Logout</button>
{/if}
