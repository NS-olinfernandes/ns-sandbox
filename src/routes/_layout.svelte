<script>
  import { setContext } from "svelte";
  import { framework, user, register } from '../bin/stores';

  export let segment;

  setContext('framework', $framework);
  setContext('user', $user);
  setContext('register', $register);

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
