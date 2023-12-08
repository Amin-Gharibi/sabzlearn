import { alert } from "./alert.js";

// sign up handling
const register = () => {
    const username = document.querySelector('#username-input'),
        email = document.querySelector('#email-input'),
        phone = document.querySelector('#phone-input'),
        password = document.querySelector('#password-input');

    const newUserInfos = {
        name: username.value.trim(),
        username: username.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value.trim(),
        confirmPassword: password.value.trim()
    }

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
            } else {
                alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطا در ارتباط با سرور. لطفا مجدد تلاش کنید')
            }
        })
}

export { register }