<script>
  import { getContext, onMount } from "svelte";
  import Login from "../components/Login.svelte";
  import Register from "../components/Register.svelte";

  $: framework = getContext("framework");
  $: register = getContext("register");
  const User = getContext("User");
  const { firstName, lastName, email, token, isLoggedIn } = User;

  function toggleRegister() {
    register = !register;
  }

  function handleFramework(e) {
    framework = e.target.value;
    console.log(framework);
  }

  onMount(() => {
    localStorage.length > 0 && User.isloggedin();
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
    <Login {toggleRegister} handleLogin={User.login} />
  {:else}
    <h1>Register!</h1>
    <Register {toggleRegister} handleRegister={User.register} />
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
  <button on:click={User.logout}>Logout</button>
{/if}
