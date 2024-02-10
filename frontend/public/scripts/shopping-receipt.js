import {alert, getCourseByShortName, getSearchParam, getToken} from "./utils/utils.js";

document.addEventListener('DOMContentLoaded', async () => {
	await fetchData();
})

const fetchData = async () => {
	try {
		if (!getToken()) { // if user was logged in show the receipt otherwise show error
			document.body.innerHTML = `
            <div class="h-screen flex justify-center items-center text-zinc-700 dark:text-white">
            شما مجاز به ورود به این صفحه نیستید!
            </div>    
        `
			return false;
		}

		const course = await getCourseByShortName(getSearchParam('c'))

		renderPage(course)
	} catch (error) {
		console.log("Error Handling: ", error)
	}
}

const renderPage = course => {
	const container = document.querySelector('#content')
	container.innerHTML = `
		<div class="relative min-h-screen flex items-center justify-center overflow-x-hidden">
    <div class="flex flex-col items-center justify-center my-8 overflow-hidden">
        <!-- SabzLearn Logo -->
        <a href="index.html" class="flex justify-center items-center gap-x-2.5 mb-24 sm:mb-28">
            <img src="./images/logos/mainLogo.webp" class="w-[104px]"
                 alt="سبز لرن">
            <svg class="w-[143px] h-[67px]">
                <use href="#logo-type"></use>
            </svg>
        </a>
        <!--  Wrapper  -->
        <div class="w-full xs:w-[400px] px-5">
            <div class="flex flex-col px-[18px] sm:px-7 pb-6 bg-white dark:bg-darkGray-800 rounded-2xl">
                <img id="course-banner" src="https://amingharibi-sabzlearn.liara.run/courses/${course.cover}"
                     class="w-full block -mt-[70px] rounded-2xl" alt="آموزش PWA بصورت پروژه محور">
                <h2 id="course-name" class="mt-5 mb-5 font-danaMedium text-lg sm:text-xl text-zinc-700 dark:text-white line-clamp-2">
					${course.name}
                </h2>
                <!-- discount code -->
                <div class="py-5 border-y border-gray-100 dark:border-darkGray-700">
                    <div class="have-redeem-code-title font-danaMedium md:text-lg text-sky-500 dark:text-secondary">
                        <span>کد تخفیف دارید؟</span>
                        <span class="underline cursor-pointer" id="show-redeem-code-form-btn">کلیک کنید</span>
                    </div>
                    <div class="redeem-code-form hidden">
                        <div class="flex justify-between redeem-code-form--alert-container">
                            <span class="inline-block mb-2 md:text-lg font-danaMedium text-zinc-700 dark:text-white">کد تخفیف</span>
                        </div>
                        <form class="redeem-code-form relative w-full h-12 sm:h-[3.5rem] px-3 sm:px-5 bg-gray-100 dark:bg-darkGray-700 border border-transparent text-sm tracking-tight rounded-xl transition-all">
                            <input type="text" class="redeem-code-form--input w-[calc(100%-75px)] h-full bg-transparent text-base dark:text-white md:text-lg outline-0" placeholder="کد تخفیف را وارد کنید" required>
                            <button type="submit" class="w-max h-9 absolute left-3.5 top-0 bottom-0 my-auto px-3 bg-secondary-light dark:bg-secondary dark:hover:bg-blue-600 text-sm text-white rounded-xl transition-colors">اعمال
                            </button>
                        </form>
                    </div>
                    <!-- Offer Code Success -->
                    <div class="offer-code-success hidden items-center gap-x-1.5 text-primary">

                    </div>
                </div>
                <!-- real price -->
                <div class="space-y-3 md:space-y-3.5 mt-5">
                    <div class="flex items-center justify-between md:text-lg">
                        <span class=" font-danaMedium text-zinc-700 dark:text-white">قیمت اصلی</span>
                        <div id="course-real-price" class="flex items-center gap-x-2 font-danaMedium text-slate-500 dark:text-darkGray-500">

                            <svg class="w-4 h-4">
                                <use href="#toman"></use>
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- left and right circles -->
                <div class="relative flex items-center justify-center overflow-hidden my-1 -mx-7 px-[30px] h-12 text-slate-500">
                    <div class="absolute -right-6 bg-gray-100 dark:bg-darkGray w-12 h-12 rounded-full"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="336" height="1" viewBox="0 0 336 1"
                         stroke="currentColor">
                        <line x2="336" transform="translate(0 0.5)" fill="none" stroke-width="1"
                              stroke-dasharray="6"></line>
                    </svg>
                    <div class="absolute -left-6 bg-gray-100 dark:bg-darkGray w-12 h-12 rounded-full"></div>
                </div>
                <!-- paying price -->
                <div class="flex items-center justify-between">
                    <span class="font-danaMedium text-lg text-zinc-700 dark:text-white">مبلغ قابل پرداخت</span>
                    <div id="course-paying-price" class="flex items-center gap-x-2 font-danaMedium text-xl md:text-2xl text-primary">

                        <svg class="w-4 h-4">
                            <use href="#toman"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <form id="shop-course-form">
                <button type="submit" class="w-full h-[3.5rem] sm:h-[62px] px-7 sm:px-5 mt-[18px] sm:mt-5 bg-primary hover:bg-green-500 sm:font-danaDemiBold text-xl sm:text-2xl text-white rounded-xl transition-colors">تکمیل خرید
                </button>
            </form>
            <a id="cancel-shopping" href="course-page.html?c=${course.shortName}" class="flex justify-center items-center gap-x-1 mt-5 text-sm text-slate-500">
                انصراف از خرید و بازگشت
                <svg class="w-4 h-4">
                    <use href="#chevron-left"></use>
                </svg>
            </a>
        </div>
    </div>

    <!-- back blur circles -->
    <div class="dark:hidden hidden md:block w-[480px] h-[480px] lg:w-[630px] lg:h-[630px] bg-primary opacity-20 blur-2xl rounded-full -z-10 absolute top-4 -left-[320px] lg:-left-[400px]"></div>
    <div class="dark:hidden hidden md:block w-[480px] h-[480px] lg:w-[630px] lg:h-[630px] bg-sky-500 opacity-20 blur-2xl rounded-full -z-10 absolute -right-[320px] lg:-right-[400px] bottom-4"></div>
</div>
	`

	const courseRealPriceWrapper = document.querySelector('#course-real-price')
	const coursePayingPriceWrapper = document.querySelector('#course-paying-price')

	const renderCoursePrices = () => {
		courseRealPriceWrapper.innerHTML = course.price.toLocaleString()
		coursePayingPriceWrapper.innerHTML = (course.price - (course.discount * course.price / 100)).toLocaleString()
	}

	renderCoursePrices();

	const showRedeemCodeFormBtn = document.querySelector('#show-redeem-code-form-btn')
	showRedeemCodeFormBtn.addEventListener('click', () => {
		const redeemCodeForm = document.querySelector('.redeem-code-form')
		redeemCodeForm.classList.toggle('hidden')
	})

	const redeemCodeForm = document.querySelector('.redeem-code-form')
	redeemCodeForm.addEventListener('submit', event => {
		event.preventDefault()

		const codeInput = document.querySelector('.redeem-code-form--input')

		fetch(`https://amingharibi-sabzlearn.liara.run/v1/offs/${codeInput.value}`, { // send request to use the redeem code
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${getToken()}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				course: course._id
			})
		}).then(async res => {
			const alertContainer = document.querySelector('.redeem-code-form--alert-container')
			const alerts = document.querySelectorAll('.alert-redeem-code')
			alerts.forEach(alert => {
				alert.remove();
			})
			if (res.ok) {
				const code = await res.json()
				const oldDiscount = course.discount; // in case if discount code was canceled
				course.discount = course.discount ? (course.discount + code.percent >= 100 ? 100 : (course.discount + code.percent)) : code.percent;

				// show and hide the click konid title
				const haveRedeemCodeTitle = document.querySelector('.have-redeem-code-title')
				haveRedeemCodeTitle.classList.toggle('hidden')
				redeemCodeForm.classList.toggle('hidden')

				// show alert that shows that the redeem code has been set
				const successAlertContainer = document.querySelector('.offer-code-success')
				successAlertContainer.classList.replace('hidden', 'flex')
				successAlertContainer.innerHTML = `
                        <svg class="w-5 h-5 md:w-6 md:h-6">
                            <use href="#check-circle"></use>
                        </svg>
                        <span>کد تخفیف ${code.code} اعمال شد، 
                            <span class="delete-redeem-code underline cursor-pointer text-rose-500">حذف؟</span>
                        </span>
                    `
				codeInput.disabled = true;

				// rerender the price because the redeem code has been set
				renderCoursePrices();


				const deleteRedeemCodeBtn = document.querySelector('.delete-redeem-code')
				deleteRedeemCodeBtn.addEventListener('click', () => {
					fetch(`https://amingharibi-sabzlearn.liara.run/v1/offs/${codeInput.value}/cancel`, { // cancel the redeem code
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${getToken()}`,
							'Content-Type': "application/json"
						},
						body: JSON.stringify({
							course: course._id
						})
					}).then(res => {
						if (res.ok) {
							// if the redeem code was successfully canceled then show the form again and rerender the price
							course.discount = oldDiscount;
							successAlertContainer.classList.replace('flex', 'hidden')
							haveRedeemCodeTitle.classList.toggle('hidden')
							redeemCodeForm.classList.toggle('hidden')
							codeInput.disabled = false;
							renderCoursePrices();
						} else if (res.status === 404) {
							alert(document.body, 'close-circle', "alert-red", "خطا", "کد مورد نظر یافت نشد")
						} else {
							alert(document.body, 'close-circle', "alert-red", "خطا", "خطایی در لغو استفاده از کد تخفیف رخ داد")
						}
					})
				})
			} else if (res.status === 404) {
				alertContainer.insertAdjacentHTML('beforeend', `
                        <span class="font-danaMedium text-rose-500 alert-redeem-code">یافت نشد</span>
                    `)
			} else if (res.status === 409) {
				alertContainer.insertAdjacentHTML('beforeend', `
                        <span class="font-danaMedium text-rose-500 alert-redeem-code">قبلا استفاده شده</span>
                    `)
			}
		})
	})

	const shoppingCourseForm = document.querySelector('#shop-course-form')
	shoppingCourseForm.addEventListener('submit', async event => {
		event.preventDefault()
		try {
			const requestBody = {
				price: course.price - (course.discount * course.price / 100)
			}
			let previousPageUrl = ''
			if (document.referrer) { // save previous page's url
				previousPageUrl = document.referrer
			}
			if (!previousPageUrl) { // if there was no previous url, it's suspicious
				throw 1
			} else {
				fetch(`https://amingharibi-sabzlearn.liara.run/v1/courses/${course._id}/register`, { // add course to user's courses in db
					method: "POST",
					headers: {
						"Authorization": `Bearer ${getToken()}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestBody)
				}).then(response => {
					if (response.status === 409) { // if user had already bought the course show an error
						alert(document.body, 'close-circle', 'alert-red', 'خطا', 'شما از قبل در این دوره ثبت نام کرده اید!')
					} else if (response.status === 201) {
						alert(document.body, 'check-circle', 'primary', 'موفق', 'خرید با موفقیت انجام شد.')
					} else { // if there was unexpected error throw "error" and handle it in catch scope
						throw "error"
					}
					setTimeout(() => {
						location.href = previousPageUrl
					}, 2000)
				})
			}
		} catch (error) {
			switch (error) {
				case 1:
					alert(document.body, 'close-circle', 'alert-red', 'خطا', 'زرنگ بازی در نیار کسگم :)')
					break
				default:
					alert(document.body, 'close-circle', 'alert-red', 'خطا', 'خرید ناموفق بود لطفا با پشتیبانی تماس بگیرید!')
					break
			}
		}
	})
}