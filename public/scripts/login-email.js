import {alert} from "./funcs/alert.js";

// variables
let $ = document
const rememberMeCheckBox = $.querySelector('.remember-me--checkbox')
const wholeContainer = $.querySelector('#login-using-email-container')
const form = $.querySelector('#login-using-email')

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

    alert(wholeContainer, 'check-circle', 'primary', 'موفق', 'با موفقیت وارد شدید')
}

// ------------------------- End of Functions

// ------------------------- Event listeners

form.addEventListener('submit', event => formSubmissionHandler(event))
rememberMeCheckBox.addEventListener('click', (event) => toggleRememberMeCheckBox(event))

// ------------------------- End of Event listeners