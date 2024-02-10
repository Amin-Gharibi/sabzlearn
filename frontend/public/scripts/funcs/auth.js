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
        fetch('https://amingharibi-sabzlearn.liara.run/v1/auth/register', {
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
                    return response.json()
                } else if (response.status === 409) {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'این نام کاربری یا ایمیل قبلا استفاده شده است!')
                } else if (response.status === 403) {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'متاسفانه این شماره تلفن بن شده است!')
                } else {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطا در ارتباط با سرور. لطفا مجدد تلاش کنید')
                }
            }).then(data => {
                saveToLocalStorage('user', {token: data?.accessToken})
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
        fetch('https://amingharibi-sabzlearn.liara.run/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfos)
        }).then(response => {
            if (response.status === 401) {
                alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'نام کاربری یا رمز عبور اشتباه است!')
            } else if (response.status === 403) {
                alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'متاسفانه این شماره تلفن بن شده است!')
            } else {
                return response.json()
            }
        }).then(data => {
            saveToLocalStorage('user', {token: data?.accessToken})
            data && alert(document.body, 'check-circle', 'primary', 'موفق', 'با موفقیت وارد شدید')
            data && getMe().then(res => {
                const user = res

                setTimeout(() => {
                    if (user.role === "ADMIN" || user.role === "TEACHER") {
                        location.href = 'admin-panel/main'
                    } else {
                        location.href = document.referrer
                    }
                }, 1000)
            })
        })
    }
}

// get logged in user's infos
const getMe = async () => {
    const userToken = getToken()

    if (!userToken) {
        return false
    }

    const request = await fetch('https://amingharibi-sabzlearn.liara.run/v1/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
    if (request.status === 403 || request.status === 401) {
        logOut()
        return false
    }

    return await request.json()
}

const logOut = () => {
    localStorage.removeItem('user')
    location.reload()
}

export {register, login, getMe, logOut}