import {getArticles, getCourses, getToken} from "../../../scripts/utils/utils.js";
import {getAllMenusForAdmin} from "../../utils.js";

const [allCourses, allMenus, allArticles] = await Promise.all([getCourses(), getAllMenusForAdmin(), getArticles()]);
const coursesContainer = document.querySelector('.menu-all-courses-container')

// show all courses available in the course-list
const allCoursesAndArticles = [...allCourses, ...allArticles]
allCoursesAndArticles.forEach((item, index) => {
	coursesContainer.insertAdjacentHTML('beforeend', `
        <div class="d-flex justify-content-between align-items-center menu-course-container">
            <input type="checkbox" id="course-${index}" data-title="${item.name || item.title}" data-href="${typeof item.publish === 'undefined' ? `course-page.html?c=${item.shortName}` : `article-page.html?article=${item.shortName}`}" class="menu-course-selector-input">
            <label for="course-${index}" class="menu-course-selector-label">${item.name || (item.title + "<span style='color: red;'>(مقاله)</span>")}</label>
        </div>
    `)
})

// show menus in the table
const menusContainer = document.querySelector('tbody')
allMenus.forEach(menu => {
	let href = menu.href.split('/')
	href = href[href.length - 1]

	menusContainer.insertAdjacentHTML('beforeend', `
		<tr>
            <td>${menu.title}</td>
            <td><a href="${href === "articles" ? "search-categories-articles.html" : `search-categories.html?cat=${href}`}">${href}</a></td>
            <td>
            	${menu.subMenus.length > 0 && `
            		<select>
            		${menu.subMenus.map(submenu => {
		return `
							<option>${submenu.title}</option>
						`
	}).join('')}
					</select>
            	` || "-----"}
			</td>
            <td>
                <button type='button' class='btn btn-primary edit-btn' data-value="${menu._id}">ویرایش</button>
            </td>
            <td>
                <button type='button' class='btn btn-danger delete-btn' data-value="${menu._id}">حذف</button>
            </td>
        </tr>
	`)
})


// add menu handling
const newMenuForm = document.querySelector('form')
newMenuForm.addEventListener('submit', async event => {
	event.preventDefault()

	const errorCreatingNewMenu = () => {
		swal.fire({
			title: "ناموفق",
			text: `خطا در اضافه کردن منو به دیتابیس. لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
			icon: "error",
			confirmButtonText: "بستن"
		}).then(() => {
			location.reload()
		})
	}


	const menuTitleInput = document.querySelector('#menu-title-input')
	const menuHrefInput = document.querySelector('#menu-href-input')
	const menu = {
		title: menuTitleInput.value.trim(),
		href: menuHrefInput.value.trim()
	};

	const response = await fetch('http://localhost:4000/v1/menus', {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${getToken()}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(menu)
	})

	if (response.status === 201) {
		const newMenuData = await response.json()
		const newMenuId = newMenuData._id

		let submenusToFetch = []

		const allSubmenusElems = document.querySelectorAll(".menu-course-selector-input:checked")
		for (const subMenuElem of allSubmenusElems) {
			const submenu = {
				title: subMenuElem.getAttribute('data-title'),
				href: subMenuElem.getAttribute('data-href'),
				parent: newMenuId
			}
			submenusToFetch.push(submenu)
		}
		let errorOccurred = false
		submenusToFetch.forEach((submenu, index) => {
			if (!errorOccurred) {
				fetch('http://localhost:4000/v1/menus', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${getToken()}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(submenu)
				}).then(res => {
					if (res.status !== 201) {
						errorOccurred = true
					}
				})

				if (!errorOccurred && (index === (submenusToFetch.length - 1))) {
					swal.fire({
						title: "موفق",
						text: "منو با موفقیت به همراه دوره های زیر مجموعه اش اضافه شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			}
		})

		if (errorOccurred) {
			errorCreatingNewMenu()
		}
	} else {
		errorCreatingNewMenu()
	}
})


// delete menu handling
const menuDeleteBtns = document.querySelectorAll('.delete-btn')
menuDeleteBtns.forEach(btn => {
	btn.addEventListener('click', () => deleteMenuHandler(btn.getAttribute('data-value')))
})

const deleteMenuHandler = async menuId => {
	swal.fire({
		title: `آیا از حذف این منو مطمئن هستید؟`,
		text: "اگر منو را حذف کنید دیگر قادر به بازگرداندن آن نخواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonText: "حذف",
		dangerMode: true,
	}).then(async willDelete => {
		if (willDelete.isConfirmed) {

			const targetMenu = allMenus.find(menu => menu._id === menuId)

			const itemsToBeDeleted = [targetMenu._id]
			targetMenu.subMenus.forEach(item => itemsToBeDeleted.push(item._id))

			let errorOccurred = false
			itemsToBeDeleted.forEach((item, index) => {
				if (!errorOccurred) {
					fetch(`http://localhost:4000/v1/menus/${item}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${getToken()}`
						}
					}).then(res => {
						if (res.status !== 201) {
							errorOccurred = true
						}
					})

					if (!errorOccurred && (index === (itemsToBeDeleted.length - 1))) {
						swal.fire({
							title: "موفق",
							text: "منو با موفقیت به همراه دوره های زیر مجموعه اش حذف شد",
							icon: "success",
							confirmButtonText: "بستن"
						}).then(() => {
							location.reload()
						})
					}
				}
			})

			if (errorOccurred) {
				swal.fire({
					title: "ناموفق",
					text: `خطا در حذف کردن منو از دیتابیس. لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
					icon: "error",
					confirmButtonText: "بستن"
				}).then(() => {
					location.reload()
				})
			}
		}
	})
}


// edit menu handling
const editBtns = document.querySelectorAll('.edit-btn')
editBtns.forEach(btn => {
	btn.addEventListener('click', async () => await editMenuHandler(btn.getAttribute('data-value')))
})

const editMenuHandler = async menuId => {

	// editing algorithm: first, I would get the menu user wants to edit and store
	// Ids of the submenu courses of this menu in the initial courses array, then I
	// will show him a sweetalert with the persian name of the menu and the href of it
	// and also the list of all courses and would check those courses that are currently in the menu
	// and when user clicks on submit button I would get the final courses Ids and
	// would compare them to the initial courses Ids if there was no such id in the initial ids
	// then it has been added to the menu and if one of those ids in the initial courses ids
	// was not in the final courses ids then it has been deleted from the menu, so based on this information
	// I would create two arrays of each of those groups and would fetch them to their specific api

	const targetMenu = allMenus.find(menu => menu._id === menuId)
	let initCourses = []
	targetMenu.subMenus.forEach(menu => {
		initCourses.push(menu._id)
	})

	let titleInput = HTMLInputElement
	let hrefInput = HTMLInputElement
	let finalCourses = []
	const {value: formValues} = await Swal.fire({
		title: "ویرایش",
		customClass: "swal-wide",
		html: `
    <div class="d-flex justify-content-between align-items-center mb-3">
    	<label for="edit-menu-title-input">نام فارسی منو:</label>
    	<input type="text" value="${targetMenu.title}" style="margin: 0; width: 60%" id="edit-menu-title-input" placeholder="لطفا نام فارسی اصلاحی را وارد کنید..." class="swal2-input">
	</div>
    <div class="d-flex justify-content-between align-items-center">
    	<label for="edit-menu-href-input">آدرس دسته بندی مقصد:</label>
    	<input type="text" value="${targetMenu.href}" style="width: 60%; margin: 0" id="edit-menu-href-input" placeholder="لطفا نام انگلیسی اصلاحی را وارد کنید..." class="swal2-input">
	</div>
    <label for="edit-menu-href-input" style="width: 100%; text-align: start">دوره ها:</label>
${
			allCoursesAndArticles.map((item, index) => {
				let isInMenu = false;
				let id;
				targetMenu.subMenus.forEach(menu => {
					if (menu.title === (item.name || item.title)) {
						isInMenu = true
						id = menu._id
					}
				})
				id = id ? id : item._id
				return `
					<div class="d-flex justify-content-between align-items-center menu-course-container">
            			<input type="checkbox" id="swal-course-${index}" data-value="${id}" class="menu-course-selector-input swal-inputs"${isInMenu ? 'checked' : ''}>
            			<label for="swal-course-${index}" class="menu-course-selector-label" style="text-align: start">${item.name || (item.title + "<span style='color: red;'>(مقاله)</span>")}</label>
        			</div>
				`
			}).join('')
		}
  `,
		confirmButtonText: "ثبت",
		focusConfirm: false,
		allowOutsideClick: () => !Swal.isLoading(),
		didOpen: () => {
			const popup = Swal.getPopup()
			titleInput = popup.querySelector('#edit-menu-title-input')
			hrefInput = popup.querySelector('#edit-menu-href-input')
			titleInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			hrefInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
		},
		preConfirm: () => {
			const title = titleInput.value.trim()
			const href = hrefInput.value.trim()
			if (!title || !href) {
				Swal.showValidationMessage(`لطفا نام فارسی و انگلیسی اصلاحی را وارد کنید`)
			} else {
				const swalCheckedInputs = document.querySelectorAll('.swal-inputs:checked')
				for (const input of swalCheckedInputs) {
					finalCourses.push(input.getAttribute('data-value'))
				}
				let menusToCreate = []
				let menusToDelete = []
				finalCourses.forEach(courseId => {
					if (initCourses.findIndex(cId => cId === courseId) === -1) {
						menusToCreate.push(courseId)
					}
				})
				initCourses.forEach(courseId => {
					if (finalCourses.findIndex(cId => cId === courseId) === -1) {
						menusToDelete.push(courseId)
					}
				})
				let errorOccurred = false
				menusToCreate.forEach(id => {
					if (!errorOccurred) {
						const targetItem = allCoursesAndArticles.find(item => item._id === id)
						const sendingBody = {
							title: targetItem.name || targetItem.title,
							href: typeof targetItem.publish === 'undefined' ? `course-page.html?c=${targetItem.shortName}` : `article-page.html?article=${targetItem.shortName}`,
							parent: menuId
						}
						fetch('http://localhost:4000/v1/menus', {
							method: "POST",
							headers: {
								"Authorization": `Bearer ${getToken()}`,
								"Content-Type": "application/json"
							},
							body: JSON.stringify(sendingBody)
						}).then(res => {
							if (res.status !== 201) {
								errorOccurred = true
							}
						})
					}
				})

				if (!errorOccurred) {
					menusToDelete.forEach(id => {
						if (!errorOccurred) {
							fetch(`http://localhost:4000/v1/menus/${id}`, {
								method: "DELETE",
								headers: {
									"Authorization": `Bearer ${getToken()}`
								}
							}).then(res => {
								if (res.status !== 201) {
									errorOccurred = true
								}
							})
						}
					})
				}

				return errorOccurred ? 'succeed' : 'failed'
			}
		}
	});

	if (formValues === "succeed") {
		swal.fire({
			title: "موفق",
			text: "منو با موفقیت ویرایش شد",
			icon: "success",
			confirmButtonText: "بستن"
		}).then(() => {
			location.reload()
		})
	} else if (formValues === "failed") {
		swal.fire({
			title: "ناموفق",
			text: "خطایی در اصلاح منو رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
			icon: "error",
			confirmButtonText: "بستن"
		}).then(() => {
			location.reload()
		})
	}
}