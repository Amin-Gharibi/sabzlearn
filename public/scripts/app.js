import {
    changeThemeHandler,
    toggleProfileDropDown,
    toggleMobileMenu,
    toggleSubMenusHandler,
    showDetailsInAccountCenter,
    showHeaderMenus,
    getLastEditedCourses,
    getLastCreatedCourses,
    getPublishedArticles, getPreSaleCourses, getPopularCourses
} from './utils/utils.js';
import {getMe} from "./funcs/auth.js";

let $ = document
const userProfileBtn = $.querySelector('#user-profile'),
    themeChangerBtn = $.querySelectorAll('.theme-changer-btn'),
    hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn'),
    mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn'),
    mobileMenuOverlay = $.querySelector('.mobile-menu--overlay'),
    mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items');

const showWantedCourses = (courses, wrapper, isSwiperSlide) => {
    if (!courses.length) {
        return false
    }
    const coursesWrapper = $.querySelector(wrapper)

    const coursesFinalStr = courses.map(course => {
        if (!course.off) {
            return `
                <div class="${isSwiperSlide ? `!flex min-h-[414px] swiper-slide` : `flex`} flex-col overflow-hidden rounded-2xl bg-white dark:bg-darkGray-800">
                    <!--item image-->
                    <div class="w-full h-[168px] rounded-2xl overflow-hidden">
                        <a href="/courses/${course.shortName}" title="آموزش ساخت ربات تلگرام با PHP" class="w-full h-full">
                            <img src="${course.cover}" alt="${course.name}" loading="lazy" class="w-full h-full object-cover">
                        </a>
                    </div>
                    <!--item body-->
                    <div class="flex flex-col px-5 pt-2.5 flex-grow">
                        <!--item tags-->
                        <div class="mb-2.5">
                            <a href="#" class="inline-flex items-center justify-center text-xs text-sky-500 dark:text-yellow-400 bg-sky-500/10 dark:bg-yellow-400/10 py-1 px-1.5 rounded">
                                ${course.categoryID}
                            </a>
                        </div>
                        <!--item title-->
                        <a href="/courses/${course.shortName}" class="inline-flex font-danaMedium text-zinc-700 dark:text-white mb-2.5 max-h-12 line-clamp-2">
                            ${course.name}
                        </a>
                        <!--item description-->
                        <p class="text-sm h-10 text-slate-500 dark:text-slate-400 line-clamp-2">
                            ${course.description}
                        </p>
                    </div>
                    <!--item footer-->
                    <div class="px-5 pb-2">
                        <!--course teacher, time, rate-->
                        <div class="flex justify-between items-center mt-3.5 pb-3 border-b border-b-gray-100 dark:border-b-gray-700">
                            <!--course teacher and time-->
                            <div class="flex items-center gap-x-2.5 flex-wrap text-slate-500 dark:text-slate-400 text-xs">
                                <!--course teacher-->
                                <a href="#" class="flex items-center gap-x-1 hover:text-primary transition-colors">
                                    <svg class="w-4 h-4">
                                        <use href="#user"></use>
                                    </svg>
                                    <span>
                                        ${course.creator}
                                    </span>
                                </a>
                                <!--course time-->
                                <div class="flex items-center gap-x-1">
                                    <svg class="w-4 h-4">
                                        <use href="#clock"></use>
                                    </svg>
                                    <span>
                                        00:00
                                    </span>
                                </div>
                            </div>
                            <!--rate-->
                            <div class="flex items-center gap-x-1 text-amber-400 text-xs">
                                <span class="leading-[1px]">${course.courseAverageScore}</span>
                                <svg class="w-4 h-4">
                                    <use href="#star"></use>
                                </svg>
                            </div>
                        </div>
                        <!--course students and price-->
                        <div class="flex justify-between items-center mt-1.5">
                            <!--course students-->
                            <div class="flex items-center gap-x-1.5 text-zinc-700 dark:text-white">
                                <svg class="w-5 h-5">
                                    <use href="#users"></use>
                                </svg>
                                <span>
                                    ${course.registers}
                                </span>
                            </div>
                            <!--course price-->
                            <div class="flex items-center gap-x-1.5 font-danaMedium text-xl text-primary">
                                <span>${course.price.toLocaleString()}</span>
                                <svg class="w-4 h-4">
                                    <use href="#toman"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>   
            `
        } else {
            return `
                <div class="relative ${isSwiperSlide ? `!flex min-h-[414px] swiper-slide` : `flex`} flex-col overflow-hidden rounded-2xl bg-white dark:bg-darkGray-800">
                    <!--item image-->
                    <div class="w-full h-[168px] rounded-2xl overflow-hidden">
                        <a href="/courses/${course.shortName}" title="${course.name}" class="w-full h-full">
                            <img src="${course.cover}" alt="${course.name}" loading="lazy" class="w-full h-full object-cover">
                        </a>
                    </div>
                    <!--item body-->
                    <div class="px-5 pt-2.5 pb-2 flex-grow">
                        <!--item tags-->
                        <div class="mb-2.5">
                            <a href="#" class="inline-flex items-center justify-center text-xs text-sky-500 dark:text-yellow-400 bg-sky-500/10 dark:bg-yellow-400/10 py-1 px-1.5 rounded">
                                ${course.categoryID}
                            </a>
                        </div>
                        <!--item title-->
                        <a href="#" class="inline-flex font-danaMedium text-zinc-700 dark:text-white mb-2.5 max-h-12 line-clamp-2">
                            ${course.name}
                        </a>
                        <!--item description-->
                        <p class="text-sm h-10 text-slate-500 dark:text-slate-400 line-clamp-2">
                            ${course.description}
                        </p>
                    </div>
                    <!--item footer-->
                    <div class="px-5 pb-2">
                        <!--course teacher, time, rate-->
                        <div class="flex justify-between items-center mt-3.5 pb-3 border-b border-b-gray-100 dark:border-b-gray-700">
                            <!--course teacher and time-->
                            <div class="flex items-center gap-x-2.5 flex-wrap text-slate-500 dark:text-slate-400 text-xs">
                                <!--course teacher-->
                                <a href="#" class="flex items-center gap-x-1 hover:text-primary transition-colors">
                                    <svg class="w-4 h-4">
                                        <use href="#user"></use>
                                    </svg>
                                    <span>
                                        ${course.creator}
                                    </span>
                                </a>
                                <!--course time-->
                                <div class="flex items-center gap-x-1">
                                    <svg class="w-4 h-4">
                                        <use href="#clock"></use>
                                    </svg>
                                    <span>
                                        00:00
                                    </span>
                                </div>
                            </div>
                            <!--rate-->
                            <div class="flex items-center gap-x-1 text-amber-400 text-xs">
                                <span class="leading-[1px]">${course.courseAverageScore}</span>
                                <svg class="w-4 h-4">
                                    <use href="#star"></use>
                                </svg>
                            </div>
                        </div>
                        <!--course students and price-->
                        <div class="flex justify-between items-center mt-1.5">
                            <!--course students-->
                            <div class="flex items-center gap-x-1.5 text-zinc-700 dark:text-white">
                                <svg class="w-5 h-5">
                                    <use href="#users"></use>
                                </svg>
                                <span>
                                    ${course.registers}
                                </span>
                            </div>
                            <!--course price-->
                            <div class="flex flex-col items-start gap-x-1.5 font-danaMedium text-xl text-primary">
                                <span class="course--price__offered">${course.price}</span>
                                <span class="course--price">
                                    ${course.off === 100 ? 'رایگان!' : (course.price - ((course.off * course.price) / 100)).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!--off percentage-->
                    <div class="absolute top-2.5 right-2.5 flex justify-center items-center w-12 h-6 font-danaDemiBold text-sm bg-primary text-white rounded-xl">
                        <span>
                            ${course.off}%
                        </span>
                    </div>
                </div>
            `
        }
    }).join('')

    coursesWrapper.insertAdjacentHTML('beforeend', coursesFinalStr)
}

const showWantedArticles = articles => {
    if (!articles.length) {
        return false
    }

    const articlesWrapper = $.querySelector('.published-articles--wrapper')
    let day, month, year, date, faDate;

    const finalArticlesStr = articles.slice(0, 4).map(article => {

        year = parseInt(article.updatedAt.slice(0, 4))
        month = parseInt(article.updatedAt.slice(5, 7))
        day = parseInt(article.updatedAt.slice(8, 10))
        date = new Date(year, month, day)
        faDate = new Intl.DateTimeFormat('fa-IR').format(date)

        return `
            <div class="flex flex-col overflow-hidden bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none dark:border border-gray-700 rounded-2xl">
                    <!--article image-->
                    <div class="article--image__container">
                        <img src="${article.cover}" alt="${article.title}" class="w-full h-full">
                    </div>
                    <!--article content-->
                    <div class="flex flex-col flex-grow gap-y-8 px-5">
                        <!--upper content-->
                        <div class="pt-1.5">
                            <h4 class="font-danaMedium max-h-12 line-clamp-2 text-zinc-700 dark:text-white mb-2.5">
                                <a href="/articles/${article.shortName}">
                                    ${article.title}
                                </a>
                            </h4>
                            <p class="h-20 font-thin text-sm line-clamp-4 text-slate-500 dark:text-slate-400">
                                ${article.description}
                            </p>
                        </div>
                        <!--lower content-->
                        <div style="margin-top: auto;">
                            <!--author and release date-->
                            <div class="flex items-center flex-wrap gap-2.5 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <!--author-->
                                <a href="#" class="flex items-center gap-x-1 hover:text-primary transition-colors">
                                    <svg class="w-4 h-4">
                                        <use href="#user"></use>
                                    </svg>
                                    <span>
                                        ${article.creator.name}
                                    </span>
                                </a>
                                <!--release date-->
                                <div class="flex items-center gap-x-1">
                                    <svg class="w-4 h-4">
                                        <use href="#calendar"></use>
                                    </svg>
                                    <span>
                                        ${faDate}
                                    </span>
                                </div>
                            </div>
                            <!--link to article page-->
                            <div class="flex justify-center items-center py-3.5">
                                <a href="/articles/${article.shortName}"
                                   class="flex justify-center items-center gap-x-1 font-danaMedium text-zinc-700 dark:text-white group transition-colors">
                                    <span class="leading-6 group-hover:text-primary transition-colors">
                                        مطالعه مقاله
                                    </span>
                                    <svg class="w-6 h-6 group-hover:text-primary transition-colors">
                                        <use href="#arrow-left-circle"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
        `
    }).join('')

    articlesWrapper.insertAdjacentHTML('beforeend', finalArticlesStr)
}

// settings for swiper
window.addEventListener('load',  async () => {
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

    const [data, , latestCourses, newestCourses, articles, preSaleCourses, popularCourses] = await Promise.all([
        getMe(),
        showHeaderMenus(),
        getLastEditedCourses(),
        getLastCreatedCourses(),
        getPublishedArticles(),
        getPreSaleCourses(),
        getPopularCourses()
    ])

    showDetailsInAccountCenter(data)
    showWantedCourses(latestCourses, '.latest-courses--wrapper', false)
    showWantedCourses(newestCourses, '.newest-courses--wrapper', true)
    showWantedArticles(articles)
    showWantedCourses(preSaleCourses, '.pre-sale-courses--wrapper', true)
    showWantedCourses(popularCourses, '.popular-courses--wrapper', false)
})

// add event listeners
mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
mobileMenuListItems.forEach(item => {
    item.addEventListener('click', event => toggleSubMenusHandler(event))
})
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})