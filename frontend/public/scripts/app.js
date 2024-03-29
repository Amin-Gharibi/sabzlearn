import {
    createArticlesTemplate,
    createCourseTemplate, getAllCategories,
    getLastCreatedCourses,
    getLastEditedCourses,
    getPopularCourses,
    getPreSaleCourses,
    getPublishedArticles, searchFormSubmissionHandler
} from './utils/utils.js';
import {renderShared, sharedFetches} from "./shared/shared.js";
import {renderFooter} from "./shared/footer.js";

document.addEventListener('DOMContentLoaded', async () => {
    await fetchData()
})

const fetchData = async () => {
    try {
        const [latestCourses, newestCourses, publishedArticles, preSaleCourses, popularCourses, allCategories, {user, headerMenus}] = await Promise.all([
            getLastEditedCourses(),
            getLastCreatedCourses(),
            getPublishedArticles(),
            getPreSaleCourses(),
            getPopularCourses(),
            getAllCategories(),
            sharedFetches()
        ])

        await renderPage(latestCourses, newestCourses, publishedArticles, preSaleCourses, popularCourses, allCategories, user, headerMenus)
    } catch (error) {
        console.log("Error Handling: ", error)
    }
}

const renderPage = async (latestCourses, newestCourses, publishedArticles, preSaleCourses, popularCourses, allCategories, user, headerMenus) => {

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
        <!--starting section-->
        <section class="pt-10 lg:pt-[100px]">
            <div class="container">
                <div class="flex flex-col lg:flex-row justify-center items-center flex-wrap gap-y-10 lg:flex-nowrap lg:justify-between">
                    <!--section image-->
                    <div class="lg:order-2">
                        <img src="./images/main/boy-light.svg" alt="سبز لرن"
                             class="block dark:hidden w-full sm:w-[400px] lg:w-[460px] xl:w-[550px]">
                        <img src="./images/main/boy-dark.svg" alt="سبز لرن"
                             class="hidden dark:block w-full sm:w-[400px] lg:w-[460px] xl:w-[550px]">
                    </div>
                    <!--section content-->
                    <div class="w-full sm:w-auto text-center lg:text-right lg:order-1">
                        <h2 class="max-w-[500px] font-morabbaBold text-5xl lg:text-6xl text-zinc-700 dark:text-white leading-[80px] lg:leading-[96px]">
                            ما به هر قیمتی <br> دوره تولید نمی کنیم!
                        </h2>
                        <p class="max-w-[500px] text-xl lg:text-2xl text-zinc-700 dark:text-white mt-5 sm:mt-6 lg:mt-7">
                            با آکادمی خصوصی سبزلرن، علم برنامه نویسی رو با خیال راحت یاد بگیر و پیشرفت کن
                        </p>
                        <div class="flex justify-center lg:justify-start items-center flex-wrap gap-5 sm:gap-7 mt-6 sm:mt-10 lg:mt-12">
                            <a href="#"
                               class="h-10 sm:h-14 flex justify-center items-center sm:text-xl px-[18px] sm:px-7 bg-sky-500 hover:bg-sky-600 dark:bg-secondary dark:hover:bg-blue-600 text-white rounded-full transition-colors">
                                از اینجا شروع کن
                            </a>
                            <div>
                                <!--green btn-->
                                <a href="#"
                                   class="flex items-center gap-x-2.5 text-slate-500 dark:text-slate-400 sm:text-xl group">
                        <span class="w-10 sm:w-14 h-10 sm:h-14 flex justify-center items-center bg-primary rounded-full p-0 group-hover:bg-green-500">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1">
                                <use href="#play"></use>
                            </svg>
                        </span>
                                    ما کی هستیم؟
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!--latest courses section-->
        <section class="mt-[88px] sm:mt-40">
            <div class="container">
                <!--section header-->
                <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                    <div class="self-start">
                    <span class="section--title section--title__latest-courses">
                        آخرین دوره ها
                    </span>
                        <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                            سکوی پرتاپ شما به سمت موفقیت
                        </p>
                    </div>
                    <div class="self-end">
                        <a href="search-categories.html"
                           class="font-danaMedium flex justify-end items-center gap-x-0.5 rounded-xl px-2.5 py-2 text-sky-500 hover:bg-sky-500/10 dark:text-secondary dark:hover:bg-secondary/10 transition-colors">
                            مشاهده همه دوره ها
                            <svg class="w-5 h-5">
                                <use href="#mini-arrow-left"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <!--section body-->
                <div class="latest-courses--wrapper mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                </div>
            </div>
        </section>
        <!--roadmaps-->
        <section class="mt-[100px]">
            <div class="container">
                <!--section header-->
                <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                    <div class="self-start">
                    <span class="section--title section--title__roadmaps">
                        نقشه راه ها
                    </span>
                        <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                            نقشه های راه برای شروع اصولی یادگیری
                        </p>
                    </div>
                </div>
                <!--section body-->
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10 text-white">
                    <div class="overflow-hidden rounded-2xl h-40">
                        <a href="search-categories.html?cat=frontend" data-value="frontend"
                           class="categories relative w-full h-full flex flex-col justify-center items-center gap-y-2.5 bg-gradient-to-r from-[#FFB535] to-[#F2295B]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" x="0" y="0" viewBox="0 0 66 66">
                                <path d="m58.08 10.05c1.31 0 2.37-1.06 2.37-2.37s-1.06-2.37-2.37-2.37-2.37 1.06-2.37 2.37 1.07 2.37 2.37 2.37zm0-3.05c.38 0 .69.31.69.69s-.31.69-.69.69c-.39 0-.69-.3-.69-.69s.31-.69.69-.69z"
                                      fill="#ffffff" data-original="#000000" class=""></path>
                                <path d="m60.71 1.48h-48.72c-1.85 0-3.36 1.51-3.36 3.36v5.13h-3.34c-1.85 0-3.36 1.51-3.36 3.36v42.13c0 1.85 1.51 3.36 3.36 3.36h22.33v4.86c0 .46.38.84.84.84h15.78c.46 0 .84-.38.84-.84v-4.86h8.93c1.85 0 3.36-1.51 3.36-3.36v-5.13h3.34c1.85 0 3.36-1.51 3.36-3.36v-42.13c0-1.85-1.51-3.36-3.36-3.36zm-50.4 3.36c0-.93.76-1.68 1.68-1.68h48.72c.93 0 1.68.76 1.68 1.68v7.37h-31.88l-3.75-3.89c-.29-.3-.69-.47-1.1-.47h-8.26c-.84 0-1.53.69-1.53 1.53v2.83h-5.56zm-5.02 52.31c-.93 0-1.68-.76-1.68-1.68v-42.14c0-.93.76-1.68 1.68-1.68h3.34v35.33c0 1.85 1.51 3.36 3.36 3.36h18.24c.33.64.48 1.36.42 2.1h-1.3c-.96 0-1.73.78-1.73 1.73v2.98zm30.23-17.59c.17-.3.48-.49.83-.49.52 0 .94.42.94.94 0 .34-.18.65-.47.82-.32.19-.7.17-1.09-.05-.05-.03-.1-.07-.12-.12-.32-.51-.19-.91-.09-1.1zm-.01-2.01c-.61.21-1.13.62-1.45 1.2-.48.86-.42 1.91.14 2.81.18.28.42.51.71.68.46.26.96.4 1.45.4.46 0 .91-.12 1.31-.35.8-.47 1.3-1.34 1.3-2.27 0-1.15-.75-2.12-1.78-2.47v-4.32l7.43 13.41c-.01.01-.02.03-.05.04-2.63.68-4.35 3.14-4.21 5.76h-8.01c.15-2.63-1.58-5.09-4.26-5.84l7.42-13.37zm7.89 25.29h-14.1l.05-8.73h14c.03 0 .05.02.05.05zm12.29-7.38c0 .93-.76 1.68-1.68 1.68h-8.93v-2.98c0-.96-.78-1.73-1.73-1.73h-1.3c-.06-.74.1-1.46.42-2.1h13.22zm5.02-6.8h-16.61c.27-.15.56-.28.88-.36.53-.14.96-.51 1.18-1.01.21-.49.18-1.04-.08-1.51l-8.6-15.49c-.22-.41-.65-.67-1.12-.67-.48.01-.91.25-1.14.66l-8.61 15.5c-.26.47-.28 1.03-.07 1.52.21.5.64.86 1.17 1 .32.08.6.21.88.36h-16.6c-.93 0-1.68-.76-1.68-1.68v-33.09h5.7c.84 0 1.53-.69 1.53-1.53v-2.83h8.05l3.75 3.89c.29.3.69.47 1.1.47h31.95v33.08c0 .93-.75 1.69-1.68 1.69z"
                                      fill="#ffffff" data-original="#000000" class=""></path>
                                <path d="m52.36 10.05c1.31 0 2.37-1.06 2.37-2.37s-1.06-2.37-2.37-2.37-2.37 1.06-2.37 2.37 1.06 2.37 2.37 2.37zm0-3.05c.38 0 .69.31.69.69s-.31.69-.69.69c-.39 0-.69-.3-.69-.69s.31-.69.69-.69z"
                                      fill="#ffffff" data-original="#000000" class=""></path>
                                <path d="m46.63 10.05c1.31 0 2.37-1.06 2.37-2.37s-1.06-2.37-2.37-2.37-2.37 1.06-2.37 2.37 1.06 2.37 2.37 2.37zm0-3.05c.38 0 .69.31.69.69s-.31.69-.69.69c-.39 0-.69-.3-.69-.69s.31-.69.69-.69z"
                                      fill="#ffffff" data-original="#000000" class=""></path>
                                <path d="m52.54 21.21c-.49.49-.8 1.11-.92 1.77h-11.75v-1.32c0-.9-.73-1.63-1.63-1.63h-3.79c-.9 0-1.63.73-1.63 1.63v1.32h-11.74c-.11-.65-.42-1.27-.92-1.78-1.27-1.25-3.44-1.23-4.68.01-.63.63-.97 1.46-.97 2.34 0 .89.35 1.73.97 2.34.63.65 1.47.98 2.34.98.55 0 1.11-.13 1.64-.4.57-.29 1.04-.77 1.32-1.36.07-.15.13-.3.18-.45h8.15c-4.43 2.16-7.77 6.22-8.93 11.12h-1.3c-.9 0-1.63.73-1.63 1.63v3.79c0 .9.73 1.63 1.63 1.63h3.79c.9 0 1.63-.73 1.63-1.63v-3.79c0-.9-.73-1.63-1.63-1.63h-.76c1.4-5.28 5.63-9.42 10.94-10.7v.36c0 .9.73 1.63 1.63 1.63h3.79c.9 0 1.63-.73 1.63-1.63v-.36c5.3 1.28 9.53 5.42 10.94 10.7h-.69c-.9 0-1.63.73-1.63 1.63v3.79c0 .9.73 1.63 1.63 1.63h3.79c.9 0 1.63-.73 1.63-1.63v-3.79c0-.9-.73-1.63-1.63-1.63h-1.37c-1.17-4.9-4.51-8.97-8.93-11.12h8.17c.16.46.42.88.77 1.23.63.65 1.47.98 2.34.98.55 0 1.11-.13 1.64-.4.57-.29 1.04-.77 1.32-1.36.65-1.37.42-2.86-.61-3.91-1.31-1.24-3.48-1.23-4.73.01zm-33.29 3.19c-.12.24-.32.45-.56.57-.87.44-1.62.16-2.03-.27-.31-.3-.48-.71-.48-1.15 0-.43.17-.84.48-1.16.31-.31.72-.48 1.16-.48.43 0 .85.17 1.15.47.52.54.62 1.29.28 2.02zm3.4 16.75-3.74.05-.05-3.74h3.74zm31.26 0-3.74.05-.05-3.74h3.74zm-19.4-15.7-.02-1.26c.02-.09.02-.18.01-.28v-.01c0-.03.02-.05.02-.08 0-.05-.02-.09-.03-.13l-.03-1.97h3.74l.03 1.97c-.01.05-.03.09-.03.14 0 .03.01.05.02.08v.01c-.02.13-.01.25.02.36l.02 1.13zm21.81-1.05c-.12.24-.32.45-.56.57-.87.44-1.62.16-2.03-.27-.31-.3-.48-.71-.48-1.15 0-.43.17-.84.48-1.16.31-.31.72-.48 1.16-.48.43 0 .85.17 1.15.47.52.54.62 1.29.28 2.02z"
                                      fill="#ffffff" data-original="#000000"></path>
                            </svg>
                            <span class="font-danaDemiBold text-2xl">
                            فرانت اند
                        </span>
                            <span class="categories--courses-count absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white dark:bg-darkGray-800 font-danaMedium text-center text-zinc-700 dark:text-white">0</span>
                        </a>
                    </div>
                    <div class="overflow-hidden rounded-2xl h-40">
                        <a href="search-categories.html?cat=security" data-value="security"
                           class="categories relative w-full h-full flex flex-col justify-center items-center gap-y-2.5 bg-gradient-to-r from-[#30C4EB] to-[#27E55C]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" x="0" y="0"
                                 viewBox="0 0 512.001 512.001">
                                <path d="M466.395,88.411C395.95,69.109,325.091,39.054,261.478,1.496c-3.379-1.995-7.572-1.995-10.95,0
                        C185.08,40.133,118.05,68.562,45.605,88.411c-4.68,1.281-7.924,5.535-7.924,10.388v110.046
                        c0,113.323,52.279,188.335,96.137,231.306c47.216,46.265,102.216,71.85,122.185,71.85c19.967,0,74.967-25.585,122.183-71.85
                        c43.857-42.97,96.133-117.982,96.133-231.306V98.798C474.319,93.946,471.075,89.692,466.395,88.411z M452.779,208.844
                        c0,105.843-48.761,175.838-89.669,215.92c-46.431,45.495-96.074,65.695-107.107,65.695c-11.033,0-60.679-20.2-107.111-65.695
                        c-40.907-40.083-89.67-110.077-89.67-215.92V106.974C128.5,87.304,193.018,59.853,256.005,23.25
                        c61.414,35.632,129.151,64.448,196.774,83.72V208.844z" fill="#ffffff"
                                      data-original="#000000"></path>
                                <path d="M160.538,105.769c-2.18-5.535-8.433-8.254-13.969-6.073c-19.24,7.581-38.988,14.559-58.695,20.741
                        c-4.491,1.41-7.547,5.57-7.547,10.276v41.591c0,5.948,4.823,10.77,10.77,10.77s10.77-4.822,10.77-10.77v-33.72
                        c17.679-5.72,35.339-12.047,52.598-18.848C160,117.557,162.719,111.304,160.538,105.769z"
                                      fill="#ffffff" data-original="#000000"></path>
                                <path d="M180.997,107.812c1.445,0,2.912-0.291,4.319-0.905l0.198-0.086c5.449-2.388,7.903-8.731,5.515-14.178
                        c-2.39-5.449-8.769-7.914-14.212-5.528l-0.174,0.075c-5.452,2.381-7.914,8.719-5.533,14.169
                        C172.877,105.405,176.842,107.812,180.997,107.812z" fill="#ffffff"
                                      data-original="#000000"></path>
                                <path d="M384.322,347.283c-4.977-3.253-11.651-1.854-14.908,3.125c-8.875,13.584-19.287,26.592-30.951,38.659
                        c-9.592,9.922-19.986,19.17-30.893,27.485c-4.729,3.606-5.639,10.364-2.034,15.095c2.121,2.779,5.328,4.241,8.572,4.241
                        c2.278,0,4.573-0.719,6.523-2.207c11.765-8.971,22.975-18.944,33.317-29.642c12.611-13.044,23.881-27.124,33.499-41.849
                        C390.702,357.21,389.301,350.536,384.322,347.283z" fill="#ffffff" data-original="#000000"></path>
                                <path d="M282.558,433.443l-0.618,0.364c-5.147,2.981-6.906,9.569-3.926,14.716c1.997,3.45,5.612,5.376,9.331,5.376
                        c1.83,0,3.688-0.467,5.385-1.452l0.713-0.419c5.133-3.006,6.857-9.603,3.851-14.736
                        C294.286,432.161,287.688,430.44,282.558,433.443z" fill="#ffffff" data-original="#000000"></path>
                                <path d="M182.589,234.019c-6.613-6.614-15.408-10.254-24.762-10.254s-18.15,3.641-24.766,10.254
                        c-13.653,13.656-13.653,35.876,0,49.531l63.596,63.594c6.614,6.612,15.409,10.253,24.764,10.253s18.15-3.641,24.765-10.255
                        L378.947,214.38c13.652-13.659,13.652-35.876-0.002-49.527c-6.614-6.614-15.409-10.254-24.765-10.254
                        c-9.355,0-18.15,3.641-24.765,10.254L221.42,272.848L182.589,234.019z M344.647,180.085c2.545-2.545,5.932-3.946,9.534-3.946
                        c3.604,0,6.988,1.401,9.535,3.946c5.255,5.255,5.255,13.809-0.002,19.066l-132.759,132.76c-2.545,2.545-5.932,3.946-9.534,3.946
                        s-6.989-1.401-9.535-3.946l-63.594-63.592c-5.257-5.257-5.257-13.811-0.002-19.066c2.546-2.545,5.933-3.948,9.536-3.948
                        s6.988,1.401,9.533,3.946l46.445,46.446c2.021,2.019,4.759,3.154,7.616,3.154s5.595-1.134,7.614-3.154L344.647,180.085z"
                                      fill="#ffffff" data-original="#000000"></path>
                            </svg>
                            <span class="font-danaDemiBold text-2xl">
                            امنیت
                        </span>
                            <span class="categories--courses-count absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white dark:bg-darkGray-800 font-danaMedium text-center text-zinc-700 dark:text-white">0</span>
                        </a>
                    </div>
                    <div class="overflow-hidden rounded-2xl h-40">
                        <a href="search-categories.html?cat=python" data-value="python"
                           class="categories relative w-full h-full flex flex-col justify-center items-center gap-y-2.5 bg-gradient-to-r from-[#9C33F7] to-[#2B9FFF]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" x="0" y="0" viewBox="0 0 64 64">
                                <circle cx="29" cy="14" r="2" fill="#ffffff" data-original="#000000"></circle>
                                <path d="m52 21h-6v-9c0-2.757-2.243-5-5-5h-14c-2.757 0-5 2.243-5 5v7h-10c-2.757 0-5 2.243-5 5v14c0 2.757 2.243 5 5 5h6v9c0 2.757 2.243 5 5 5h14c2.757 0 5-2.243 5-5v-7h10c2.757 0 5-2.243 5-5v-14c0-2.757-2.243-5-5-5zm-43 17v-14c0-1.654 1.346-3 3-3h22c1.323 0 1.324-2 0-2h-10v-7c0-1.654 1.346-3 3-3h14c1.654 0 3 1.346 3 3v16c0 1.654-1.346 3-3 3h-18c-2.757 0-5 2.243-5 5v5h-6c-1.654 0-3-1.346-3-3zm46 2c0 1.654-1.346 3-3 3h-22c-1.323 0-1.324 2 0 2h10v7c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-10-6c0-1.654 1.346-3 3-3h18c2.757 0 5-2.243 5-5v-5h6c1.654 0 3 1.346 3 3z"
                                      fill="#ffffff" data-original="#000000" class=""></path>
                                <circle cx="35" cy="50" r="2" fill="#ffffff" data-original="#000000"></circle>
                            </svg>
                            <span class="font-danaDemiBold text-2xl">
                            پایتون
                        </span>
                            <span class="categories--courses-count absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white dark:bg-darkGray-800 font-danaMedium text-center text-zinc-700 dark:text-white">0</span>
                        </a>
                    </div>
                    <div class="overflow-hidden rounded-2xl h-40">
                        <a href="search-categories.html?cat=softskills" data-value="softskills"
                           class="categories relative w-full h-full flex flex-col justify-center items-center gap-y-2.5 bg-gradient-to-r from-[#FF3571] to-[#870075]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" x="0" y="0"
                                 viewBox="0 0 511.999 511.999">
                                <path d="M502.044,227.555l-62.141-62.141c13.191-3.238,25.727-9.909,36.022-20.211c15.054-15.047,22.615-34.848,22.61-54.566
                            c0.007-19.719-7.556-39.524-22.603-54.566c-15.048-15.061-34.854-22.615-54.573-22.609c-19.724-0.007-39.524,7.556-54.566,22.609
                            c-10.3,10.288-16.973,22.824-20.216,36.01L284.448,9.953c-6.639-6.634-15.42-9.96-24.099-9.953
                            c-8.685-0.007-17.477,3.32-24.106,9.953l-91.383,91.402c-3.699,3.699-3.699,9.682,0,13.381l10.945,10.951
                            c2.241,2.241,5.435,3.213,8.546,2.594c2.96-0.588,5.965-0.884,8.976-0.884c11.778,0.013,23.461,4.463,32.474,13.45
                            c8.976,8.981,13.425,20.666,13.438,32.443c-0.012,11.796-4.463,23.506-13.45,32.499c-8.988,8.981-20.684,13.438-32.475,13.444
                            c-11.784-0.007-23.486-4.463-32.468-13.444c-8.994-9.001-13.444-20.684-13.45-32.468c-0.007-3.017,0.29-6.016,0.883-8.956
                            c0.618-3.105-0.359-6.318-2.588-8.553l-10.957-10.951c-3.698-3.693-9.689-3.693-13.388,0.007L9.957,236.26
                            c-6.634,6.627-9.96,15.413-9.948,24.099c-0.013,8.679,3.314,17.472,9.953,24.099l62.127,62.127
                            c-13.191,3.245-25.721,9.916-36.022,20.223c-15.047,15.034-22.61,34.841-22.596,54.56c-0.013,19.712,7.542,39.524,22.603,54.573
                            c15.047,15.054,34.854,22.609,54.578,22.596c19.712,0.012,39.512-7.556,54.548-22.603c10.3-10.3,16.978-22.836,20.216-36.022
                            l62.127,62.134c6.641,6.634,15.42,9.96,24.106,9.953c8.685,0.007,17.465-3.32,24.092-9.948l91.39-91.39
                            c3.693-3.698,3.693-9.689,0-13.388l-10.945-10.951c-2.234-2.234-5.428-3.206-8.54-2.594c-2.96,0.593-5.971,0.883-8.988,0.883
                            c-11.784-0.012-23.474-4.456-32.462-13.438c-8.988-8.994-13.438-20.684-13.444-32.474c0.007-11.784,4.463-23.486,13.444-32.481
                            c8.988-8.981,20.684-13.432,32.481-13.444c11.784,0.012,23.481,4.469,32.475,13.45c8.981,8.994,13.432,20.684,13.438,32.468
                            c0.007,3.004-0.297,6.016-0.884,9.001c-0.606,3.105,0.36,6.274,2.601,8.514l10.945,10.951c1.755,1.761,4.198,2.771,6.697,2.771
                            c2.493,0,4.929-1.009,6.697-2.771l91.395-91.402c6.641-6.634,9.96-15.42,9.948-24.099
                            C511.997,242.968,508.671,234.183,502.044,227.555z M488.649,262.372l-84.693,84.687l-0.903-0.903
                            c0.284-2.48,0.48-4.973,0.48-7.48c0.007-16.562-6.35-33.213-18.993-45.855s-29.3-19.005-45.862-18.998
                            c-16.569-0.007-33.225,6.35-45.868,18.993c-12.649,12.649-19.005,29.306-18.998,45.875c-0.007,16.562,6.35,33.22,18.998,45.862
                            c12.637,12.643,29.293,18.998,45.85,18.986c2.5,0,4.993-0.183,7.485-0.473l0.903,0.903l-84.693,84.687
                            c-2.941,2.941-6.772,4.393-10.705,4.406c-3.939-0.013-7.77-1.464-10.718-4.406l-75.989-75.995
                            c-2.733-2.733-6.823-3.534-10.383-2.026c-3.553,1.496-5.832,4.993-5.782,8.849c0.013,0.733,0.025,1.376,0.025,1.912
                            c-0.012,14.946-5.624,29.767-16.998,41.153c-11.393,11.387-26.232,17.049-41.153,17.054c-14.946-0.007-29.798-5.655-41.192-17.049
                            c-11.399-11.399-17.042-26.245-17.054-41.178c0.012-14.934,5.669-29.78,17.049-41.166c11.387-11.387,26.2-16.985,41.153-16.998
                            c0.588,0,1.181,0.012,1.767,0.032c3.882,0.113,7.436-2.146,8.976-5.713c1.54-3.567,0.745-7.701-1.995-10.446l-76.001-75.995
                            c-2.941-2.948-4.393-6.779-4.406-10.711c0.012-3.939,1.464-7.77,4.399-10.711l84.699-84.693l0.896,0.896
                            c-0.284,2.493-0.48,4.987-0.48,7.485c-0.007,16.562,6.356,33.213,18.998,45.855c12.637,12.643,29.293,19.005,45.862,18.993
                            c16.569,0.012,33.225-6.35,45.862-18.993c12.655-12.655,19.011-29.325,18.998-45.894c0.012-16.562-6.356-33.2-18.986-45.83
                            c-12.655-12.649-29.306-19.011-45.862-18.998c-2.5,0-4.993,0.189-7.485,0.48l-0.903-0.903l84.699-84.699
                            c2.941-2.935,6.772-4.393,10.711-4.406c3.927,0.012,7.763,1.464,10.711,4.412l75.995,75.995c2.751,2.752,6.943,3.541,10.497,1.976
                            c3.56-1.559,5.819-5.169,5.662-9.057c-0.025-0.511-0.037-1.067-0.037-1.666c0.019-14.94,5.624-29.76,16.998-41.147
                            c11.393-11.387,26.239-17.049,41.172-17.054c14.928,0.007,29.78,5.655,41.172,17.054s17.049,26.239,17.054,41.172
                            c-0.007,14.928-5.662,29.78-17.054,41.172c-11.393,11.375-26.207,16.973-41.153,16.985c-0.593,0-1.181-0.007-1.761-0.025
                            c-3.882-0.113-7.436,2.146-8.976,5.713c-1.54,3.567-0.751,7.701,1.995,10.446l76.001,76.001c2.941,2.941,4.399,6.772,4.412,10.711
                            C493.049,255.593,491.591,259.424,488.649,262.372z" fill="#ffffff"
                                      data-original="#000000"></path>
                            </svg>
                            <span class="font-danaDemiBold text-2xl">
                            مهارت های نرم
                        </span>
                            <span class="categories--courses-count absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-white dark:bg-darkGray-800 font-danaMedium text-center text-zinc-700 dark:text-white">0</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!--about section-->
        <section class="mt-[100px]">
            <div class="container">
                <!--section header-->
                <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                    <div class="self-start">
                    <span class="section--title section--title__about">
                        ما چه کمکی بهتون میکنیم؟
                    </span>
                        <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                            از اونجایی که آکادمی آموزشی سبزلرن یک آکادمی خصوصی هست
                        </p>
                    </div>
                </div>
                <!--section body-->
                <div class="grid md:grid-cols-2 gap-5 mt-10">
                    <div class="flex justify-center xs:justify-start items-center flex-wrap xs:flex-nowrap text-center xs:text-right gap-6 shadow-light dark:shadow-none bg-white dark:bg-darkGray-800 dark:border border-gray-700 rounded-2xl p-5">
                        <!--circle-->
                        <div class="about--items-circles about--items-circles__blue"></div>
                        <div class="space-y-2.5">
                        <span class="font-danaDemiBold text-xl text-zinc-700 dark:text-white">
                            دوره های اختصاصی
                        </span>
                            <p class="font-thin text-darkSlate dark:text-slate-400 lg:pl-5">
                                با پشتیبانی و کیفیت بالا ارائه میده. چون خوش نام بودن نام برند و منافع مشتری و حفظ شان دیگر
                                همکارانش براش مهمه
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-center xs:justify-start items-center flex-wrap xs:flex-nowrap text-center xs:text-right gap-6 shadow-light dark:shadow-none bg-white dark:bg-darkGray-800 dark:border border-gray-700 rounded-2xl p-5">
                        <!--circle-->
                        <div class="about--items-circles about--items-circles__green"></div>
                        <div class="space-y-2.5">
                        <span class="font-danaDemiBold text-xl text-zinc-700 dark:text-white">
                            اجازه تدریس
                        </span>
                            <p class="font-thin text-darkSlate dark:text-slate-400 lg:pl-5">
                                به هر مدرسی رو نمیده و فقط فقط با مدرسای سینیور و مید لول وارد همکاری میشه چون کیفیت براش
                                مهمه
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-center xs:justify-start items-center flex-wrap xs:flex-nowrap text-center xs:text-right gap-6 shadow-light dark:shadow-none bg-white dark:bg-darkGray-800 dark:border border-gray-700 rounded-2xl p-5">
                        <!--circle-->
                        <div class="about--items-circles about--items-circles__yellow"></div>
                        <div class="space-y-2.5">
                        <span class="font-danaDemiBold text-xl text-zinc-700 dark:text-white">
                            دوره پولی یا رایگان
                        </span>
                            <p class="font-thin text-darkSlate dark:text-slate-400 lg:pl-5">
                                براش مهم نیست. به مدرسینش بهترین مزایا و دستمزد رو میده تا نهایت کیفیت رو در پشتیبانی و
                                اپدیت دوره ارائه بده
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-center xs:justify-start items-center flex-wrap xs:flex-nowrap text-center xs:text-right gap-6 shadow-light dark:shadow-none bg-white dark:bg-darkGray-800 dark:border border-gray-700 rounded-2xl p-5">
                        <!--circle-->
                        <div class="about--items-circles about--items-circles__red"></div>
                        <div class="space-y-2.5">
                        <span class="font-danaDemiBold text-xl text-zinc-700 dark:text-white">
                            دوره های اختصاصی
                        </span>
                            <p class="font-thin text-darkSlate dark:text-slate-400 lg:pl-5">
                                با پشتیبانی و کیفیت بالا ارائه میده. چون خوش نام بودن نام برند و منافع مشتری و حفظ شان دیگر
                                همکارانش براش مهمه
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!--newest courses-->
        <section class="mt-[100px]">
            <div class="container">
                <div class="swiper">
                    <!--section header-->
                    <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                        <div class="self-start">
                    <span class="section--title section--title__newest-courses">
                        جدیدترین دوره ها
                    </span>
                            <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                                یادگیری و رشد توسعه فردی
                            </p>
                        </div>
                        <div class="self-end flex justify-end items-center gap-4">
                            <button class="swiper-button-prev w-11 h-11 group bg-gray-200 hover:bg-white dark:bg-darkGray-800 text-slate-500 hover:text-zinc-700 dark:text-gray-200 dark:hover:bg-darkSlate rounded-full transition-colors">
                                <svg class="w-full h-7 dark:opacity-40 dark:group-hover:opacity-100">
                                    <use href="#chevron-right"></use>
                                </svg>
                            </button>
                            <button class="swiper-button-next w-11 h-11 group bg-gray-200 hover:bg-white dark:bg-darkGray-800 text-slate-500 hover:text-zinc-700 dark:text-gray-200 dark:hover:bg-darkSlate rounded-full transition-colors">
                                <svg class="w-full h-7 dark:opacity-40 dark:group-hover:opacity-100">
                                    <use href="#chevron-left"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <!--section body-->
                    <div class="newest-courses--wrapper swiper-wrapper items-stretch mt-10">

                    </div>
                </div>
            </div>
        </section>
        <!--articles-->
        <section class="mt-[100px]">
            <div class="container">
                <!--section header-->
                <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5 mb-10">
                    <div class="self-start">
                    <span class="section--title section--title__articles">
                        آخرین مقالات
                    </span>
                        <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                            مقالات بروز برنامه نویسی
                        </p>
                    </div>
                    <div class="self-end">
                        <a href="search-categories-articles.html"
                           class="font-danaMedium flex justify-end items-center gap-x-0.5 rounded-xl px-2.5 py-2 text-sky-500 hover:bg-sky-500/10 dark:text-secondary dark:hover:bg-secondary/10 transition-colors">
                            مشاهده همه مقالات
                            <svg class="w-5 h-5">
                                <use href="#mini-arrow-left"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <!--section body-->
                <div class="published-articles--wrapper grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <!--each item-->

                </div>
            </div>
        </section>
        <!--instagram page section-->
        <section class="mt-[100px]">
            <div class="container">
                <div class="instagram--section">
                    <!--section content-->
                    <div class="space-y-4">
                        <h5 class="font-morabbaBold text-4xl/[58px]">
                            پیج اینستاگرام آکادمی سبزلرن
                        </h5>
                        <p class="text-lg">
                            اطلاع رسانی تخفیف ها، آموزش های رایگان و نکات کاربردی و لایو های هفتگی
                        </p>
                    </div>
                    <!--section link-->
                    <a href="https://instagram.com/sabzlearn_"
                       class="inline-flex items-center shrink-0 bg-white/30 hover:bg-transparent text-base h-12 px-4 gap-x-0.5 rounded-xl sm:text-[#502ED6] hover:text-white sm:bg-white border border-transparent hover:border-white transition-colors">
                    <span class="font-danaMedium">
                        دیدن پست ها
                    </span>
                        <svg class="w-5 h-5">
                            <use href="#chevron-left"></use>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
        <!--presale section-->
        <section class="mt-[100px]">
            <div class="container">
                <div class="swiper">
                    <!--section header-->
                    <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                        <div class="self-start">
                    <span class="section--title section--title__newest-courses">
                        در حال پیش فروش
                    </span>
                            <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                                دوره هایی که قراره برگزار بشن
                            </p>
                        </div>
                        <div class="self-end flex justify-end items-center gap-4">
                            <button class="swiper-button-prev w-11 h-11 group bg-gray-200 hover:bg-white dark:bg-darkGray-800 text-slate-500 hover:text-zinc-700 dark:text-gray-200 dark:hover:bg-darkSlate rounded-full transition-colors">
                                <svg class="w-full h-7 dark:opacity-40 dark:group-hover:opacity-100">
                                    <use href="#chevron-right"></use>
                                </svg>
                            </button>
                            <button class="swiper-button-next w-11 h-11 group bg-gray-200 hover:bg-white dark:bg-darkGray-800 text-slate-500 hover:text-zinc-700 dark:text-gray-200 dark:hover:bg-darkSlate rounded-full transition-colors">
                                <svg class="w-full h-7 dark:opacity-40 dark:group-hover:opacity-100">
                                    <use href="#chevron-left"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <!--section body-->
                    <div class="pre-sale-courses--wrapper swiper-wrapper items-stretch mt-10">

                    </div>
                </div>
            </div>
        </section>
        <!--most popular courses section-->
        <section class="mt-[88px] sm:mt-40">
            <div class="container">
                <!--section header-->
                <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-5">
                    <div class="self-start">
                    <span class="section--title section--title__newest-courses">
                        محبوب ترین دوره ها
                    </span>
                        <p class="mt-2.5 text-slate-500 dark:text-slate-400 sm:text-xl">
                            پرمخاطب ترین و بهترین دوره های سبزلرن
                        </p>
                    </div>
                    <div class="self-end">
                        <a href="/courses"
                           class="font-danaMedium flex justify-end items-center gap-x-0.5 rounded-xl px-2.5 py-2 text-sky-500 hover:bg-sky-500/10 dark:text-secondary dark:hover:bg-secondary/10 transition-colors">
                            مشاهده همه دوره ها
                            <svg class="w-5 h-5">
                                <use href="#mini-arrow-left"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <!--section body-->
                <div class="popular-courses--wrapper mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                </div>
            </div>
        </section>
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

    renderShared(user, headerMenus)
    renderFooter(popularCourses)

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
}