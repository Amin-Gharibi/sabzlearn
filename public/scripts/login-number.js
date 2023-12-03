import {alert} from './funcs/alert.js'

// define needed variables
let $ = document
const loginStepOne = $.querySelector('#login-step-1')
const loginStepTwo = $.querySelector('#login-step-2')
const formStepOne = $.querySelector('#form-step-1')
const formStepTwo = $.querySelector('#form-step-2')
const form = $.querySelector('.form')
const phoneNumberInput = $.querySelector('#phone-number-input')
const userPhoneNumberText = $.querySelector('#login--phone-number')
const otpInputs = $.querySelectorAll('.otp--inputs')
const loginSecondStepBackBtn = $.querySelector('.login--step-two__back-btn')

// -------------------------------- Functions

// handles validating the phone number input
let validValue = ''
const phoneNumberValidation = event => {
    let newValue = event.target.value

    if (!isNaN(newValue)) {
        event.target.value = newValue
        validValue = newValue
    } else {
        event.target.value = validValue
    }
}

// handles on submit event on the first step of login using phone number
const loginStepOneSubmission = (event) => {
    event.preventDefault()

    // if phone number was valid shows an alert and goes to next step and starts the interval for resend btn
    if (phoneNumberInput.value.length === 11) {
        alert(form, 'check-circle', 'primary', 'موفق', 'کد تایید به شماره موبایل وارد شده ارسال شد.')

        loginStepOne.classList.add('hidden')
        loginStepTwo.classList.remove('hidden')

        const otpResendBtn = $.querySelector('.otp--resend-btn')
        let i = 30
        const updateResendTime = setInterval(() => {
            i--
            otpResendTimeIntervalHandler(i, otpResendBtn, updateResendTime)
        }, 1000)
    } else {
        alert(form, 'close-circle', 'alert-red', 'خطا', 'ارسال کد تایید به شماره وارد شده با خطا مواجه شد.')
    }

    userPhoneNumberText.innerHTML = phoneNumberInput.value
}

// handles validation of otp code inputs
const otpInputsValidation = (event, index) => {
    let newValue = event.target.value

    if (!isNaN(newValue)) {
        event.target.value = newValue
        otpInputs[index + 1] ? otpInputs[index + 1].focus() : (otpInputs[index].blur() && loginStepTwoSubmission())
    } else {
        event.target.value = ''
    }
}

// handles interval for resending otp code
const otpResendTimeIntervalHandler = (i, otpResendBtn, intervalID) => {
    if (i >= 0) {
        if (i <= 9) {
            otpResendBtn.innerHTML = `ارسال دوباره (0:${'0' + i})`
        } else {
            otpResendBtn.innerHTML = `ارسال دوباره (0:${i})`
        }
        !otpResendBtn.disabled && (otpResendBtn.disabled = true)
    } else {
        otpResendBtn.innerHTML = 'ارسال دوباره'
        otpResendBtn.disabled = false

        otpResendBtn.addEventListener('click', resendingOtpCodeHandler)
        clearInterval(intervalID)
    }
}

// handles clicking on the resend otp button
const resendingOtpCodeHandler = () => {
    const otpResendBtn = $.querySelector('.otp--resend-btn')
    let i = 31
    const updateResendTime = setInterval(() => {
        i--
        otpResendTimeIntervalHandler(i, otpResendBtn, updateResendTime)
    }, 1000)

    otpInputs.forEach(input => input.value = '')
    alert(form, 'check-circle', 'primary', 'موفق', 'کد تایید جدید به شماره موبایل وارد شده ارسال شد.')
}

// handles back button in the second step
loginSecondStepBackBtn.addEventListener('click', () => {
    otpInputs.forEach(input => {
        input.value = ''
    })
    loginStepTwo.classList.add('hidden')
    loginStepOne.classList.remove('hidden')
})

// handles submission of second step of logging in using phone number
const loginStepTwoSubmission = () => {
    console.log('logged in')
}

// ------------------------- End of Functions

// ------------------------- Event listeners

otpInputs.forEach((input, index) => {
    input.addEventListener('input', event => otpInputsValidation(event, index))
})

phoneNumberInput.addEventListener('input', event => phoneNumberValidation(event))

formStepOne.addEventListener('submit', event => loginStepOneSubmission(event))

// ---------------------------- End of Event listeners