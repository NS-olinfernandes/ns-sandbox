import { writable } from 'svelte/store';

export const user = writable({
	firstName: '',
	lastName: '',
	email: '',
	token: '',
	isLoggedIn: false
});

export const framework = writable('');
export const register = writable(false);
