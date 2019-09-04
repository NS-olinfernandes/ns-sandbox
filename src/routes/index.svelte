<script>
  import { getContext, onMount } from "svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";
  import { logoutUser, isLoggedIn } from "../components/api/authComponent";

  let framework;

  function handleFramework(e = Object()) {
    console.log(e.target.value);
  }

  function handleLoggedIn() {
    isLoggedIn((err, data) => {
      if (err) return console.warn(err);
      if (!data || data.token === undefined) return console.warn(`Access token invalid`);
      localStorage.setItem("token", JSON.stringify(data.token));
      console.info(`Access token verified and ${data.email} logged in`);
    });
  }

  onMount(() => {
    if (
      localStorage.length > 0 &&
      JSON.parse(localStorage.getItem("token") !== undefined)
    ) {
      handleLoggedIn();
    }

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
<Login />
<hr />
<Register />
