import {getMe} from "../../../scripts/funcs/auth.js";
import {getToken} from "../../../scripts/utils/utils.js";
import {
	emailValidation,
	passwordValidation,
	phoneNumberValidation,
	userNameValidation
} from "../../../scripts/funcs/informationValidation.js";

const user = await getMe()

const nameInput = document.querySelector('#name-input')
const usernameInput = document.querySelector('#username-input')
const passwordInput = document.querySelector('#password-input')
const emailInput = document.querySelector('#email-input')
const phoneInput = document.querySelector('#phone-input')
const profileInput = document.querySelector('#profile-pic-input')
const profileInputContainer = document.querySelector('.profile-input-container')

nameInput.value = user.name;
usernameInput.value = user.username;
emailInput.value = user.email;
phoneInput.value = user.phone;
profileInputContainer.insertAdjacentHTML('beforeend', `
    <a target="_blank" href="http://localhost:4000/profile/${user.profile}" style="color: #0c63e4; text-decoration: underline;">عکس پروفایل کنونی</a>
`)

const form = document.querySelector('form')
form.addEventListener('submit', event => {
	event.preventDefault()

	const alertContainer = document.querySelector('.alert-container')
	if (!userNameValidation(usernameInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
			<span class="text-danger" style="padding-right: 1rem;">نام کاربری قابل قبول نیست!</span>
		`)
		return false;
	}
	if (!emailValidation(emailInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
			<span class="text-danger" style="padding-right: 1rem;">ایمیل قابل قبول نیست!</span>
		`)
		return false;
	}
	if (passwordInput.value.trim() && !passwordValidation(passwordInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
			<span class="text-danger" style="padding-right: 1rem;">پسورد قابل قبول نیست!</span>
		`)
		return false;
	}
	if (!phoneNumberValidation(phoneInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
			<span class="text-danger" style="padding-right: 1rem;">شماره تلفن قابل قبول نیست!</span>
		`)
		return false;
	}
	if (profileInput.files.length > 1) {
		alertContainer.insertAdjacentHTML('beforeend', `
			<span class="text-danger" style="padding-right: 1rem;">یک عکس باید برای پروفایل انتخاب شود نه بیشتر!ایمیل قابل قبول نیست</span>
		`)
		return false;
	}


	swal.fire({
		title: 'ویرایش اطلاعات',
		text: "آیا مطمئن هستید میخواهید اطلاعات خود را تغییر کنید؟",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "ویرایش",
	}).then(result => {
		if (result.isConfirmed) {
			const sendingBody = new FormData()
			sendingBody.append('name', nameInput.value.trim())
			sendingBody.append('username', usernameInput.value.trim())
			sendingBody.append('email', emailInput.value.trim())
			sendingBody.append('currentPassword', passwordInput.value.trim())
			sendingBody.append('newPassword', passwordInput.value.trim())
			sendingBody.append('phone', phoneInput.value.trim())
			sendingBody.append('profile', profileInput.files[0])

			fetch(`http://localhost:4000/v1/users/${user._id}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				},
				body: sendingBody
			}).then(res => {
				if (res.status === 200) {
					Swal.fire({
						title: "موفق",
						text: "اطلاعات با موفقیت ویرایش شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					Swal.fire({
						title: "ناموفق",
						text: "خطایی در ویرایش اطلاعات رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	})
})