import { register } from "./funcs/auth.js";

const signUpForm = document.querySelector('#signup-form');

signUpForm.addEventListener('submit', event => {
    event.preventDefault()

    const submitBtn = document.querySelector('#submit-btn')
    submitBtn.innerHTML = `
        <div class="w-full h-full flex justify-center">
            <span class="linear-loader"></span>
        </div>
    `

    register()
})