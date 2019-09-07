import { writable } from 'svelte/store';
import {
	loginUser,
	registerUser,
	logoutUser,
	isLoggedIn
} from "../components/api/authComponent";

const UserClass = class extends Object {
	constructor(props) {
		super(props)
		this.firstName = writable(props.firstName || '');
		this.lastName = writable(props.lastName || '');
		this.email = writable(props.email || '');
		this.token = writable(props.token || '');
		this.isLoggedIn = writable(props.isLoggedIn || false);
	}
	test() {
		this.isLoggedIn = false;
		console.log({ ...this });
	}
	registerUser(newUser = {
		firstName = '',
		lastName = '',
		email = '',
		password = ''
	}, callback = Function(error = {}, data = {})) {
		registerUser(newUser, callback);
	}
};

const RegisterClass = class extends Object {
	constructor(props) {
		super(props)
		this.value = writable(props.value || false);
	}
	toggle() {
		this.value.update(v => !v)
	}
}

export const User = new UserClass({});
export const Register = new RegisterClass(false);

export const framework = writable('');
export const register = writable(false);
