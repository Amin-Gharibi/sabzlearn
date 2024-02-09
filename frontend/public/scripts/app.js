import {
    createArticlesTemplate,
    createCourseTemplate, getAllCategories,
    getLastCreatedCourses,
    getLastEditedCourses,
    getPopularCourses,
    getPreSaleCourses,
    getPublishedArticles, searchFormSubmissionHandler
} from './utils/utils.js';

window.addEventListener('load', async () => {
    // settings for swiper
    const swiper = new Swiper('.swiper', {
        direction: "horizontal",
        loop: true,
        autoplay: {
            delay: 2000,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 20,
            }
        }
    })
    const [latestCourses, newestCourses, publishedArticles, preSaleCourses, popularCourses, allCategories] = await Promise.all([
        getLastEditedCourses(),
        getLastCreatedCourses(),
        getPublishedArticles(),
        getPreSaleCourses(),
        getPopularCourses(),
        getAllCategories()
    ])

    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    const categories = document.querySelectorAll('.categories')
    const categoryCoursesCount = document.querySelectorAll('.categories--courses-count')

    for (const category of Array.from(categories)) {
        const index = Array.from(categories).indexOf(category);
        const targetCat = allCategories.find(cat => cat.name === category.getAttribute('data-value'))
        categoryCoursesCount[index].innerHTML = targetCat?.coursesCount.toString() || "0"
    }


    const latestCoursesWrapper = document.querySelector('.latest-courses--wrapper')
    latestCoursesWrapper.innerHTML = await createCourseTemplate(latestCourses.slice(0, 12), false)

    const newestCoursesWrapper = document.querySelector('.newest-courses--wrapper')
    newestCoursesWrapper.innerHTML = await createCourseTemplate(newestCourses, true)

    const articlesWrapper = document.querySelector('.published-articles--wrapper')
    articlesWrapper.innerHTML = createArticlesTemplate(publishedArticles.slice(0, 4))

    const presaleCoursesWrapper = document.querySelector('.pre-sale-courses--wrapper')
    presaleCoursesWrapper.innerHTML = await createCourseTemplate(preSaleCourses, true)

    const popularCoursesWrapper = document.querySelector('.popular-courses--wrapper')
    popularCoursesWrapper.innerHTML = await createCourseTemplate(popularCourses.slice(0, 8), false)
})