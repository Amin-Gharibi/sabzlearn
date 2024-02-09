import {getAllCategories, getToken, intlDateToPersianDate} from "../../../scripts/utils/utils.js";

const [allCategories, response] = await Promise.all([getAllCategories(), fetch('http://localhost:4000/v1/articles')])

let articleBodyInput = null;
ClassicEditor
	.create(document.querySelector('#article-body-input'), {
		language: {
			// The UI will be English.
			ui: 'en',

			// But the content will be edited in Arabic.
			content: 'fa'
		}
	}).then(editor => {
	articleBodyInput = editor
})
	.catch(error => {
		console.log(error)
	});

const allArticles = await response.json()
const articlesContainer = document.querySelector('tbody')
allArticles.forEach(article => {
	const createDate = intlDateToPersianDate(article.createdAt)
	const editDate = intlDateToPersianDate(article.updatedAt)
	const category = allCategories.find(cat => cat._id === article.categoryID)
	articlesContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${article.title}</td>
        <td>${createDate}</td>
        <td>${editDate}</td>
        <td>${article.creator.name}</td>
        <td>${category.title}</td>
        <td>
            <button type="button" data-value="${article._id}" class="btn${article.publish ? ' btn-danger' : ' btn-primary'} publish-unpublish-btn">${article.publish ? 'لغو انتشار' : 'انتشار'}</button>
        </td>
        <td>
            <button type="button" data-value="${article._id}" class="btn btn-primary edit-btn">ویرایش</button>
        </td>
        <td>
            <button type="button" data-value="${article._id}" class="btn btn-danger delete-btn">حذف</button>
        </td>
    </tr>
  `)
})

const categoriesContainer = document.querySelector('#article-category-input')
allCategories.forEach(cat => {
	categoriesContainer.insertAdjacentHTML('beforeend', `
    <option value="${cat._id}">${cat.title}</option>
  `)
})

const publishUnPublishBtns = document.querySelectorAll('.publish-unpublish-btn')
publishUnPublishBtns.forEach(btn => {
	btn.addEventListener('click', () => changePublishStatusHandler(btn.getAttribute('data-value')))
})

const changePublishStatusHandler = articleId => {
	const targetArticle = allArticles.find(article => article._id === articleId)

	Swal.fire({
		title: "آیا مطمئنید؟",
		text: "دوباره قادر به تغییر وضعیت مقاله خواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "بله"
	}).then((result) => {
		if (result.isConfirmed) {
			fetch(`http://localhost:4000/v1/articles/${articleId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`,
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					publish: +!targetArticle.publish
				})
			}).then(res => {
				if (res.status === 200) {
					Swal.fire({
						title: "موفق",
						text: "وضعیت مقاله با موفقیت تغییر کرد",
						icon: "success",
						cancelButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					Swal.fire({
						title: "ناموفق",
						text: "خطایی در تغییر وضعیت مقاله رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "failed",
						cancelButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	});
}


const deleteBtns = document.querySelectorAll('.delete-btn')
deleteBtns.forEach(btn => {
	btn.addEventListener('click', () => deleteArticleHandler(btn.getAttribute('data-value')))
})

const deleteArticleHandler = articleId => {
	Swal.fire({
		title: "آیا از حذف مقاله مطمئنید؟",
		text: "پس از حذف قادر به بازگرداندن آن نخواهید بود",
		icon: "warning",
		showCancelButton: true,
		cancelButtonText: "لغو",
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "بله"
	}).then((result) => {
		if (result.isConfirmed) {
			fetch(`http://localhost:4000/v1/articles/${articleId}`, {
				method: 'DELETE',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				}
			}).then(res => {
				console.log(res)
				if (res.status === 200) {
					Swal.fire({
						title: "موفق",
						text: "مقاله با موفقیت حذف شد",
						icon: "success",
						cancelButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					Swal.fire({
						title: "ناموفق",
						text: "خطایی در حذف مقاله رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "failed",
						cancelButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	});
}

const addArticleForm = document.querySelector('form')
addArticleForm.addEventListener('submit', event => {
	event.preventDefault()

	const articleTitleInput = document.querySelector('#article-title-input')
	const articleShortnameInput = document.querySelector('#article-shortname-input')
	const articleDescriptionInput = document.querySelector('#article-description-input')
	const articleCoverInput = document.querySelector('#article-cover-input')
	const articleCategoryInput = document.querySelector('#article-category-input')

	const selectedCoverFiles = articleCoverInput.files
	if (selectedCoverFiles.length > 1) {
		const coverInputContainer = document.querySelector('#cover-input-container')
		coverInputContainer.insertAdjacentHTML('beforeend', `
			<span class="alert-failed" style="color: red; font-size: 12px">یک فایل بیشتر نمیتونی اپلود کنی*</span>
		`)
		return false;
	}
	if (articleCategoryInput.value === "0") {
		const container = document.querySelector('#category-input-container')
		container.insertAdjacentHTML('beforeend', `
			<span class="alert-failed" style="color: red; font-size: 12px">یک گزینه رو انتخاب کن*</span>
		`)
		return false;
	}


	const sendingBody = new FormData();
	sendingBody.append('title', articleTitleInput.value.trim())
	sendingBody.append('shortName', articleShortnameInput.value.trim())
	sendingBody.append('description', articleDescriptionInput.value.trim())
	sendingBody.append('body', articleBodyInput.getData())
	sendingBody.append('cover', selectedCoverFiles[0])
	sendingBody.append('categoryID', articleCategoryInput.value.trim())


	fetch('http://localhost:4000/v1/articles/draft', {
		method: 'POST',
		headers: {
			"Authorization": `Bearer ${getToken()}`
		},
		body: sendingBody
	}).then(res => {
		console.log(res)
		if (res.status === 201) {
			swal.fire({
				title: "موفق",
				text: "مقاله با موفقیت به لیست مقالات پیش نویس اضافه شد!",
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
		return res.json()
	}).then(data => {
		console.log(data)
	})
})


const editBtns = document.querySelectorAll('.edit-btn')
editBtns.forEach(btn => {
	btn.addEventListener('click', () => editArticleHandler(btn.getAttribute('data-value')))
})

const editArticleHandler = articleId => {
	const targetArticle = allArticles.find(article => article._id === articleId)

	let titleInput = HTMLInputElement;
	let shortNameInput = HTMLInputElement;
	let descriptionInput = HTMLInputElement;
	let coverInput = HTMLInputElement;
	let categoryInput = HTMLInputElement;
	let swalBodyInput = null;

	Swal.fire({
		title: "ویرایش",
		customClass: "swal-wide",
		html: `
    <form class="form d-flex flex-column gap-3">
        <div class="name input w-100 d-flex align-items-center gap-2">
                <label class="input-title" style="min-width: max-content !important;">عنوان:</label>
                <input class="w-100" type="text" id="swal-article-title-input" required value="${targetArticle.title}">
        </div>
        <div class="name input w-100 d-flex align-items-center gap-2">
                <label class="input-title" style="min-width: max-content !important;">لینک:</label>
                <input class="w-100" type="text" id="swal-article-shortname-input" required value="${targetArticle.shortName}">
        </div>
        <div class="col-12">
            <div class="name input w-100 d-flex align-items-start gap-2">
                <label class="input-title" style="min-width: max-content !important;">توضیح کوتاه:</label>
                <textarea style="width: 100%;height: 100px;" id="swal-article-description-input" required>${targetArticle.description}</textarea>
            </div>
        </div>
        <div class="col-12">
            <div class="name input w-100 d-flex align-items-start gap-2 swal-editor">
                <label class="input-title" style="min-width: max-content !important;">مقاله:</label>
                <div id="swal-article-body-input"></div>
            </div>
        </div>
        <div class="col-12">
            <div class="name input d-flex gap-2" id="cover-input-container">
                <label class="input-title" style="display: block;">کاور:</label>
                <div>
                    <input type="file" required id="swal-article-cover-input" accept=".jpeg, .jpg, .png, .webp">
                    <a target="_blank" href="http://localhost:4000/articles/${targetArticle.cover}" style="color: #0c63e4; text-decoration: underline;">کاور کنونی مقاله</a>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="name input d-flex align-items-center gap-2" id="category-input-container">
                <label class="input-title" style="min-width: max-content !important;">دسته بندی:</label>
                <select class="w-100" id="swal-article-category-input" required style="height: 40px!important;">
                    <option value="0">لطفا دسته بندی دوره را انتخاب کنید...</option>
                </select>
            </div>
        </div>
    </form>
  `,
		confirmButtonText: "ثبت",
		focusConfirm: false,
		allowOutsideClick: () => !Swal.isLoading(),
		didOpen: () => {
			ClassicEditor
				.create(document.querySelector('#swal-article-body-input'), {
					language: {
						// The UI will be English.
						ui: 'en',

						// But the content will be edited in Arabic.
						content: 'fa'
					}
				}).then(editor => {
				swalBodyInput = editor
				editor.setData(targetArticle.body) // set default value in the input
			})
				.catch(error => {
					console.log(error)
				});

			const categoriesContainer = document.querySelector('#swal-article-category-input')
			allCategories.forEach(cat => {
				categoriesContainer.insertAdjacentHTML('beforeend', `
            <option value="${cat._id}">${cat.title}</option>
        `)
			})
			categoriesContainer.value = targetArticle.categoryID

			const popup = Swal.getPopup()
			titleInput = popup.querySelector('#swal-article-title-input')
			shortNameInput = popup.querySelector('#swal-article-shortname-input')
			descriptionInput = popup.querySelector('#swal-article-description-input')
			coverInput = popup.querySelector('#swal-article-cover-input')
			categoryInput = popup.querySelector('#swal-article-category-input')

			titleInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			shortNameInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			descriptionInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			articleBodyInput.editing.view.document.on('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			coverInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
			categoryInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
		},
		preConfirm: () => {
			const title = titleInput
			const description = descriptionInput
			const shortName = shortNameInput
			const category = categoryInput
			const coverInp = coverInput
			const selectedCover = coverInp.files

			if (!categoryInput.value) {
				Swal.showValidationMessage('لطفا یک دسته بندی برای مقاله انتخاب کنید');
				return false;
			}
			if (selectedCover.length > 1) {
				Swal.showValidationMessage('بیش از یک کاور نمیتوانید انتخاب کنید');
				return false;
			}

			const sendingBody = new FormData();
			sendingBody.append('title', title.value.trim())
			sendingBody.append('description', description.value.trim())
			sendingBody.append('body', swalBodyInput.getData())
			sendingBody.append('cover', selectedCover[0])
			sendingBody.append('shortName', shortName.value.trim())
			sendingBody.append('categoryID', category.value.trim())

			fetch(`http://localhost:4000/v1/articles/${articleId}`, {
				method: 'PUT',
				headers: {
					"Authorization": `Bearer ${getToken()}`
				},
				body: sendingBody
			}).then(res => {
				if (res.status === 200) {
					swal.fire({
						title: "موفق",
						text: "مقاله با موفقیت ویرایش شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					swal.fire({
						title: "ناموفق",
						text: "خطایی در اصلاح مقاله رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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