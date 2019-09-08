import { writable } from 'svelte/store';
import {
  loginUser,
  registerUser,
  isLoggedIn,
  logoutUser
} from "../components/api/authComponent";

const UserClass = class {
  constructor(props) {
    this.firstName = writable(props.firstName || '');
    this.lastName = writable(props.lastName || '');
    this.email = writable(props.email || '');
    this.token = writable(props.token || '');
    this.isLoggedIn = writable(props.isLoggedIn || false);
  }
  test() {
    console.log({ ...this });
  }
  register(event) {
    event.preventDefault();
    let newUser = {}
    for (target in event.target) {
      newUser[target.name] = target.value;
    }
    console.log(newUser);
    registerUser(newUser)
      .then(data => {
        this.firstName.update(v => data.firstName);
        this.lastName.update(v => data.lastName);
        this.email.update(v => data.email);
        this.token.update(v => data.token);
        this.isLoggedIn.update(v => true);
      })
      .catch(error => console.warn(error));
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
