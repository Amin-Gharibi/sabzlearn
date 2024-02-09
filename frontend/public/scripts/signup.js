import { register } from "./funcs/auth.js";

const signUpForm = document.querySelector('#signup-form');

signUpForm.addEventListener('submit', event => {
    event.preventDefault()

    register()
})