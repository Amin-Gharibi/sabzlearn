import {alert, getCourseByShortName, getSearchParam, getToken, getUserCourses} from "./utils/utils.js";

window.addEventListener('load', async () => {
    if (getToken()) { // if user was logged in show the receipt otherwise show error
        const course = await getCourseByShortName(getSearchParam('c'))

        const courseBannerImageElem = document.querySelector('#course-banner')
        courseBannerImageElem.setAttribute('src', `http://localhost:4000/courses/${course.cover}`)

        const courseNameElem = document.querySelector('#course-name')
        courseNameElem.innerHTML = course.name

        const courseRealPriceWrapper = document.querySelector('#course-real-price')
        const coursePayingPriceWrapper = document.querySelector('#course-paying-price')

        const renderCoursePrices = () => {
            courseRealPriceWrapper.innerHTML = course.price.toLocaleString()
            coursePayingPriceWrapper.innerHTML = (course.price - (course.discount * course.price / 100)).toLocaleString()
        }

        renderCoursePrices();

        const cancelShoppingBtn = document.querySelector('#cancel-shopping')
        cancelShoppingBtn.setAttribute('href', `course-page.html?c=${course.shortName}`)

        const showRedeemCodeFormBtn = document.querySelector('#show-redeem-code-form-btn')
        showRedeemCodeFormBtn.addEventListener('click', () => {
            const redeemCodeForm = document.querySelector('.redeem-code-form')
            redeemCodeForm.classList.toggle('hidden')
        })

        const redeemCodeForm = document.querySelector('.redeem-code-form')
        redeemCodeForm.addEventListener('submit', event => {
            event.preventDefault()

            const codeInput = document.querySelector('.redeem-code-form--input')

            fetch(`http://localhost:4000/v1/offs/${codeInput.value}`, { // send request to use the redeem code
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
                        fetch(`http://localhost:4000/v1/offs/${codeInput.value}/cancel`, { // cancel the redeem code
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
                    fetch(`http://localhost:4000/v1/courses/${course._id}/register`, { // add course to user's courses in db
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
    } else {
        document.body.innerHTML = `
            <div class="h-screen flex justify-center items-center text-zinc-700 dark:text-white">
            شما مجاز به ورود به این صفحه نیستید!
            </div>    
    `
    }
})