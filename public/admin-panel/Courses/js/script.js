import {getCourses, getToken} from "../../../scripts/utils/utils.js";
import {getMe} from "../../../scripts/funcs/auth.js";

const [allCourses, user, response] = await Promise.all([getCourses(), getMe(), await fetch('http://localhost:4000/v1/category')])

const categories = await response.json()

// add each course's detail to the table
const coursesWrapper = document.querySelector('tbody')
allCourses.forEach(course => {
	let courseSituation;
	switch (course.status) {
		case 1:
			courseSituation = 'پیش فروش'
			break
		case 2:
            courseSituation = 'در حال ضبط'
            break
        case 3:
            courseSituation = 'تمام شده'
            break
	}
	if (user.role === "ADMIN" || (course.creator._id === user._id)) {
		coursesWrapper.insertAdjacentHTML('beforeend', `
    		<tr>
    		    <td>${course.name}</td>
    		    <td>${course.shortName}</td>
    		    <td>${course.registers}</td>
    		    <td>${courseSituation}</td>
    		    <td>${(course.price - (course.price * course.discount / 100)) === 0 ? 'رایگان' : (course.price - (course.price * course.discount / 100)).toLocaleString()}</td>
    		    <td>${course.creator.name}</td>
    		    <td>
    		    	<button type="button" class="btn btn-primary edit-btns" data-value="${course._id}">
    		        ویرایش
					</button>
				</td>
    		    <td>
    		        <button type="button" class="btn btn-danger delete-btns" data-value="${course._id}">
    		        حذف
					</button>
    		    </td>
    		</tr>
    	`)
	}
})


// show categories in the form
const courseCategoryInput = document.querySelector('#course-category-input')
categories.forEach(category => {
	courseCategoryInput.insertAdjacentHTML('beforeend', `
		<option value="${category._id}">${category.title}</option>
	`)
})


// add course to db handling
const addCourseForm = document.querySelector('#add-course-form')
addCourseForm.addEventListener('submit', event => {
	event.preventDefault();
	const courseNameInput = document.querySelector('#course-name-input')
	const courseDescriptionInput = document.querySelector('#course-description-input')
	const coursePriceInput = document.querySelector('#course-price-input')
	const courseDiscountInput = document.querySelector('#course-discount-input')
	const courseSessionsInput = document.querySelector('#course-sessions-input')
	const courseShortnameInput = document.querySelector('#course-shortname-input')
	const courseRequirementsInput = document.querySelector('#course-requirements-input')
	const courseSupportInput = document.querySelector('#course-support-input')
	const courseWatchingOptionInput = document.querySelector('#course-watching-option-input')
	const courseStatusInput = document.querySelector('#course-status-input')
	const courseCoverInput = document.querySelector('#course-cover-input')

	let isEverythingValid = true

	const selectedCoverFiles = courseCoverInput.files
	if (selectedCoverFiles.length > 1) {
		const coverInputContainer = document.querySelector('#cover-input-container')
		coverInputContainer.insertAdjacentHTML('beforeend', `
			<span class="alert-failed" style="color: red; font-size: 12px">یک فایل بیشتر نمیتونی اپلود کنی*</span>
		`)
		isEverythingValid = false
	}
	if (courseCategoryInput.value === "0") {
		const container = document.querySelector('#course-category-input-container')
		container.insertAdjacentHTML('beforeend', `
			<span class="alert-failed" style="color: red; font-size: 12px">یک گزینه رو انتخاب کن*</span>
		`)
		isEverythingValid = false
	}
	if (courseStatusInput.value === "0") {
		const container = document.querySelector('#course-status-input-container')
		container.insertAdjacentHTML('beforeend', `-failed
			<span class="alert-failed" style="color: red; font-size: 12px">یک گزینه رو انتخاب کن*</span>
		`)
		isEverythingValid = false
	}

	const englishOnlyRegex = /^[a-zA-Z-]+$/
	if (!englishOnlyRegex.test(courseShortnameInput.value)) {
		isEverythingValid = false
	}

	const sendingBody = new FormData();
	sendingBody.append('name', courseNameInput.value.trim())
	sendingBody.append('description', courseDescriptionInput.value.trim())
	sendingBody.append('cover', selectedCoverFiles[0])
	sendingBody.append('support', courseSupportInput.value.trim())
	sendingBody.append('shortName', courseShortnameInput.value.trim())
	sendingBody.append('price', coursePriceInput.value.trim())
	sendingBody.append('status', Number(courseStatusInput.value.trim()))
	sendingBody.append('discount', courseDiscountInput.value.trim())
	sendingBody.append('categoryID', courseCategoryInput.value.trim())
	sendingBody.append('promisedSessions', Number(courseSessionsInput.value.trim()))
	sendingBody.append('requirement', courseRequirementsInput.value.trim())
	sendingBody.append('watchingOptions', courseWatchingOptionInput.value.trim())
	sendingBody.append('rate', 5)

	if (isEverythingValid) {
		const alerts = document.querySelectorAll('.alert-failed')
		alerts.forEach(alert => {
			alert.delete
		})
		fetch('http://localhost:4000/v1/courses', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${getToken()}`
			},
			body: sendingBody
		}).then(res => {
			if (res.status === 201) {
				swal.fire({
					title: "موفق",
					text: "دوره با موفقیت به لیست دوره ها اضافه شد!",
					icon: "success",
					confirmButtonText: "بستن",
				}).then(() => {
					location.reload()
				})
			} else {
				swal.fire({
					title: "ناموفق",
					text: "عملیات با خطا مواجه شد. لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید!",
					icon: "warning",
					confirmButtonText: "بستن",
				}).then(() => {
					location.reload()
				})
			}
		})
	}
})


// delete course from db handling
const deleteCoursesBtn = document.querySelectorAll('.delete-btns')
deleteCoursesBtn.forEach(btn => {
	btn.addEventListener('click',async () => await removeCourse(btn.getAttribute('data-value')))
})

const removeCourse = courseId => {
	const targetCourse = allCourses.find(course => course._id === courseId)
	swal.fire({
		title: `آیا از حذف دوره ${targetCourse.name} مطمئن هستید؟`,
		text: "اگر دوره را حذف کنید دیگر قادر به بازگرداندن آن نخواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "حذف",
	}).then(willDelete => {
		if (willDelete.isConfirmed) {
			fetch(`http://localhost:4000/v1/courses/${courseId}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${getToken()}`
				}
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: `دوره ${targetCourse.name} با موفقیت حذف شد`,
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: `خطا در حذف دوره ${targetCourse.name}، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
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


const editBtns = document.querySelectorAll('.edit-btns')
editBtns.forEach(btn => {
	btn.addEventListener('click', () => editCourseHandler(btn.getAttribute('data-value')))
})

const editCourseHandler = courseId => {
	const targetCourse = allCourses.find(course => course._id === courseId)

	let courseName = HTMLInputElement
	let coursePrice = HTMLInputElement
	let courseDiscount = HTMLInputElement
	let coursePromisedSessions = HTMLInputElement
	let courseShortName = HTMLInputElement
	let courseRequirement = HTMLInputElement
	let courseSupport = HTMLInputElement
	let courseWatchingOption = HTMLInputElement
	let courseCategory = HTMLInputElement
	let courseStatus = HTMLInputElement
	let courseCover = HTMLInputElement
	let courseDescription = HTMLInputElement

	Swal.fire({
		title: "ویرایش",
		customClass: "swal-wide",
		html: `
			<form class="form d-flex flex-column gap-4">
				<div class="d-flex justify-content-between align-items-center gap-4">
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">نام دوره:</label>
						<input class="w-100" required type="text" id="swal-course-name-input" value="${targetCourse.name}" placeholder="لطفا نام دوره را وارد کنید...">
					</div>
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">قیمت دوره:</label>
						<input class="w-100" required type="text" id="swal-course-price-input" value="${targetCourse.price}" placeholder="لطفا قیمت دوره را وارد کنید...">
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center gap-4">
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">تخفیف دوره:</label>
						<input class="w-100" required type="number" min="0" max="100" id="swal-course-discount-input" value="${targetCourse.discount}" placeholder="لطفا تخفیف دوره را وارد کنید...">						
					</div>
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">تعداد حدودی جلسات:</label>
						<input class="w-100" required type="number" min="0" id="swal-course-sessions-input" value="${targetCourse.promisedSessions}" placeholder="لطفا تعداد حدودی جلسات را وارد کنید...">
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center gap-4">
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">نام کوتاه دوره:</label>
						<input class="w-100" required type="text" id="swal-course-shortname-input" value="${targetCourse.shortName}" placeholder="لطفا نام کوتاه دوره را به انگلیسی وارد کنید...">						
					</div>
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">پیش نیازهای دوره:</label>
						<input class="w-100" required type="text" id="swal-course-requirement-input" value="${targetCourse.requirement}" placeholder="لطفا پیش نیازهای دوره را وارد کنید...">						
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center gap-4">
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">نحوه پشتیبانی:</label>
						<input class="w-100" required type="text" id="swal-course-support-input" value="${targetCourse.support}" placeholder="لطفا نحوه پشتیبانی دوره را وارد کنید...">
					</div>
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">نحوه مشاهده دوره:</label>
						<input class="w-100" required type="text" id="swal-course-watchingoption-input" value="${targetCourse.watchingOptions}" placeholder="لطفا نحوه مشاهده دوره را وارد کنید...">
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center gap-4">
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">دسته بندی:</label>
						<select id="swal-course-category-input" required style="font-size: 14px">
								<option value="0">لطفا دسته بندی دوره را انتخاب کنید...</option>
						</select>
					</div>
					<div class="name input w-50 d-flex gap-2">
						<label class="input-title" style="min-width: max-content !important;">وضعیت:</label>
						<select class="w-100" id="swal-course-status-input" required style="font-size: 14px">
							<option value="0">لطفا وضعیت دوره را انتخاب کنید...</option>
							<option value="1">پیش فروش</option>
							<option value="2">در حال ضبط</option>
							<option value="3">پایان یافته</option>
						</select>
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center gap-2">
					<label class="input-title" style="min-width: max-content !important;">کاور دوره:</label>
					<div class="w-100 d-flex justify-content-around">
						<input required type="file" id="swal-course-cover-input" accept=".jpeg, .jpg, .png, .webp">
						<a target="_blank" href="http://localhost:4000/courses/covers/${targetCourse.cover}" style="color: #0c63e4; text-decoration: underline">کاور کنونی</a>
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-start gap-2">
					<label class="input-title" style="min-width: max-content !important;">توضیحات دوره:</label>
					<textarea class="w-100" id="swal-description-input" rows="10" cols="70" style="padding: 2px;" required>${targetCourse.description}</textarea>
				</div>
            </form>
  		`,
		confirmButtonText: "ثبت",
		focusConfirm: false,
		allowOutsideClick: () => !Swal.isLoading(),
		didOpen: () => {
			const categoriesContainer = document.querySelector('#swal-course-category-input')
			categories.forEach(cat => {
				categoriesContainer.insertAdjacentHTML('beforeend', `
            <option value="${cat._id}">${cat.title}</option>
        `)
			})
			categoriesContainer.value = targetCourse.categoryID._id

			const statusInput = document.querySelector('#swal-course-status-input')
			statusInput.value = targetCourse.status

			const popup = Swal.getPopup()
			courseName = popup.querySelector('#swal-course-name-input')
			coursePrice = popup.querySelector('#swal-course-price-input')
			courseDiscount = popup.querySelector('#swal-course-discount-input')
			coursePromisedSessions = popup.querySelector('#swal-course-sessions-input')
			courseShortName = popup.querySelector('#swal-course-shortname-input')
			courseRequirement = popup.querySelector('#swal-course-requirement-input')
			courseSupport = popup.querySelector('#swal-course-support-input')
			courseWatchingOption = popup.querySelector('#swal-course-watchingoption-input')
			courseCategory = popup.querySelector('#swal-course-category-input')
			courseStatus = popup.querySelector('#swal-course-status-input')
			courseCover = popup.querySelector('#swal-course-cover-input')
			courseDescription = popup.querySelector('#swal-description-input')


			courseName.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			coursePrice.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseDiscount.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			coursePromisedSessions.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseShortName.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseRequirement.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseSupport.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseWatchingOption.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseCategory.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseStatus.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseCover.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			courseDescription.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
		},
		preConfirm: () => {
			if (!courseCategory.value) {
				Swal.showValidationMessage("لطفا دسته بندی دوره را انتخاب کنید")
				return false
			}
			if (!courseStatus.value) {
				Swal.showValidationMessage("لطفا وضعیت دوره را انتخاب کنید")
				return false
			}
			if (courseCover.files.length > 1) {
				Swal.showValidationMessage("بیش از یک کاور برای دوره مجاز نیست")
				return false
			}

			const sendingBody = new FormData()
			sendingBody.append('name', courseName.value.trim())
			sendingBody.append('description', courseDescription.value.trim())
			sendingBody.append('cover', courseCover.files[0])
			sendingBody.append('shortName', courseShortName.value.trim())
			sendingBody.append('price', coursePrice.value.trim())
			sendingBody.append('status', Number(courseStatus.value.trim()))
			sendingBody.append('categoryID', courseCategory.value.trim())
			sendingBody.append('discount', courseDiscount.value.trim())
			sendingBody.append('promisedSessions', coursePromisedSessions.value.trim())
			sendingBody.append('requirement', courseRequirement.value.trim())
			sendingBody.append('support', courseSupport.value.trim())
			sendingBody.append('watchingOptions', courseWatchingOption.value.trim())

			fetch(`http://localhost:4000/v1/courses/${courseId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				},
				body: sendingBody
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "دوره با موفقیت ویرایش شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در اصلاح دوره رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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