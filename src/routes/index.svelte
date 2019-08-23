<script>
  let framework = "";
  const handleChange = e => {
    console.log(e.target.value);
  };
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
<select bind:value={framework} on:change={handleChange}>
  <option value="">Select ...</option>
  <option value="angular">Angular</option>
  <option value="react">React</option>
  <option value="vue">Vue</option>
</select>
