<script>
  import { registerUser } from "./api/authComponent";
  let firstName = String();
  let lastName = String();
  let email = String();
  let password = String();

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
  <form on:submit={handleRegister}>
    <div class="form-group">
      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        placeholder="Enter your first name"
        bind:value={firstName} />
    </div>
    <div class="form-group">
      <label>Last Name</label>
      <input
        type="text"
        name="lastName"
        placeholder="Enter your last name"
        bind:value={lastName} />
    </div>
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
      <button type="submit">Register</button>
    </div>
  </form>
</div>
