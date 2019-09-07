<script>
  import { setContext } from "svelte";
  import { framework, User, register } from "../bin/stores";

  export let segment;

  setContext("framework", $framework);
  setContext("user", new User({}));
  setContext("User", User);
  setContext("register", $register);
</script>

<style>
  main {
    position: relative;
    max-width: 60em;
    background-color: #ffffff;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<main>
  <slot />
</main>
