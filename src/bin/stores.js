import { writable } from 'svelte/store';
import {
  loginUser,
  registerUser,
  isLoggedIn,
  logoutUser
} from "../components/api/authComponent";

const UserClass = class {
  constructor(props) {
    // Props
    this.firstName = writable(props.firstName || '');
    this.lastName = writable(props.lastName || '');
    this.email = writable(props.email || '');
    this.token = writable(props.token || '');
    this.isLoggedIn = writable(props.isLoggedIn || false);

    // Methods
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.isloggedin = this.isloggedin.bind(this);
    this.logout = this.logout.bind(this);
  }
  test() {
    console.log({ ...this });
  }
  register(event) {
    event.preventDefault();
    let newUser = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      email: event.target[2].value,
      password: event.target[3].value
    }
    // TODO Add form validation
    return registerUser(newUser)
      .then(data => {
        localStorage.setItem('token', JSON.stringify(data.token))
        this.firstName.update(v => data.firstName);
        this.lastName.update(v => data.lastName);
        this.email.update(v => data.email);
        this.token.update(v => data.token);
        this.isLoggedIn.update(v => true);
      })
      .catch(error => console.warn(error));
  }
  login(event) {
    event.preventDefault();
    let user = {
      email: event.target[0].value,
      password: event.target[1].value
    }
    // TODO Add form validation
    return loginUser(user)
      .then(data => {
        localStorage.setItem('token', JSON.stringify(data.token));
        this.firstName.update(v => data.firstName);
        this.lastName.update(v => data.lastName);
        this.email.update(v => data.email);
        this.token.update(v => data.token);
        this.isLoggedIn.update(v => true);
      })
      .catch(error => console.warn(error))
  }
  isloggedin() {
    return isLoggedIn()
      .then(data => {
        this.firstName.update(v => data.firstName);
        this.lastName.update(v => data.lastName);
        this.email.update(v => data.email);
        this.token.update(v => data.token);
        this.isLoggedIn.update(v => true);
      })
      .catch(error => console.warn(error))
  }
  logout() {
    return logoutUser()
      .then(data => {
        localStorage.clear();
        this.firstName.update(v => '');
        this.lastName.update(v => '');
        this.email.update(v => '');
        this.token.update(v => '');
        this.isLoggedIn.update(v => false);
      })
      .catch(error => console.warn(error))
  }
};

const RegisterClass = class {
  constructor(props) {
    this.value = writable(props.value || false);
  }
  toggle() {
    this.value.update(v => !v)
  }
}

export const User = UserClass;
// export const User = new UserClass({});
export const Register = new RegisterClass(false);

export const framework = writable('');
export const register = writable(false);
