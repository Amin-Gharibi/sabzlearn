import {getCourses, getToken} from "../../../scripts/utils/utils.js";
import {getMe} from "../../../scripts/funcs/auth.js";

const [allCourses, user] = await Promise.all([getCourses(), getMe()])
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
    		    <td>${course._id}</td>
    		    <td>${course.name}</td>
    		    <td>${course.registers}</td>
    		    <td>${courseSituation}</td>
    		    <td>${(course.price - (course.price * course.discount / 100)) === 0 ? 'رایگان' : (course.price - (course.price * course.discount / 100)).toLocaleString()}</td>
    		    <td>${course.creator.name}</td>
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
const response = await fetch('http://localhost:4000/v1/category')
const categories = await response.json()
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
		cancelButton: true,
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