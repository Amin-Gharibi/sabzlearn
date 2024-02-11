import {
    copyShortLinks,
    searchFormSubmissionHandler,
    getCourseByShortName,
    getSearchParam,
    intlDateToPersianDate,
    calcCourseProgress,
    timeToHour,
    getToken,
    alert,
    getCourseComments, toggleSeasonHandler
} from './utils/utils.js';
import {getMe} from "./funcs/auth.js";
import {renderShared, sharedFetches} from "./shared/shared.js";
import {footerFetches, renderFooter} from "./shared/footer.js";

let $ = document

// -------------------- Functions

document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
})

const fetchData = async () => {
    try {
        const [data, course, {headerMenus}, popularCourses] = await Promise.all([
            getMe(),
            getCourseByShortName(getSearchParam('c')),
            sharedFetches(),
            footerFetches(),
        ])
        const courseComments = (await getCourseComments(course.name)).filter(comment => comment.isAccepted)

        renderPage(data, course, headerMenus, popularCourses, courseComments)
    } catch (error) {
        console.log(error)
    }
}

const renderPage = (data, course, headerMenus, popularCourses, courseComments) => {
    const container = document.querySelector('#content')
    container.innerHTML = `
        <header class="max-w-[1920px] h-[88px] md:h-32 flex justify-between items-center bg-white dark:bg-darkGray px-9 md:px-16 lg:px-4 2xl:px-12 dark:border-b border-b-darkGray-700">
    <!--hamburger menu for mobile size-->
    <div id="hamburger-menu-btn" class="flex lg:hidden justify-center items-center">
        <svg class="w-9 h-9 text-black dark:text-darkGray-500">
            <use href="#bars-3"></use>
        </svg>
    </div>
    <!--menu for mobile size-->
    <div id="mobile-menu"
         class="lg:hidden bg-white dark:bg-darkGray-700 w-64 h-screen overflow-y-auto fixed top-0 bottom-0 z-50 px-7 pb-16 transition-all -right-64">
        <!--logo and close btn-->
        <div class="flex items-center justify-between pb-5 mt-5 relative border-b border-b-gray-200 dark:border-b-darkSlate">
            <!--logo-->
            <div class="flex items-center gap-x-2">
                <a href="index.html">
                    <img src="./images/logos/mainLogo.webp" class="w-[62px] inline" alt="سبز لرن">
                    <svg class="w-[81px] h-[37px] dark:text-white inline">
                        <use href="#logo-type"></use>
                    </svg>
                </a>
            </div>
            <!--close btn-->
            <div id="mobile-menu--close-btn" class="flex items-center justify-center w-9 h-9">
                <svg class="w-7 h-7 text-slate-500">
                    <use href="#x-mark"></use>
                </svg>
            </div>
        </div>
        <!--search form-->
        <form class="search-form block mt-7" method="get">
            <label class="relative w-full h-12 block transition-all">
                <input class="rounded-xl bg-gray-100 dark:bg-darkGray-800 dark:focus:text-white text-slate-500 placeholder:text-slate-500 dark:text-gray-500 dark:placeholder-gray-500 w-full h-full dark:border dark:border-gray-700 dark:focus:border-gray-600 text-base pl-12 pr-5 outline-0 block transition-all"
                       name="search" type="text" placeholder="جستجو">
                <button class="absolute left-4 top-0 bottom-0 w-6 h-6 my-auto text-slate-500 dark:text-gray-500"
                        type="submit" role="button">
                    <svg class="w-6 h-6">
                        <use href="#magnifying-glass"></use>
                    </svg>
                </button>
            </label>
        </form>
        <!--menus-->
        <div class="mt-5">
            <ul class="mobile-navigation-links--wrapper flex flex-col w-full gap-[18px] text-slate-500 dark:text-slate-400">
            </ul>
        </div>
        <!-- Theme Toggle Btn -->
        <div class="theme-changer-btn mt-5 border-t border-t-gray-200 dark:border-t-darkSlate">
            <div class="hidden dark:inline-flex items-center gap-x-2.5 mt-3 select-none text-slate-500 dark:text-slate-400">
                <div class="w-[38px] h-[38px] flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 bg-gray-100 dark:bg-transparent dark:border dark:border-darkSlate">
                    <svg class="w-6 h-6">
                        <use href="#sun"></use>
                    </svg>
                </div>
                تم روشن
            </div>
            <div class="dark:hidden inline-flex items-center gap-x-2.5 mt-3 select-none text-slate-500 dark:text-gray-500">
                <div class="w-[38px] h-[38px] flex items-center justify-center rounded-xl text-slate-500 dark:text-gray-500 bg-gray-100 dark:bg-transparent dark:border dark:border-darkSlate">
                    <svg class="w-5 h-5">
                        <use href="#moon"></use>
                    </svg>
                </div>
                تم تیره
            </div>
        </div>
    </div>
    <!--middle section-->
    <div class="flex justify-center items-center h-14">
        <!--sabzlearn logo-->
        <a href="index.html" class="block lg:pl-5 lg:ml-5 lg:border-l border-l-gray-100 dark:border-l-gray-700" title="سبزلرن">
            <img src="./images/logos/mainLogo.webp" alt="logo" class="w-20 md:w-[104px]" loading="lazy">
        </a>

        <!--navigation links-->
        <ul class="navigation-links--wrapper hidden lg:flex justify-start items-center gap-x-5 text-base xl:text-lg dark:text-white">
        </ul>
    </div>
    <!--left section-->
    <div class="h-14 flex justify-end items-center gap-x-5">
        <!--search btn for small size-->
        <div class="hidden lg:flex xl:hidden justify-center items-center w-14 h-14 text-slate-500 dark:text-darkGray-600 bg-gray-100 dark:bg-transparent dark:border border-darkGray-700 hover:border-darkGray-600 rounded-full cursor-pointer transition-colors">
            <svg class="w-6 h-6">
                <use href="#magnifying-glass"></use>
            </svg>
        </div>
        <!--search box for large sizes-->
        <div class="h-14 hidden xl:flex justify-center items-center bg-gray-100 dark:bg-transparent text-slate-500 dark:text-darkGray-600 rounded-full">
            <form class="search-form relative h-full m-0">
                <input type="text" placeholder="جستجو"
                       class="w-48 focus:w-64 h-full pl-14 pr-5 text-slate-500 dark:text-darkGray-600 focus:text-zinc-700 dark:focus:text-white placeholder-slate-500 dark:placeholder-darkGray-600 rounded-full border border-transparent hover:border-gray-200 dark:border-darkGray-700 dark:hover:border-darkGray-700 focus:border-gray-300 focus:hover:border-gray-200 outline-0 bg-transparent transition-all">
                <button type="submit" class="w-7 h-7 absolute top-0 bottom-0 my-auto left-5" role="button">
                    <svg class="w-full h-full">
                        <use href="#magnifying-glass"></use>
                    </svg>
                </button>
            </form>
        </div>
        <!--change theme btn-->
        <div class="theme-changer-btn hidden lg:flex justify-center items-center w-14 h-14 bg-gray-100 hover:bg-gray-200 dark:bg-transparent dark:border border-darkGray-700 hover:border-darkGray-600 text-slate-500 dark:text-darkGray-600 rounded-full transition-colors">
            <svg class="w-7 h-7 block dark:hidden">
                <use href="#moon"></use>
            </svg>
            <svg class="w-7 h-7 hidden dark:block">
                <use href="#sun"></use>
            </svg>
        </div>
        <!--login sign up btns-->
        <div class="login-signup-btn--wrapper relative md:w-[155px] xl:w-[180px] md:h-full text-base xl:text-lg text-white">
            <a href="login-email.html" class="absolute right-0 w-[100px] xl:w-28 h-full hidden md:flex items-center justify-start bg-sky-500/50 hover:bg-sky-400 dark:bg-secondary/40 dark:hover:bg-secondary/60 rounded-full pr-5 transition-all">
                ورود
            </a>
            <a href="signup.html" class="absolute left-0 z-10 w-[100px] xl:w-28 h-full hidden md:flex items-center justify-center bg-sky-500 hover:bg-sky-600 dark:bg-secondary dark:hover:bg-[#3F6CDB] rounded-full transition-all">
                عضویت
            </a>
            <a href="login-email.html" class="w-12 h-12 flex md:hidden items-center justify-center bg-gray-100 dark:bg-darkGray-800 text-slate-500 dark:text-darkGray-500 rounded-full">
                <svg class="w-6 h-6">
                    <use href="#user"></use>
                </svg>
            </a>
        </div>
        <!--account btn-->
        <div class="account-center-btn hidden relative group z-20">
            <div id="user-profile">
                <img src="" alt="profile"
                     class="user-profile-pictures w-12 h-12 md:w-14 md:h-14 object-cover rounded-full cursor-pointer">
            </div>
            <!--drop down menu-->
            <div class="user-profile-dropdown">
                <div class="w-[278px] py-5 px-6 rounded-2xl bg-white dark:bg-darkGray-700 text-zinc-700 dark:text-white divide-y-2 divide-gray-200 dark:divide-darkSlate">
                    <!--user details-->
                    <div class="flex justify-start items-center gap-x-2.5 pb-5">
                        <!--user prof pic-->
                        <div>
                            <a href="dashboard.html">
                                <img src="" alt="profile"
                                     class="user-profile-pictures w-12 h-12 object-cover rounded-full cursor-pointer">
                            </a>
                        </div>
                        <!--username and balance-->
                        <div class="flex flex-col gap-y-1">
                            <!--user name-->
                            <span class="account-center--username text-lg">
                            </span>
                            <!--user balance-->
                            <span class="text-sm text-sky-500 dark:text-secondary">
                                موجودی: <span class="account-center--balance">0</span> تومان
                            </span>
                        </div>
                    </div>
                    <!--menu list items-->
                    <div class="flex flex-col justify-between items-start pt-2">
                        <!--dashboard-->
                        <a href="dashboard.html"
                           class="w-full h-[46px] flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                            <svg class="w-5 h-5">
                                <use href="#home"></use>
                            </svg>
                            <span>
                            پیشخوان
                        </span>
                        </a>
                        <!--my courses-->
                        <a href="dashboard.html?sec=my-courses"
                           class="w-full h-[46px] flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                            <svg class="w-5 h-5">
                                <use href="#folder"></use>
                            </svg>
                            <span>
                            دوره های من
                        </span>
                        </a>
                        <!--my tickets-->
                        <a href="dashboard.html?sec=my-tickets"
                           class="w-full h-[46px] flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                            <svg class="w-5 h-5">
                                <use href="#chat-bubble"></use>
                            </svg>
                            <span>
                            تیکت های پشتیبانی
                        </span>
                        </a>
                        <!--my tickets-->
                        <a href="dashboard.html?sec=my-infos"
                           class="w-full h-[46px] flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                            <svg class="w-5 h-5">
                                <use href="#user"></use>
                            </svg>
                            <span>
                            جزئیات حساب
                        </span>
                        </a>
                    </div>
                    <!--logout button-->
                    <div class="flex justify-start items-center pt-2 mt-2">
                        <button type="button" id="logout-btn"
                                class="w-full h-11 flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                            <svg class="w-5 h-5">
                                <use href="#logout-icon"></use>
                            </svg>
                            <span>
                            خروج
                        </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

        <main>
    <div class="container">
        <!--page address section-->
        <section
                class="page-address-bar h-[50px] hidden md:flex justify-start items-center mt-7 bg-white dark:bg-darkGray-800 text-lg text-zinc-700 dark:text-white shadow-light overflow-x-auto overflow-y-hidden rounded-2xl">
            <div class="page-address--item">
                <a href="index.html">
                    <svg class="w-6 h-6">
                        <use href="#home"></use>
                    </svg>
                </a>
            </div>
            <svg class="w-10 h-full text-gray-100 dark:text-darkGray">
                <use href="#chevron-left-address"></use>
            </svg>

            <div class="page-address--item">
                <a href="search-categories.html">
                    دوره ها
                </a>
            </div>
            <svg class="w-10 h-full text-gray-100 dark:text-darkGray">
                <use href="#chevron-left-address"></use>
            </svg>
        </section>
        <!--course initial details-->
        <section
                class="flex flex-col lg:flex-row justify-between items-stretch gap-x-5 xl:gap-x-10 mt-5 mb-4 sm:my-10 p-3.5 sm:p-0  bg-white sm:bg-transparent dark:bg-darkGray-800 dark:sm:bg-transparent rounded-2xl">
            <!--section content-->
            <div class="w-full order-2 lg:order-1 flex flex-col justify-start items-start">
                <!--upper side-->
                <div class="flex-grow">
                    <h1 id="course-name"
                        class="font-morabbaBold text-2xl/[42px] sm:text-3xl/[48px] lg:text-[32px]/[48px] text-zinc-700 dark:text-white lg:line-clamp-2">
                        ${course.name}
                    </h1>
                    <p id="course-description"
                       class="text-lg sm:text-xl/8 line-clamp-4 lg:line-clamp-2 xl:line-clamp-3 mt-3.5 xl:mt-5 text-zinc-700 dark:text-white">
                       ${course.description}
                    </p>
                </div>
                <!--lower side-->
                <div class="w-full mt-5 pt-5 sm:pt-0 xl:mt-0 border-t sm:border-t-0 border-t-gray-100 dark:border-t-darkGray-700">
                    <!--off-->

                    <!--price and shop-->
                    <div class="flex flex-col-reverse sm:flex-row justify-between items-center mt-6 sm:mt-3.5">
                        <!--button-->
                        <div id="watch-or-register-course-btn" class="w-full sm:w-max">
                        </div>
                        <!--price-->
                        <div id="course-price" class="flex justify-center sm:justify-end mb-1 items-center">
                            <span class="${!course.discount ? 'hidden ' : 'flex '}course--price__offered before:-right-[5px] before:-top-1 h-full text-2xl text-slate-500 dark:text-gray-500">
                                ${course.price.toLocaleString()}
                            </span>
                            <span class="inline-flex justify-center items-center gap-x-1.5 flex-wrap font-danaDemiBold text-3xl text-zinc-700 dark:text-white mr-4 sm:mr-2 mb-5 sm:mb-0">
                                ${course.discount === 100 ? 'رایگان!' : (course.price - (course.discount * course.price / 100)).toLocaleString()}
                                ${course.discount === 100 ? '' : `<svg class="w-6 h-6">
                                    <use href="#toman"></use>
                                </svg>`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!--section video-->
            <div id="player-wrapper" class="order-1 lg:order-2 shrink-0 mx-auto mb-3 sm:mb-6 lg:mb-0 w-full h-auto md:w-10/12 lg:w-[440px] lg:h-[270px] xl:w-[610px] xl:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden">
                ${!course.sessions.length || !course.sessions[0].video ? `
            <img src="https://amingharibi-sabzlearn.liara.run/courses/${course.cover}" class="w-full h-full object-cover" alt="${course.name}">
        ` : `
            <video id="player" controls crossorigin playsinline data-poster="https://amingharibi-sabzlearn.liara.run/courses/${course.cover}">
                    <source src="https://amingharibi-sabzlearn.liara.run/sessions/${course.sessions[0].video}"
                            type="video/mp4" size="720">
                </video>
        `}
            </div>
        </section>
        <!--(info boxes and lessons) and course info section and comments-->
        <section class="flex items-start flex-wrap lg:flex-nowrap gap-5">
            <!--info boxes and lessons and comments-->
            <div class="flex-grow w-full">
                <!--info boxes-->
                <div class="grid grid-rows-2 grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-5">
                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
                            <path d="M9.628,34C3.869,34,0,29.959,0,23.943V10.057C0,4.041,3.869,0,9.628,0h14.74C30.129,0,34,4.041,34,10.057V23.943C34,29.959,30.128,34,24.364,34ZM2.551,10.057V23.943c0,4.561,2.779,7.508,7.078,7.508H24.364c4.305,0,7.087-2.947,7.087-7.508V10.057c0-4.559-2.78-7.506-7.082-7.506H9.628C5.329,2.551,2.551,5.5,2.551,10.057ZM15.715,23.8V17a1.275,1.275,0,0,1,2.551,0v6.8a1.275,1.275,0,0,1-2.551,0Zm-.425-13.255a1.693,1.693,0,0,1,1.692-1.7H17a1.7,1.7,0,1,1-1.709,1.7Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">وضعیت دوره</h4>
                            <p id="course-situation"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5"></p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
                            <path d="M9.63,34C3.869,34,0,29.959,0,23.943V10.057C0,4.041,3.869,0,9.63,0H24.369C30.129,0,34,4.041,34,10.057V23.943C34,29.959,30.129,34,24.367,34ZM2.551,10.057V23.943c0,4.561,2.779,7.508,7.079,7.508H24.367c4.3,0,7.084-2.947,7.084-7.508V10.057c0-4.559-2.78-7.506-7.082-7.506H9.63C5.329,2.551,2.551,5.5,2.551,10.057ZM22.11,21.527l-5.765-3.439a1.283,1.283,0,0,1-.621-1.1V9.578a1.275,1.275,0,1,1,2.549,0v6.691l5.145,3.065a1.276,1.276,0,0,1-.655,2.372A1.3,1.3,0,0,1,22.11,21.527Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">مدت زمان دوره</h4>
                            <p id="course-time"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5"></p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30.891" height="35.833"
                             viewBox="0 0 30.891 35.833">
                            <path d="M8.745,35.833C3.35,35.833,0,32.335,0,26.7V11.622c0-5.237,2.989-8.6,7.866-8.958V1.25a1.19,1.19,0,1,1,2.377,0V2.633h10.42V1.25a1.189,1.189,0,1,1,2.375,0V2.664A8.319,8.319,0,0,1,28.632,5.1a9.239,9.239,0,0,1,2.258,6.53v15.2c0,5.553-3.352,9-8.747,9ZM2.377,26.7c0,4.275,2.261,6.63,6.369,6.63h13.4c4.107,0,6.37-2.31,6.37-6.5V14.841H2.377ZM28.514,12.34v-.718A6.641,6.641,0,0,0,26.95,6.864a5.976,5.976,0,0,0-3.912-1.693V6.735a1.189,1.189,0,1,1-2.375,0v-1.6H10.242v1.6a1.19,1.19,0,1,1-2.377,0V5.171c-3.549.313-5.489,2.575-5.489,6.451v.718ZM21.3,26.577a1.214,1.214,0,0,1,1.18-1.249H22.5A1.251,1.251,0,1,1,21.3,26.577Zm-7.029,0a1.214,1.214,0,0,1,1.18-1.249h.014a1.251,1.251,0,1,1-1.195,1.249Zm-7.046,0a1.215,1.215,0,0,1,1.182-1.249h.014a1.251,1.251,0,1,1-1.2,1.249ZM21.3,20.1a1.215,1.215,0,0,1,1.18-1.251H22.5A1.252,1.252,0,1,1,21.3,20.1Zm-7.029,0a1.215,1.215,0,0,1,1.18-1.251h.014A1.252,1.252,0,1,1,14.273,20.1Zm-7.046,0a1.217,1.217,0,0,1,1.182-1.251h.014a1.251,1.251,0,1,1-1.2,1.251Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">آخرین بروزرسانی</h4>
                            <p id="course-updated-at"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5">${intlDateToPersianDate(course.updatedAt)}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
                            <path d="M0,27.688c0-6.355,9.724-6.355,12.92-6.355,5.546,0,12.918.655,12.918,6.32C25.838,34,16.115,34,12.92,34,9.387,34,0,34,0,27.688Zm2.553,0c0,2.412,3.487,3.635,10.367,3.635s10.365-1.236,10.365-3.671c0-2.418-3.487-3.643-10.365-3.643C8.191,24.01,2.553,24.647,2.553,27.688ZM29.26,28.5A1.358,1.358,0,0,1,30,26.779c1.446-.575,1.446-1.277,1.446-1.575,0-1.012-1.143-1.705-3.394-2.055a1.334,1.334,0,0,1-1.075-1.522A1.306,1.306,0,0,1,28.43,20.5c4.605.723,5.57,2.958,5.57,4.7,0,1.3-.536,3.06-3.094,4.075a1.218,1.218,0,0,1-.453.088A1.28,1.28,0,0,1,29.26,28.5ZM12.92,18.322a8.968,8.968,0,0,1-8.74-9.16A8.969,8.969,0,0,1,12.92,0a8.967,8.967,0,0,1,8.737,9.162,9.279,9.279,0,0,1-2.53,6.461,8.445,8.445,0,0,1-6.151,2.7ZM6.733,9.162a6.347,6.347,0,0,0,6.187,6.484h.052a5.977,5.977,0,0,0,4.345-1.908,6.567,6.567,0,0,0,1.789-4.571,6.351,6.351,0,0,0-6.186-6.49A6.349,6.349,0,0,0,6.733,9.162ZM23.382,15.14a1.329,1.329,0,0,1,1.086-1.511,4.5,4.5,0,0,0,3.731-4.5,4.471,4.471,0,0,0-3.63-4.486,1.333,1.333,0,0,1-1.054-1.538,1.286,1.286,0,0,1,1.466-1.1A7.1,7.1,0,0,1,30.75,9.135a7.155,7.155,0,0,1-5.927,7.145,1.278,1.278,0,0,1-1.441-1.14Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">روش پشتیبانی</h4>
                            <p id="course-support"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5">${course.support}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
                            <path d="M7.135,34A6.852,6.852,0,0,1,.367,27.643l-.323-4.32A1.289,1.289,0,0,1,1.22,21.935a1.3,1.3,0,0,1,1.37,1.192l.321,4.32a4.28,4.28,0,0,0,4.223,3.97h19.73a4.278,4.278,0,0,0,4.223-3.97l.323-4.32a1.307,1.307,0,0,1,1.369-1.192,1.289,1.289,0,0,1,1.176,1.387l-.323,4.32A6.854,6.854,0,0,1,26.865,34Zm8.589-8.721v-3.1A32.082,32.082,0,0,1,.631,18.046,1.3,1.3,0,0,1,0,16.933V10.991A6.52,6.52,0,0,1,6.48,4.444H9.812A5.066,5.066,0,0,1,14.806,0h4.389a5.066,5.066,0,0,1,4.993,4.444h3.349A6.521,6.521,0,0,1,34,11.008v5.925a1.3,1.3,0,0,1-.631,1.113,32.1,32.1,0,0,1-15.093,4.137v3.1a1.276,1.276,0,1,1-2.552,0ZM2.552,10.991v5.188A30.422,30.422,0,0,0,16.914,19.62l.086,0,.085,0a30.471,30.471,0,0,0,14.364-3.441V11.008a3.949,3.949,0,0,0-3.911-3.979H6.48A3.949,3.949,0,0,0,2.552,10.991Zm19.04-6.546a2.493,2.493,0,0,0-2.4-1.86H14.806a2.493,2.493,0,0,0-2.4,1.86Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">پیش نیاز</h4>
                            <p id="course-requirement"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5">${course.requirement}</p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row items-center gap-y-2 gap-x-4 text-center md:text-right bg-white dark:bg-darkGray-800 p-3.5 sm:p-5 shadow-light dark:shadow-none rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="35.475" height="27.774"
                             viewBox="0 0 35.475 27.774">
                            <path d="M7.057,27.774A7.191,7.191,0,0,1,.024,21.066C.018,20.99,0,20.788.007,7.564a7.254,7.254,0,0,1,1.8-5.108A7.047,7.047,0,0,1,6.846.008C6.907,0,7.529,0,8.693,0c2.011,0,5.245.006,7.842.011l2.241,0C18.941,0,19.11,0,19.277,0a7.237,7.237,0,0,1,7.1,6.742c0,.041.005.273.008.7L29.916,4.4a3.243,3.243,0,0,1,3.614-.464,3.57,3.57,0,0,1,1.945,3.238l-.02,13.166a3.568,3.568,0,0,1-1.948,3.233A3.247,3.247,0,0,1,29.9,23.1L26.39,20.07q0,.063,0,.126a7.337,7.337,0,0,1-1.805,5.129,7.042,7.042,0,0,1-5.042,2.438c-.058,0-.622.006-1.677.006-2.156,0-5.911-.01-8.653-.016l-1.611,0c-.189.015-.366.023-.541.023Zm4.492-2.7h.014c2.556,0,5.085.008,6.57.008.812,0,1.244,0,1.32,0A4.531,4.531,0,0,0,22.7,23.507a4.583,4.583,0,0,0,1.134-3.225c0-.019,0-.039,0-.06,0-3,0-12.844-.009-13.314a4.606,4.606,0,0,0-4.578-4.222c-.126,0-.254.006-.38.016l-2.636,0c-2.995,0-6.221-.01-7.977-.01-.742,0-1.231,0-1.313,0A4.545,4.545,0,0,0,3.689,4.27,4.607,4.607,0,0,0,2.559,7.5c0,8.566,0,13.071.014,13.389a4.583,4.583,0,0,0,4.561,4.189c.124,0,.25,0,.374-.015Zm19.965-4.051a.785.785,0,0,0,.9.114.863.863,0,0,0,.486-.8l.02-13.168a.869.869,0,0,0-.484-.806.8.8,0,0,0-.9.118l-5.146,4.43q0,2.234,0,5.685Z"
                                  fill="#2ed573"></path>
                        </svg>
                        <div>
                            <h4 class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">نوع مشاهده</h4>
                            <p id="course-watching-option"
                               class="text-slate-500 dark:text-darkGray-500 text-xs mt-0.5 sm:mt-1.5">${course.watchingOptions}</p>
                        </div>
                    </div>
                </div>
                <!--students & rate & progress for mobile size-->
                <div class="lg:hidden bg-white dark:bg-darkGray-800 mt-3.5 p-[14px] shadow-light dark:shadow-none rounded-2xl">
                    <!--students & rate-->
                    <div class="flex flex-col xs:flex-row gap-3.5">
                        <!--students-->
                        <div class="flex justify-between items-center flex-grow bg-gray-100 dark:bg-darkGray-700 py-4 px-5 rounded-2xl">
                            <svg class="text-primary w-8 h-8">
                                <use href="#users-solid"></use>
                            </svg>

                            <div class="text-center">
                                <span class="course-students block font-danaDemiBold text-2xl dark:text-white"></span>
                                <span class="block text-slate-500 dark:text-darkGray-500 text-sm">دانشجو</span>
                            </div>
                        </div>
                        <!--rate-->
                        <div class="flex justify-between items-center flex-grow bg-gray-100 dark:bg-darkGray-700 py-4 px-5 rounded-2xl">
                            <svg class="text-amber-400 dark:text-yellow-400 w-8 h-8">
                                <use href="#star-solid"></use>
                            </svg>

                            <div class="text-center">
                                <span class="course-rating block font-danaDemiBold text-2xl dark:text-white"></span>
                                <span class="block text-slate-500 dark:text-darkGray-500 text-sm">رضایت</span>
                            </div>
                        </div>
                    </div>
                    <!--progress-->
                    <div class="mt-5">
                        <!--progress title-->
                        <div class="mb-4 flex justify-between items-center dark:text-white text-xl">
                            <span>درصد تکمیل دوره</span>
                            <span class="course-progress__title"></span>
                        </div>
                        <!--progress bar-->
                        <progress value="" max="100"
                                  class="course-progress__bar h-2.5 w-full align-baseline"></progress>
                    </div>
                </div>
                <!--teacher for mobile size-->
                <div class="course-teacher-section__mobile lg:hidden flex flex-col justify-center items-center bg-white dark:bg-darkGray-800 mt-4 p-5 pb-[14px] shadow-light dark:shadow-none rounded-2xl">
                </div>
                <!--lessons-->
                <div id="lessons" class="bg-white dark:bg-darkGray-800 mt-4 sm:mt-5 px-3.5 md:px-5 pt-5 md:pt-7 pb-3.5 md:pb-6 shadow-light dark:shadow-none rounded-2xl">
                    <!--top side-->
                    <div class="flex justify-between items-center flex-wrap mb-5">
                        <div class="flex items-center gap-x-3.5">
                            <span class="block h-10 w-2.5 bg-sky-500 dark:bg-secondary rounded-sm"></span>
                            <h3 class="font-morabbaBold text-2xl md:text-3xl dark:text-white">
                                سرفصل های دوره
                            </h3>
                        </div>
                        <span id="course-exact-time" class="dark:text-white">
                        </span>
                    </div>
                    <!--lessons container-->
                    <div class="space-y-2.5">
                        <!--seasons-->
                        <div class="topic">
                            <!--title and what you see whe closed-->
                            <div class="topic__title">
                                <h3 class="font-danaMedium text-base md:text-xl dark:text-white">
                                    سرفصل ها توسط بک اند هندل نشده اند :(
                                </h3>
                                <svg class="w-5 h-5 sm:w-6 sm:h-6 dark:text-white transition-transform">
                                    <use href="#chevron-down"></use>
                                </svg>
                            </div>
                            <!--episodes-->
                            <div class="topic__body" style="max-height: 0;">

                            </div>
                        </div>
                    </div>
                </div>
                <!--course comments-->
                <div class="mt-4 sm:mt-5 px-3.5 md:px-5 pt-5 md:pt-7 md:pb-6 pb-2 bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none rounded-2xl">
                    <!--top side-->
                    <div class="flex justify-between items-center flex-wrap mb-5">
                        <!--title-->
                        <div class="flex items-center gap-x-3.5">
                            <span class="block h-10 w-2.5 bg-pink-500 dark:bg-rose-500 rounded-sm"></span>
                            <h3 class="font-morabbaBold text-2xl md:text-3xl dark:text-white">
                                نظرات
                            </h3>
                        </div>
                        <!--new comment button-->
                        <button id="show-add-new-comment-form-btn"
                                class="w-max h-10 flex justify-center items-center px-4 text-base bg-primary hover:bg-green-500 text-white select-none rounded-xl transition-all">
                            ایجاد نظر جدید
                        </button>
                    </div>
                    <!--add new comment form-->
                    <form class="add-comment-form">
                        <!--form header-->
                        <div id="add-comment-form-header" class="flex items-center gap-x-2 mb-3">

                        </div>
                        <!--form content-->
                        <textarea rows="6" id="comment-textarea"
                                  class="block w-full p-3 md:p-5 text-sm md:text-base text-slate-500 dark:text-darkGray-500 focus:text-zinc-700 dark:focus:text-white bg-gray-100 dark:bg-darkGray-700 border border-transparent focus:border-gray-200 dark:focus:border-darkSlate rounded-2xl transition-colors outline-0"
                                  placeholder="نظر خود را بنویسید ..."></textarea>
                        <!--form buttons-->
                        <div class="flex gap-x-2 justify-end mt-2.5">
                            <button type="button"
                                    class="w-max h-10 flex justify-center items-center px-4 text-base bg-gray-200 hover:bg-gray-300 dark:bg-darkGray-700 dark:hover:bg-darkSlate dark:text-white select-none rounded-xl transition-all"
                                    id="comment-cancel-btn">لغو
                            </button>
                            <button type="submit"
                                    class="w-max h-10 flex justify-center items-center px-4 text-base bg-sky-500 hover:bg-sky-600 dark:bg-[#4E81FB] dark:hover:bg-[#2563EB] text-white select-none rounded-xl transition-all"
                                    id="comment-submit-btn">ثبت
                            </button>
                        </div>
                    </form>
                    <!--comments container-->
                    <div id="course-comments-container" class="space-y-3.5 sm:space-y-5">
                        <!--each comment-->
                    </div>
                </div>
            </div>
            <!-- side course info-->
            <aside class="w-80 xl:w-96 shrink-0 sticky top-5 space-y-5">
                <!--students & rate & progress-->
                <div class="hidden lg:block bg-white dark:bg-darkGray-800 p-5 shadow-light dark:shadow-none rounded-2xl">
                    <!--students & rate-->
                    <div class="flex gap-5">
                        <!--students-->
                        <div class="flex justify-between items-center flex-grow bg-gray-100 dark:bg-darkGray-700 py-4 px-5 rounded-2xl">
                            <svg class="text-primary w-8 h-8">
                                <use href="#users-solid"></use>
                            </svg>

                            <div class="text-center">
                                <span class="course-students block font-danaDemiBold text-2xl dark:text-white"></span>
                                <span class="block text-slate-500 dark:text-darkGray-500 text-sm">دانشجو</span>
                            </div>
                        </div>
                        <!--rate-->
                        <div class="flex justify-between items-center flex-grow bg-gray-100 dark:bg-darkGray-700 py-4 px-5 rounded-2xl">
                            <svg class="text-amber-400 dark:text-yellow-400 w-8 h-8">
                                <use href="#star-solid"></use>
                            </svg>

                            <div class="text-center">
                                <span class="course-rating block font-danaDemiBold text-2xl dark:text-white"></span>
                                <span class="block text-slate-500 dark:text-darkGray-500 text-sm">رضایت</span>
                            </div>
                        </div>
                    </div>
                    <!--progress-->
                    <div class="mt-5">
                        <!--progress title-->
                        <div class="mb-4 flex justify-between items-center dark:text-white text-xl">
                            <span>درصد تکمیل دوره</span>
                            <span class="course-progress__title"></span>
                        </div>
                        <!--progress bar-->
                        <progress value="" max="100"
                                  class="course-progress__bar h-2.5 w-full align-baseline"></progress>
                    </div>
                </div>
                <!--teacher-->
                <div class="course-teacher-section__desktop hidden lg:flex flex-col justify-start items-center bg-white dark:bg-darkGray-800 py-6 px-5 shadow-light dark:shadow-none rounded-2xl">
                </div>
                <!--short link-->
                <div class="hidden lg:block px-5 py-6 bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                    <span class="side-bar--titles before:bg-secondary-light relative flex justify-start items-center mb-5 pr-4 font-danaDemiBold text-2xl dark:text-white">
                        لینک کوتاه:
                    </span>
                    <div class="h-[65px] flex justify-between items-center gap-x-2.5 px-4 bg-gray-100 dark:bg-darkGray-700 text-slate-500 dark:text-darkGray-500 border border-dashed border-gray-600/30 rounded-xl">
                        <button class="short-link--copy-btn">
                            <svg class="w-6 h-6">
                                <use href="#clipboard-document"></use>
                            </svg>
                        </button>
                        <span class="text-xl truncate text-ltr">
                            https://sabzlearn.ir/?p=138
                        </span>
                    </div>
                </div>
            </aside>
        </section>
    </div>
</main>

        <footer class="bg-white dark:bg-transparent mt-24 pt-8 lg:pt-16 text-base xl:text-lg text-slate-500 dark:text-slate-400 dark:border-t border-t-darkGray-700">
    <div class="container">
        <!--footer content-->
        <div class="flex justify-between flex-wrap gap-x-4 gap-y-5 pb-5 border-b dark:border-b-darkGray-700">
            <!--about us-->
            <div class="space-y-5 sm:flex-grow">
                <h4 class="font-danaMedium text-2xl text-zinc-700 dark:text-white">
                    درباره ما
                </h4>
                <p class="sm:max-w-xs">
                    سبزلرن یک اکادمی خصوصی آموزش برنامه نویسی هست که با هدف تحویل نیروی متخصص بر پایه تولید محتوای
                    غیرسطحی فعالیت میکند
                </p>
            </div>
            <!--quick access-->
            <div class="space-y-5 sm:flex-grow">
                <h4 class="font-danaMedium text-2xl text-zinc-700 dark:text-white">
                    دسترسی سریع
                </h4>
                <div class="flex flex-col justify-start items-start gap-y-3">
                    <a href="terms.html" class="hover:text-primary transition-colors">
                        قوانین و مقررات
                    </a>
                    <a href="dashboard.html?sec=my-tickets" class="hover:text-primary transition-colors">
                        ارسال تیکت
                    </a>
                    <a href="search-categories.html" class="hover:text-primary transition-colors">
                        همه دوره ها
                    </a>
                </div>
            </div>
            <!--useful links-->
            <div class="space-y-5 sm:flex-grow">
                <h4 class="font-danaMedium text-2xl text-zinc-700 dark:text-white">
                    لینک های مفید
                </h4>
                <div class="flex flex-col justify-start items-start gap-y-3" id="footer-usefull-courses">
                </div>
            </div>
            <!--social media-->
            <div class="space-y-5 sm:flex-grow">
                <h4 class="font-danaMedium text-2xl text-zinc-700 dark:text-white">
                    شبکه های اجتماعی
                </h4>
                <div class="flex flex-col justify-start items-start gap-y-3">
                    <!--instagram link-->
                    <a href="https://instagram.com/amiingharibi" target="_blank" class="flex justify-start items-center gap-x-4 hover:text-primary transition-colors">
                        <div class="flex items-center justify-center rounded-full w-8 h-8 bg-orange-600 text-white bg-gradient-to-tr from-[#FEDC15] via-[#F71F87] to-[#9000DC]">
                            <svg class="w-5 h-5">
                                <use href="#instagram"></use>
                            </svg>
                        </div>
                        <span class="text-ltr font-danaDemiBold">
                            @amiingharibi
                        </span>
                    </a>
                    <!--telegram link-->
                    <a href="https://t.me/amiingharibi" target="_blank" class="flex justify-start items-center gap-x-4 hover:text-primary transition-colors">
                        <div class="flex items-center justify-center rounded-full w-8 h-8 bg-blue-500 text-white bg-gradient-to-b from-blue-400 to-blue-600">
                            <svg class="w-5 h-5">
                                <use href="#telegram"></use>
                            </svg>
                        </div>
                        <span class="text-ltr font-danaDemiBold">
                            @amiingharibi
                        </span>
                    </a>
                </div>
            </div>
        </div>
        <!--footer copyright-->
        <div class="flex justify-center sm:justify-between flex-wrap gap-x-3 gap-y-2 py-5 text-base">
            <span>
                ساخته شده با ❤️ توسط محمدامین غریبی
            </span>
            <span class="text-ltr">
                Copyright &copy; 2019-2023 Sabzlearn. Developed by M.Amin Gharibi
            </span>
        </div>
    </div>
</footer>
    `

    renderShared(data, headerMenus);
    renderFooter(popularCourses);

    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    const player = new Plyr('#player');

    // customize the addressBar
    const pageAddressBar = document.querySelector('.page-address-bar')
    pageAddressBar.insertAdjacentHTML('beforeend', `
        <div class="page-address--item">
                <a href="search-categories.html?cat=${course.categoryID.name}">
                    ${course.categoryID.title}
                </a>
            </div>
            <svg class="w-10 h-full text-gray-100 dark:text-darkGray">
                <use href="#chevron-left-address"></use>
            </svg>

            <div class="page-address--item">
                <a href="course-page.html?c=${course.shortName}">
                    ${course.name}
                </a>
            </div>
    `)

    const watchOrRegisterCourseBtns = document.querySelector('#watch-or-register-course-btn')
    watchOrRegisterCourseBtns.innerHTML = (() => {
        if (data && data.courses.find(c => c._id === course._id)) {
            return `
                <!--when registered-->
                <a id="scroll-to-lessons" href="#lessons" class="w-full sm:w-auto h-[62px] flex justify-center items-center gap-x-2.5 px-5 font-danaDemiBold text-2xl bg-secondary-light hover:bg-sky-600 dark:bg-[#4E81FB] dark:hover:bg-[#2563EB] text-white select-none rounded-xl transition-all">
                    <svg class="w-8 h-8">
                        <use href="#play-circle"></use>
                    </svg>
                    <span>
                    مشاهده دوره
                    </span>
                </a>
            `
        }
        return `
            <!--when not registered-->
            <a href="${(data && `shopping-receipt.html?c=${course.shortName}&token=${getToken()}`) || 'login-email.html'}" class="w-full sm:w-auto h-[62px] flex justify-center items-center gap-x-2.5 px-5 font-danaDemiBold text-2xl bg-primary hover:bg-green-500 text-white select-none rounded-xl transition-all">
                <svg class="w-[25px] h-[30px]">
                    <use href="#shield-done"></use>
                </svg>
                <span>
                شرکت در دوره
                </span>
            </a>
        `
    })()

    const scrollToLessonsBtn = document.querySelector('#scroll-to-lessons')
    scrollToLessonsBtn && scrollToLessonsBtn.addEventListener('click', event => {
        event.preventDefault()
        const seasonBody = document.querySelector('#lessons')
        seasonBody.scrollIntoView({behavior: "smooth", block: "center"})
    })

    // customize the info boxes of the course
    const courseSituationTitle = document.querySelector('#course-situation')
    const courseTimeTitle = document.querySelector('#course-time')
    courseSituationTitle.innerHTML = (() => {
        switch (course.status) {
            case 1:
                return 'پیش فروش'
            case 2:
                return 'در حال برگزاری'
            case 3:
                return 'تکمیل شده'
        }
    })()
    courseTimeTitle.innerHTML = `${course.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0).toFixed(0)} ساعت`

    // customize students count and rating and course progress and course teach and short link
    const courseStudentsCount = document.querySelectorAll('.course-students')
    const courseRatingTitles = document.querySelectorAll('.course-rating')
    const courseProgressTitle = document.querySelectorAll('.course-progress__title')
    const courseProgressBar = document.querySelectorAll('.course-progress__bar')
    const courseTeacherSectionMobile = document.querySelector('.course-teacher-section__mobile')
    const courseTeacherSectionDesktop = document.querySelector('.course-teacher-section__desktop')
    courseStudentsCount.forEach(title => title.innerHTML = course.courseStudentsCount)
    courseRatingTitles.forEach(title => title.innerHTML = course.rate?.toFixed(1) || 5)
    courseProgressTitle.forEach(title => title.innerHTML = `${calcCourseProgress(course)}%`)
    courseProgressBar.forEach(elem => elem.setAttribute('value', calcCourseProgress(course)))
    courseTeacherSectionMobile.innerHTML = `
        <div class="w-full flex justify-center items-center gap-x-2.5 mb-3.5 pb-5 border-b lg:border-none border-b-gray-100 dark:border-b-darkSlate">
            <img src="https://amingharibi-sabzlearn.liara.run/profile/${course.creator.profile}" alt="${course.creator.name}" class="block w-[60px] h-[60px] object-cover rounded-full">
            <div>
                <h4 class="mb-1 font-danaDemiBold text-2xl dark:text-white">
                    ${course.creator.name}
                </h4>
                <p class="mt-1.5 text-sm text-slate-500 dark:text-darkGray-500">
                    ${course.creator.status || ''}
                </p>
            </div>
        </div>
        <a href="teacher-page.html?teacher=${course.creator.username}" class="inline-flex gap-x-1.5 text-sm text-slate-500 dark:text-darkGray-500">
            <svg class="w-5 h-5">
                <use href="#exit"></use>
            </svg>
            <span>
                مشاهده پروفایل
            </span>
        </a>
    `
    courseTeacherSectionDesktop.innerHTML = `
        <img src="https://amingharibi-sabzlearn.liara.run/profile/${course.creator.profile}" alt="${course.creator.name}" class="block w-[90px] h-[90px] mb-2 object-cover rounded-full">
        <h4 class="mb-1 text-2xl dark:text-white">
            ${course.creator.name}
        </h4>
        <a href="teacher-page.html?teacher=${course.creator.username}" class="inline-flex gap-x-1.5 text-slate-500 dark:text-darkGray-500 text-sm">
            <span>
                مدرس دوره
            </span>
            <svg class="w-5 h-5">
                <use href="#exit"></use>
            </svg>
        </a>
        <p class="text-zinc-700 dark:text-white font-danaLight mt-2.5">
            ${course.creator.status || ''}
        </p>
    `

    // customize lessons
    const courseExactTime = document.querySelector('#course-exact-time')
    const relativeMin = course.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0).toString().split('.')[1] || '0'
    const exactMin = (Number('0.' + relativeMin) * 60).toFixed(0)
    courseExactTime.innerHTML = (course.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0) || '0').toString().split('.')[0].padStart(2, '0') + ':' + exactMin.padStart(2, '0')

    const lessons = course.sessions
    const seasonBody = document.querySelector('.topic__body')
    if (lessons.length) {
        lessons.forEach((lesson, index) => {
            seasonBody.insertAdjacentHTML('beforeend', `
            <div class="md:flex items-center gap-2.5 flex-wrap space-y-3.5 md:space-y-0 py-4 md:py-6 px-3.5 md:px-5 bg-gray-100 dark:bg-darkGray-700 group">
                <!--episode title-->
                <a href="${lesson.free || (data && data.courses.find(c => c._id === course._id)) ? `session-page.html?c=${course.shortName}&session=${lesson._id}` : '#watch-or-register-course-btn'}" class="flex items-center gap-x-1.5 md:gap-x-2.5 shrink-0 w-[85%]">
                    <span class="flex justify-center items-center shrink-0 w-5 h-5 md:w-7 md:h-7 bg-white dark:bg-darkGray-800 group-hover:bg-primary group-hover:text-white font-danaDemiBold text-xs md:text-base dark:text-white rounded-md transition-colors">
                        ${index + 1}
                    </span>
                    <h4 class="text-sm md:text-lg dark:text-white group-hover:text-primary transition-colors">
                        ${lesson.title}
                    </h4>
                </a>
                <!--episode tag and time-->
                <div class="w-full flex justify-between items-center mt-3.5">
                    <span class="inline-block h-[25px] leading-[25px] px-2.5 bg-gray-200 dark:bg-darkSlate group-hover:bg-primary/10 text-xs dark:text-white group-hover:text-primary rounded transition-colors">
                        جلسه ${lesson.free ? 'رایگان' : 'نقدی'}
                    </span>
                    <div class="flex justify-end items-center gap-x-1.5 md:gap-x-2">
                        <span class="text-sm md:text-lg text-slate-500 dark:text-darkGray-500">${lesson.time}</span>
                        <svg class="w-5 h-5 md:w-6 md:h-6 dark:text-white group-hover:text-primary transition-colors">
                            <use href="#play-circle"></use>
                        </svg>
                    </div>
                </div>
            </div>
        `)
        })
    } else {
        seasonBody.insertAdjacentHTML('beforeend', `
        <span class="block w-full h-full text-center py-3 bg-gray-100 dark:bg-darkGray-700 text-zinc-700 dark:text-white">به زودی :)</span>
    `)
    }

    // if user wasn't registered to the course and clicked on a paid lesson do this
    const goToBuyCourseBtnLinkElems = document.querySelectorAll('a[href="#watch-or-register-course-btn"]')
    goToBuyCourseBtnLinkElems.forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault();
            const buyCourseBtn = document.querySelector('#watch-or-register-course-btn')
            buyCourseBtn.scrollIntoView({behavior: 'smooth', block: 'center'})
            alert(document.body, 'close-circle', 'alert-red', 'دقت کنید!', 'برای دسترسی به جلسات نقدی لطفا دوره را خریداری کنید!')
        })
    })

    // customize comment section of each course
    // show add new comment form as soon as user clicks on new comment btn
    const showAddNewCommentFormBtn = document.querySelector('#show-add-new-comment-form-btn')
    const addNewCommentForm = document.querySelector('.add-comment-form')
    showAddNewCommentFormBtn.addEventListener('click', () => {
        if (data) {
            addNewCommentForm.classList.add('active')
        } else {
            alert(document.body, 'close-circle', 'alert-red', 'خطا', 'برای ایجاد نظر جدید ابتدا وارد حساب خود شوید!')
        }
    })

    // customize the header of add new comment form for each user
    const addCommentFormHeaderSection = document.querySelector('#add-comment-form-header')
    addCommentFormHeaderSection.innerHTML = `
        <img src="https://amingharibi-sabzlearn.liara.run/profile/${data.profile}" alt="${data.name}" class="block w-10 h-10 md:w-14 md:h-14 object-cover rounded-full shrink-0">
        <div class="dark:text-white">
            <span class="inline-block font-danaMedium text-base md:text-xl">
                ${data.name}
            </span>
            <p class="add-new-comment__form-title text-sm text-slate-500 dark:text-darkGray-500">
                ثبت نظر جدید
            </p>
        </div>
    `

    // function to prevent duplicate codes
    const convertIntlDateOfCommentsToPer = comment => {
        return intlDateToPersianDate(comment.createdAt)
    }

    // handle showing course comments that has been accepted
    const courseCommentsContainer = document.querySelector('#course-comments-container')
    if (courseComments.length) {
        courseComments.forEach(comment => {
            let commentAnswerStr = ''
            if (comment.answer) {
                commentAnswerStr = `
                <div class="flex gap-x-5 p-3.5 md:p-5 bg-gray-200 dark:bg-darkSlate rounded-2xl">
                            <!--user profile and role-->
                            <div class="hidden md:flex flex-col items-center gap-y-2">
                                <img src="https://amingharibi-sabzlearn.liara.run/profile/${comment.answerContent.creator.profile}" alt="${comment.answerContent.creator.name}"
                                     class="block w-10 h-10 md:w-[60px] md:h-[60px] object-cover rounded-full">
                                <span class="w-[60px] h-[18px] ${comment.answerContent.creator.role === 'USER' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${comment.answerContent.creator.role === 'ADMIN' || comment.answerContent.creator.role === 'TEACHER' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
                                    ${comment.answerContent.creator.role.toLowerCase() === 'user' ? 'کاربر' : ''}
                                    ${comment.answerContent.creator.role.toLowerCase() === 'admin' ? 'مدیریت' : ''}
                                    ${comment.answerContent.creator.role.toLowerCase() === 'teacher' ? 'مدرس' : ''}
                                </span>
                            </div>
                            <!--user name && comment-->
                            <div class="w-full">
                                <!--username && date && profile and role for mobile size-->
                                <div class="w-full flex justify-between items-center">
                                    <!--username && date && profile and role for mobile size-->
                                    <div class="flex items-center gap-x-2">
                                        <img src="https://amingharibi-sabzlearn.liara.run/profile/${comment.answerContent.creator.profile}" alt="${comment.answerContent.creator.name}" class="block md:hidden w-10 h-10 object-cover rounded-full shrink-0">
                                        <div class="shrink-0">
                                            <!--username-->
                                            <span class="font-danaMedium text-base md:text-xl dark:text-white">
                                                ${comment.answerContent.creator.name}
                                            </span>
                                            <!--user role and release date-->
                                            <div class="flex items-center gap-x-1.5 mt-1">
                                                <span class="md:hidden w-[60px] h-[18px] ${comment.answerContent.creator.role.toLowerCase() === 'user' && !isEnrolledInCourse(course.shortName) ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${comment.answerContent.creator.role.toLowerCase() === 'admin' || comment.answerContent.creator.role.toLowerCase() === 'teacher' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''}${comment.answerContent.creator.role.toLowerCase() === 'user' && isEnrolledInCourse(course.shortName) ? 'bg-primary dark:bg-primary/10 dark:text-primary' : ''} text-xs text-white text-center rounded">
                                                    ${comment.answerContent.creator.role.toLowerCase() === 'user' && !isEnrolledInCourse(course.shortName) ? 'کاربر' : ''}
                                                    ${comment.answerContent.creator.role.toLowerCase() === 'user' && isEnrolledInCourse(course.shortName) ? 'دانشجو' : ''}
                                                    ${comment.answerContent.creator.role.toLowerCase() === 'admin' ? 'مدیریت' : ''}
                                                    ${comment.answerContent.creator.role.toLowerCase() === 'teacher' ? 'مدرس' : ''}
                                                </span>
                                                <span class="text-xs text-slate-500 dark:text-white">
                                                    ${convertIntlDateOfCommentsToPer(comment.answerContent)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--comment content-->
                                <p class="dark:text-white leading-7 mt-3.5">
                                    ${comment.answerContent.body}
                                </p>
                            </div>
                        </div>
            `
            }
            courseCommentsContainer.insertAdjacentHTML('beforeend', `
            <div class="flex gap-x-5 p-3.5 md:p-5 bg-gray-100 dark:bg-darkGray-700 rounded-2xl">
                <!--user profile and role for desktop-->
                <div class="hidden md:flex flex-col items-center gap-y-2">
                    <img src="https://amingharibi-sabzlearn.liara.run/profile/${comment.creator.profile}" alt="${comment.creator.name}" class="block w-10 h-10 md:w-[60px] md:h-[60px] object-cover rounded-full">
                    <span class="w-[60px] h-[18px] ${comment.creator.role === 'USER' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${comment.creator.role === 'ADMIN' || comment.creator.role.toLowerCase() === 'TEACHER' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
                        ${comment.creator.role.toLowerCase() === 'user' ? 'کاربر' : ''}
                        ${comment.creator.role.toLowerCase() === 'admin' ? 'مدیریت' : ''}
                        ${comment.creator.role.toLowerCase() === 'teacher' ? 'مدرس' : ''}
                    </span>
                </div>
                <!--user name && comment && answers-->
                <div class="w-full">
                    <!--username && date && profile and role for mobile && reply btn-->
                    <div class="w-full flex justify-between items-center">
                        <!--username && date && profile and role for mobile size-->
                        <div class="flex items-center gap-x-2">
                            <img src="https://amingharibi-sabzlearn.liara.run/profile/${comment.creator.profile}" alt="${comment.creator.name}" class="block md:hidden w-10 h-10 object-cover rounded-full shrink-0">
                            <div class="shrink-0">
                                <!--username-->
                                <span class="font-danaMedium text-base md:text-xl dark:text-white">
                                    ${comment.creator.name}
                                </span>
                                <!--user role and release date-->
                                <div class="flex items-center gap-x-1.5 mt-1">
                                    <span class="md:hidden w-[60px] h-[18px] ${comment.creator.role === 'USER' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${comment.creator.role === 'ADMIN' || comment.creator.role === 'TEACHER' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
                                        ${comment.creator.role.toLowerCase() === 'user' ? 'کاربر' : ''}
                                        ${comment.creator.role.toLowerCase() === 'admin' ? 'مدیریت' : ''}
                                        ${comment.creator.role.toLowerCase() === 'teacher' ? 'مدرس' : ''}
                                    </span>
                                    <span class="text-xs text-slate-500 dark:text-white">
                                        ${convertIntlDateOfCommentsToPer(comment)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--comment content-->
                    <p class="dark:text-white leading-7 mt-3.5">
                        ${comment.body}
                    </p>
                    ${comment.answer && `
                    <!--answers-->
                    <div class="mt-7 space-y-3.5 md:space-y-5">
                        ${commentAnswerStr}
                    </div>
                    ` || ''
            }
                </div>
            </div>
        `)
        })
    } else {
        courseCommentsContainer.insertAdjacentHTML('beforeend', `
            <span class="block text-base sm:text-lg text-center text-zinc-700 dark:text-white">هیچ کامنتی وجود نداره. اولین نفر باش که کامنت میزاری :)</span>
        `)
    }

    // validate the comment body input
    const validateCommentAndSend = event => {
        event.preventDefault()
        const commentContentInput = document.querySelector('#comment-textarea')
        if (commentContentInput.value) {
            SendNewCommentHandler()
        } else {
            alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'کامنت باید دارای بدنه باشد')
        }
    }

    // function to handle connection between frontend and backend to add new comment
    const SendNewCommentHandler = () => {
        const commentContentInput = document.querySelector('#comment-textarea')

        const newCommentObj = {
            body: commentContentInput.value,
            courseShortName: course.shortName,
            score: 5,
            isAccepted: 0
        }
        fetch('https://amingharibi-sabzlearn.liara.run/v1/comments', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCommentObj)
        }).then(res => {
            return res.status === 201;

        })
            .then(isSubmitted => {
                if (isSubmitted) {
                    alert(document.body, 'check-circle', 'primary', 'ارسال شد', 'کامنت شما پس از تایید نمایش داده خواهد شد')
                    commentContentInput.value = '';
                } else {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطایی رخ داد لظفا مججد تلاش کنید')
                }
            })
    }

    // handle canceling sending comment or submitting it
    const addCommentCancelBtn = document.querySelector('#comment-cancel-btn')
    const addCommentSubmitBtn = document.querySelector('#comment-submit-btn')
    addCommentCancelBtn.addEventListener('click', () => addNewCommentForm.classList.remove('active'))
    addCommentSubmitBtn.addEventListener('click', event => validateCommentAndSend(event))


    // ------------------- Event Listeners
    const seasonsTitle = document.querySelector('.topic__title')
    const copyShortLinkBtn = $.querySelector(".short-link--copy-btn")

    seasonsTitle.addEventListener('click', event => toggleSeasonHandler(event.currentTarget, seasonBody, 'topic__title--active'))
    copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, $.body))
    // Event Listeners End
}