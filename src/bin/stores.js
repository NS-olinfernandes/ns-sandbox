import { writable } from 'svelte/store';
import {
  loginUser,
  registerUser,
  logoutUser,
  isLoggedIn
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
  handleRegister(event, callback) {
    event.preventDefault();
    let newUser = {}
    for (target in event.target) {
      newUser[target.name] = target.value;
    }
    console.log(newUser);
    return registerUser(newUser, (error, data) => {

    });
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
