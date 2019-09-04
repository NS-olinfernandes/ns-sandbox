<script>
  export let toggleRegister;
  export let handleLogin;
</script>

<style>
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
</style>

<div class="container">
  <form on:submit={handleLogin}>
    <div class="form-group">
      <label>Email</label>
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
      />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
      />
    </div>
    <div class="button-group">
      <button type="submit">Login</button>
    </div>
  </form>
  <p>Don't have an account? <a href='.' on:click={toggleRegister}>Register</a></p>
</div>
