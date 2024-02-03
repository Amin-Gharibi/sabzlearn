import {alert, getToken, saveToLocalStorage} from "../utils/utils.js";
import {
    emailValidation,
    passwordValidation,
    phoneNumberValidation,
    userNameValidation
} from "./informationValidation.js";

// sign up handling
const register = () => {
    const username = document.querySelector('#username-input'),
        email = document.querySelector('#email-input'),
        phone = document.querySelector('#phone-input'),
        password = document.querySelector('#password-input');

    const newUserInfos = {
        name: username.value.trim(),
        username: username.value.trim().toLowerCase(),
        email: email.value.trim().toLowerCase(),
        phone: phone.value.trim(),
        password: password.value.trim(),
        confirmPassword: password.value.trim()
    }

    const {isPhoneNumberValid, formattedPhoneNumber} = phoneNumberValidation(phone.value.trim())
    newUserInfos.phone = formattedPhoneNumber

    if (!userNameValidation(username.value.trim())) {
        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'نام کاربری باید حداقل 4 کاراکتر باشد و با رقم شروع نشود!')
    } else if (!isPhoneNumberValid) {
        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'شماره موبایل درست نیست!')
    } else if (!emailValidation(email.value.trim())) {
        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'ایمیل درست نیست!')
    } else if (!passwordValidation(password.value.trim())) {
        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'رمز عبور باید حداقل 8 کاراکتر شامل حداقل یک حرف بزرگ و یک کاراکتر ویژه باشد!')
    } else {
        fetch('http://localhost:4000/v1/auth/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUserInfos)
        })
            .then(response => {
                if (response.status === 201) {
                    alert(document.body, 'check-circle', 'primary', 'موفق', 'ثبت نام با موفقیت انجام شد!')
                    setTimeout(() => {
                        location.href = 'index.html'
                    }, 1000)
                } else if (response.status === 409) {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'این نام کاربری یا ایمیل قبلا استفاده شده است!')
                }
                return response.json()
                    .then(data => {
                        saveToLocalStorage('user', {token: data.accessToken})
                    })
            })
            .catch(() => {
                alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطا در ارتباط با سرور. لطفا مجدد تلاش کنید')
            })
    }
}

// login handling
const login = () => {
    const identifierInput = document.querySelector('#email-input')
    const passwordInput = document.querySelector('#password-input');

    const userInfos = {
        identifier: identifierInput.value.trim().toLowerCase(),
        password: passwordInput.value.trim()
    }

    if (!emailValidation(identifierInput.value.trim())) {
        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'ایمیل درست نیست!')
    } else {
        fetch('http://localhost:4000/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfos)
        }).then(response => {
            return response.json()
        })
            .then(async data => {
                if (data.message && data.message === "password is not correct") {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'نام کاربری یا رمز عبور درست نیست!')
                } else if (data === "there is no user with this email or username") {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'کاربری با این اطلاعات یافت نشد')
                } else {
                    alert(document.body, 'check-circle', 'primary', 'موفق', 'با موفقیت وارد شدید')
                    saveToLocalStorage('user', {token: data.accessToken})
                    const user = await getMe()
                    setTimeout(() => {
                        if (user.role === "ADMIN" || user.role === "TEACHER") {
                            location.href = 'admin-panel/main/index.html'
                        } else {
                            location.href = document.referrer
                        }
                    }, 1000)
                }
            })
    }
}

// get logged in user's infos
const getMe = async () => {
    const userToken = getToken()

    if (!userToken) {
        return false
    }

    const request = await fetch('http://localhost:4000/v1/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })

    return await request.json()
}

const logOut = () => {
    localStorage.removeItem('user')
    location.reload()
}

export {register, login, getMe, logOut}