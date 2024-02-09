import {login} from "./funcs/auth.js";
import {getToken} from "./utils/utils.js";

// variables
let $ = document
const rememberMeCheckBox = $.querySelector('.remember-me--checkbox'),
    wholeContainer = $.querySelector('#login-using-email-container'),
    form = $.querySelector('#login-using-email');

if (getToken()) { // if user was logged in already go to main page
    location.href = 'index.html'
}

// ------------------- Functions
const toggleRememberMeCheckBox = (event) => {
    const input = event.currentTarget.firstChild
    const checkBoxMark = event.currentTarget.children[1]

    input.checked === undefined && (input.checked = true)
    input.checked ? input.checked = false : input.checked = true

    checkBoxMark.classList.toggle('remember-me--checkbox__checked')
}

const formSubmissionHandler = event => {
    event.preventDefault()

    login()
}

// ------------------------- End of Functions

// ------------------------- Event listeners

form.addEventListener('submit', event => formSubmissionHandler(event))
rememberMeCheckBox.addEventListener('click', (event) => toggleRememberMeCheckBox(event))

// ------------------------- End of Event listeners