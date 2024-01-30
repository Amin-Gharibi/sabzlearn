import {alert, getCourseByShortName, getSearchParam, getToken, getUserCourses} from "./utils/utils.js";

window.addEventListener('load', async () => {
    if (getToken()) { // if user was logged in show the receipt otherwise show error
        const course = await getCourseByShortName(getSearchParam('c'))

        const courseBannerImageElem = document.querySelector('#course-banner')
        courseBannerImageElem.setAttribute('src', `http://localhost:4000/courses/covers/${course.cover}`)

        const courseNameElem = document.querySelector('#course-name')
        courseNameElem.innerHTML = course.name

        const courseRealPriceWrapper = document.querySelector('#course-real-price')
        courseRealPriceWrapper.insertAdjacentHTML('afterbegin', course.price.toLocaleString())

        const coursePayingPriceWrapper = document.querySelector('#course-paying-price')
        coursePayingPriceWrapper.insertAdjacentHTML('afterbegin', (course.price - (course.off * course.price / 100)).toLocaleString())

        const cancelShoppingBtn = document.querySelector('#cancel-shopping')
        cancelShoppingBtn.setAttribute('href', `course-page.html?c=${course.shortName}`)

        const shoppingCourseForm = document.querySelector('#shop-course-form')
        shoppingCourseForm.addEventListener('submit', async event => {
            event.preventDefault()
            try {
                const requestBody = {
                    price: course.price - (course.off * course.price / 100)
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