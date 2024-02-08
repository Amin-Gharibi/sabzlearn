import {
	emailValidation,
	passwordValidation,
	phoneNumberValidation,
	userNameValidation
} from "../../../scripts/funcs/informationValidation.js";
import {getToken} from "../../../scripts/utils/utils.js";

const response = await fetch('http://localhost:4000/v1/users', {
	headers: {
		"Authorization": `Bearer ${getToken()}`
	}
})

const allUsers = await response.json()
const usersDetailsContainer = document.querySelector('tbody')
allUsers.forEach((user, index) => {
	usersDetailsContainer.insertAdjacentHTML('beforeend', `
      <tr>
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.name}</td>
          <td>${user.phone}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
              <button type='button' class='btn ${user.isBanned ? 'btn-primary unban-btn' : 'btn-danger ban-btn'}' data-value="${user._id}">${user.isBanned ? 'آن بن' : 'بن'}</button>
          </td>
          <td>
              <button type='button' class='btn btn-primary edit-btn' data-value="${user._id}">ویرایش</button>
          </td>
          <td>
              <button type='button' class='btn btn-danger delete-btn' data-value="${user._id}">حذف</button>
          </td>
      </tr>
  `)
})


const addUserForm = document.querySelector('form')
addUserForm.addEventListener('submit', event => {
	event.preventDefault()

	const firstNameInput = document.querySelector('#first-name-input')
	const lastNameInput = document.querySelector('#last-name-input')
	const usernameInput = document.querySelector('#username-input')
	const emailInput = document.querySelector('#email-input')
	const passwordInput = document.querySelector('#password-input')
	const confirmPasswordInput = document.querySelector('#confirm-password-input')
	const phoneInput = document.querySelector('#phone-input')
	const profileInput = document.querySelector('#profile-input')

	const alertContainer = document.querySelector('.bottom-form')
	const doesPasswordsMatch = (passwordInput.value.trim() === confirmPasswordInput.value.trim())
	const {isPhoneNumberValid, formattedPhoneNumber} = phoneNumberValidation(phoneInput.value.trim())
	if (!userNameValidation(usernameInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            نام کاربری قابل قبول نیست*
        </span>
    `)
	} else if (!isPhoneNumberValid) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            شماره تلفن وارد شده صحیح نیست*
        </span>
    `)
	} else if (!emailValidation(emailInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            ایمیل وارد شده صحیح نیست*
        </span>
    `)
	} else if (!doesPasswordsMatch) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            پسوردهای وارد شده تطابق ندارند*
        </span>
    `)
	} else if (!passwordValidation(passwordInput.value.trim())) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            پسورد باید حداقل 1 حرف بزرگ 1 کاراکتر خاص و 1 کاراکتر عددی داشته باشد*
        </span>
    `)
	} else if (profileInput.files.length > 1) {
		alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger">
            عکس پروفایل بیش از یک عکس نمیتواند باشد*
        </span>
    `)
	} else {
		const newUserInfos = new FormData();
		newUserInfos.append('name', firstNameInput.value.trim() + ' ' + lastNameInput.value.trim())
		newUserInfos.append('username', usernameInput.value.trim().toLowerCase())
		newUserInfos.append('email', emailInput.value.trim().toLowerCase())
		newUserInfos.append('password', passwordInput.value.trim())
		newUserInfos.append('confirmPassword', confirmPasswordInput.value.trim())
		newUserInfos.append('phone', formattedPhoneNumber)
		newUserInfos.append('profile', profileInput.files[0])

		for (const entry of newUserInfos.entries()) {
			const [key, value] = entry;
			console.log(key, value);
		}


		fetch('http://localhost:4000/v1/auth/register', {
			method: 'POST',
			body: newUserInfos
		})
			.then(response => {
				if (response.status === 201) {
					swal.fire({
						title: "موفق",
						text: "کاربر با موفقیت اضافه شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در ثبت نام کاربر رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
	}
})


const deleteBtns = document.querySelectorAll('.delete-btn')
deleteBtns.forEach(btn => {
	btn.addEventListener('click', () => deleteUserHandler(btn.getAttribute('data-value')))
})

const deleteUserHandler = userId => {
	swal.fire({
		title: `آیا از حذف این کاربر مطمئن هستید؟`,
		text: "اگر کاربر را حذف کنید دیگر قادر به بازگرداندن آن نخواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "حذف",
	}).then(willDelete => {
		if (willDelete.isConfirmed) {
			fetch(`http://localhost:4000/v1/users/${userId}`, {
				method: 'DELETE',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				}
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "کاربر با موفقیت حذف شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در حذف کاربر رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	})
}

const banBtns = document.querySelectorAll('.ban-btn')
banBtns.forEach(btn => {
	btn.addEventListener('click', () => banUserHandler(btn.getAttribute('data-value')))
})

const banUserHandler = userId => {
	swal.fire({
		title: `آیا از بن کردن این کاربر مطمئن هستید؟`,
		text: "اگر کاربر را بن کنید دیگر قادر به آن بن کردن آن نخواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "بن",
	}).then(willBan => {
		if (willBan.isConfirmed) {
			fetch(`http://localhost:4000/v1/users/ban/${userId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				}
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "کاربر با موفقیت بن شد. هر وقت که خواستید میتوانید این کاربر را آن بن کنید",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در بن کردن کاربر رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	})
}


const unbanBtns = document.querySelectorAll('.unban-btn')
unbanBtns.forEach(btn => {
	btn.addEventListener('click', () => userUnbanningHandler(btn.getAttribute('data-value')))
})

const userUnbanningHandler = userId => {
	swal.fire({
		title: `آیا مطمئنید میخواهید این کاربر را آن بن کنید؟`,
		text: "بعدا قادیر به بن کردن کاربر خواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "آن بن",
	}).then(willBan => {
		if (willBan.isConfirmed) {
			fetch(`http://localhost:4000/v1/users/unban/${userId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`,
				}
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "کاربر با موفقیت آن بن شد. هر وقت که خواستید میتوانید این کاربر را بن کنید",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در آن بن کردن کاربر رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	})
}


const editBtns = document.querySelectorAll(".edit-btn");
editBtns.forEach(btn => {
	btn.addEventListener('click', () => userEditHandler(btn.getAttribute('data-value')))
})

const userEditHandler = async userId => {
	const targetUser = allUsers.find(user => user._id === userId)

	let nameInput = HTMLInputElement
	let usernameInput = HTMLInputElement
	let emailInput = HTMLInputElement
	let newPasswordInput = HTMLInputElement
	let phoneInput = HTMLInputElement
	let roleInput = HTMLInputElement
	let profileInput = HTMLInputElement

	const {value: formValues} = await Swal.fire({
		title: "ویرایش",
		customClass: "swal-wide",
		html: `
      <div id="edit-swal-container" class="d-flex flex-column gap-3">
        <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-name-input">نام و نام خانوادگی:</label>
            <input type="text" id="swal-name-input">
        </div>
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-username-input">نام کاربری:</label>
            <input type="text" id="swal-username-input">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-email-input">ایمیل:</label>
            <input type="text" id="swal-email-input" style="width: 280px !important;">
        </div>
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-phone-input">شماره موبایل:</label>
            <input type="text" id="swal-phone-input">
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-newpassword-input">پسورد جدید:</label>
            <input type="text" id="swal-newpassword-input" style="width: 280px !important;" placeholder="اگر میخواهید پسورد را تغییر دهید...">
        </div>
        <div class="d-flex justify-content-start align-items-center gap-2">
            <label for="swal-phone-input">نقش:</label>
            <select id="swal-role-input">
                <option value="0">انتخاب نقش جدید...</option>
                <option value="USER">کاربر</option>
                <option value="TEACHER">مدرس</option>
                <option value="ADMIN">ادمین</option>
            </select>
        </div>
      </div>
      <div class="col-12">
            <div class="name input d-flex gap-2" id="cover-input-container">
                <label class="input-title" style="display: block;">کاور:</label>
                <div>
                    <input type="file" required id="swal-profile-input">
                    <a target="_blank" href="http://localhost:4000/profile/${targetUser.profile}" style="color: #0c63e4; text-decoration: underline;">عکس پروفایل کنونی</a>
                </div>
            </div>
        </div>
    </div>
  `,
		confirmButtonText: "ثبت",
		focusConfirm: false,
		allowOutsideClick: () => !Swal.isLoading(),
		didOpen: () => {
			const popup = Swal.getPopup()
			nameInput = popup.querySelector('#swal-name-input')
			usernameInput = popup.querySelector('#swal-username-input')
			emailInput = popup.querySelector('#swal-email-input')
			newPasswordInput = popup.querySelector('#swal-newpassword-input')
			phoneInput = popup.querySelector('#swal-phone-input')
			roleInput = popup.querySelector('#swal-role-input')
			profileInput = popup.querySelector('#swal-profile-input')

			nameInput.value = targetUser.name
			usernameInput.value = targetUser.username
			emailInput.value = targetUser.email
			phoneInput.value = targetUser.phone

			const roles = {'USER': 1, 'TEACHER': 2, 'ADMIN': 3}
			roleInput.selectedIndex = roles[targetUser.role]


			nameInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			usernameInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			emailInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			newPasswordInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			phoneInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			roleInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
		},
		preConfirm: () => {
			const name = nameInput.value.trim()
			const username = usernameInput.value.trim()
			const email = emailInput.value.trim()
			const newPassword = newPasswordInput.value.trim()
			const phone = phoneInput.value.trim()
			const role = roleInput.value.trim()
			const profile = profileInput.files[0]

			if (role === '0') {
				Swal.showValidationMessage('لطفا یک نقش برای کاربر انتخاب کنید');
				return false
			} else if (profileInput.files.length > 1) {
				Swal.showValidationMessage('نمیتوان بیش از یک عکس پروفایل انتخاب کرد');
				return false
			}

			const sendingBody = new FormData()
			sendingBody.append('name', name)
			sendingBody.append('username', username)
			sendingBody.append('email', email)
			sendingBody.append('newPassword', newPassword)
			sendingBody.append('phone', phone)
			sendingBody.append('role', role)
			sendingBody.append('profile', profile)

			fetch(`http://localhost:4000/v1/users/${userId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				},
				body: sendingBody
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "کاربر با موفقیت ویرایش شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در اصلاح کاربر رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	});

}