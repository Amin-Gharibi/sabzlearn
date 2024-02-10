import {
    addSearchParam,
    clearSearchParams, getAllCategories,
    getCourses,
    getSearchParam,
    removeSearchParam, searchFormSubmissionHandler,
    showCourseCategories,
    showCoursesBasedOnUrl,
} from "./utils/utils.js";
import {renderSharedCategoriesPages, toggleMobileSortingMenu} from "./shared/shared-categories-pages.js";
import {sortingButtonsClickHandler} from "./shared/shared-between-teacher-and-categories-page.js";
import {renderShared, sharedFetches} from "./shared/shared.js";
import {footerFetches, renderFooter} from "./shared/footer.js";


document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
})

const fetchData = async () => {
    try {
        const courses = await getCourses();
        const [courseCategories, {user, headerMenus}, popularCourses] = await Promise.all([
            getAllCategories(),
            sharedFetches(),
            footerFetches()
        ])

        await renderPage(courses, courseCategories, user, headerMenus, popularCourses);
    } catch (error) {
        console.log("Error Handling: ", error)
    }
}

const renderPage = async (courses, courseCategories, user, headerMenus, popularCourses) => {
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
        <!--content header-->
        <div class="flex justify-center items-center gap-x-3 sm:gap-x-5 mt-[60px] text-black dark:text-white font-morabbaBold text-4xl sm:text-6xl whitespace-nowrap">
            <span class="w-7 sm:w-10 h-2.5 bg-rose-500 shrink-0 rounded-sm"></span>
            <h2 class="page-title w-min">
                ${(getSearchParam('cat') || getSearchParam('s')) && ((getSearchParam('s') && `جستجو: ${getSearchParam('s')}`) || (courseCategories.find(category => category.name === getSearchParam('cat'))?.title || getSearchParam('cat'))) || 'دوره ها'}
            </h2>
        </div>
        <!--content body-->
        <div class="grid items-start grid-rows-1 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 mt-9 sm:mt-[100px]">
            <!--side content in desktop size and categories and special filtering-->
            <aside class="lg:sticky top-5">
                <form class="search-cat-form space-y-5">
                    <!--search box-->
                    <div class="relative h-[68px] flex items-center bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                        <input type="text"
                               class="w-[calc(100%-55px)] h-full pr-7 bg-transparent text-sm text-zinc-700 dark:text-white outline-0 placeholder-slate-500 dark:placeholder-darkGray-500"
                               placeholder="در بین دوره ها جستجو کنید">
                        <button class="absolute top-0 bottom-0 left-6 my-auto">
                            <svg class="w-7 h-7 text-slate-500 dark:text-darkGray-500">
                                <use href="#magnifying-glass"></use>
                            </svg>
                        </button>
                    </div>
                    <!--course categories-->
                    <div id="course-categories-section" class="hidden sm:block px-7 py-6 bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl">
                        <span class="inline-block mb-5 font-danaDemiBold text-lg dark:text-white">
                            دسته بندی دوره ها
                        </span>
                        <!--items-->
                        <div class="course-categories--wrapper space-y-3.5">
                            <!--each item-->

                        </div>
                    </div>
                    <!--special filtering-->
                    <div class="hidden sm:grid grid-cols-2 lg:grid-cols-1 gap-5">
                        <div class="h-[68px] flex justify-between items-center px-7 py-[18px] bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl">
                            <span class="text-sm dark:text-white select-none">
                                فقط دوره های رایگان
                            </span>
                            <!--toggle-->
                            <label class="relative cursor-pointer">
                                <input type="checkbox" class="filtering--special-items__input absolute w-0 h-0 opacity-0" data-value="only_free">
                                <span class="filtering--special-items__toggle"></span>
                            </label>
                        </div>
                        <div class="h-[68px] flex justify-between items-center px-7 py-[18px] bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl">
                            <span class="text-sm dark:text-white select-none">
                                در حال پیش فروش
                            </span>
                            <!--toggle-->
                            <label class="relative cursor-pointer">
                                <input type="checkbox" class="filtering--special-items__input absolute w-0 h-0 opacity-0" data-value="presale">
                                <span class="filtering--special-items__toggle"></span>
                            </label>
                        </div>
                        <div class="h-[68px] flex justify-between items-center px-7 py-[18px] bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl">
                            <span class="text-sm dark:text-white select-none">
                                دوره های خریداری شده
                            </span>
                            <!--toggle-->
                            <label class="relative cursor-pointer">
                                <input type="checkbox" class="filtering--special-items__input absolute w-0 h-0 opacity-0" data-value="enrolled">
                                <span class="filtering--special-items__toggle"></span>
                            </label>
                        </div>
                    </div>
                </form>
            </aside>
            <!--main content and filtering data and show more courses-->
            <div class="col-span-1 lg:col-span-2 xl:col-span-3 order-1 lg:order-2">
                <!--filtering data in mobile size-->
                <div class="flex sm:hidden items-center gap-3.5 mb-7">
                    <div class="mobile-filter-btn flex justify-center items-center gap-x-2 w-1/2 py-2 px-4 bg-white dark:bg-darkGray-800 text-sm text-zinc-700 dark:text-white rounded-xl select-none">
                        <svg class="w-6 h-6 text-darkGray-500">
                            <use href="#adjustments"></use>
                        </svg>
                        <span>
                                فیلتر
                        </span>
                    </div>
                    <div class="mobile-sort-btn flex justify-center items-center gap-x-2 w-1/2 py-2 px-4 bg-white dark:bg-darkGray-800 text-sm text-zinc-700 dark:text-white rounded-xl select-none">
                        <svg class="w-6 h-6 text-darkGray-500">
                            <use href="#sort"></use>
                        </svg>
                        <span id="sorted-title">
                                همه دوره ها
                        </span>
                    </div>
                </div>
                <!--filtering data in big sizes-->
                <div class="relative h-[68px] hidden sm:flex justify-center lg:justify-start items-center gap-4 mb-5 p-7 bg-white dark:bg-darkGray-800 text-sm dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                    <!--title-->
                    <div class="flex items-center gap-x-2.5 shrink-0 dark:text-white">
                        <svg class="w-5 h-5">
                            <use href="#sort"></use>
                        </svg>
                        <span>
                                مرتب سازی:
                        </span>
                    </div>
                    <!--options-->
                    <div class="sorting-data">
                        <button class="active py-2.5 px-4 text-slate-500 rounded-[8px]" data-value="default">
                            همه دوره ها
                        </button>
                        <button class="py-2.5 px-4 text-slate-500 rounded-[8px]" data-value="cheapest">
                            ارزان ترین
                        </button>
                        <button class="py-2.5 px-4 text-slate-500 rounded-[8px]" data-value="expensive">
                            گران ترین
                        </button>
                        <button class="py-2.5 px-4 text-slate-500 rounded-[8px]" data-value="popular">
                            پرمخاطب ها
                        </button>
                    </div>
                </div>
                <!--filtered courses-->
                <div class="filtered-courses--wrapper grid grid-rows-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                </div>
                <!--show more courses-->
                <div class="show-more hidden justify-center items-center w-52 h-14 mt-10 mx-auto bg-gray-200 dark:bg-darkGray-700 text-xl dark:text-white rounded-full cursor-pointer transition-colors">
                    <div class="show-more__content space-x-2">
                        <span>مشاهده بیشتر</span>
                        <svg class="w-5 h-5 inline">
                            <use href="#chevron-down"></use>
                        </svg>
                    </div>
                    <svg class="show-more__loading w-6 h-6 animate-spin text-white dark:text-darkGray-600 fill-zinc-700 dark:fill-white hidden"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"></path>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"></path>
                    </svg>
                </div>
                <!--all courses have been shown-->
                <div class="all-courses__loaded dark:text-white mt-7 text-center leading-7 hidden">
                    تمام دوره ها نمایش داده شده است
                </div>
                <!--there is no course with this filters-->
                <div class="no-course-with-filter dark:text-white mt-7 text-center leading-7 hidden">
                    هیچ دوره ای با این مشخصات یافت نشد!
                </div>
            </div>
        </div>
    </div>
    <!-- bottom sheet -->
    <div class="bottom-sheet">
        <div class="flex gap-x-3 rounded-t-2xl bg-gray-100 dark:bg-darkGray-700 dark:text-white p-6 pb-5">
            <button class="bottom-sheet--close-btn flex justify-center items-center text-darkGray-500">
                <svg class="w-6 h-6">
                    <use href="#x-mark"></use>
                </svg>
            </button>
            <span class="font-danaDemiBold text-lg">مرتب سازی بر اساس</span>
        </div>
        <div class="sorting-data mobile-sorting-data px-6 bg-white dark:bg-darkGray-800 divide-y-[1px] dark:divide-darkSlate">
            <button class="bottom-sheet__item w-full bottom-sheet__item--selected" data-value="default">
                <span>
                    همه دوره ها
                </span>
                <svg class="w-5 h-5">
                    <use href="#check"></use>
                </svg>
            </button>
            <button class="bottom-sheet__item w-full" data-value="cheapest">
                <span>
                    ارزان ترین
                </span>
                <svg class="w-5 h-5">
                    <use href="#check"></use>
                </svg>
            </button>
            <button class="bottom-sheet__item w-full" data-value="expensive">
                <span>
                    گران ترین
                </span>
                <svg class="w-5 h-5">
                    <use href="#check"></use>
                </svg>
            </button>
            <button class="bottom-sheet__item w-full" data-value="popular">
                <span>
                    پرمخاطب ها
                </span>
                <svg class="w-5 h-5">
                    <use href="#check"></use>
                </svg>
            </button>
        </div>
    </div>
    <!-- mobile filtering -->
    <div class="mobile-filter">
        <div class="flex justify-between items-center p-6 pb-5 bg-gray-100 dark:bg-darkGray-700">
            <div class="flex items-center gap-x-3">
                <button class="filter__close-btn flex items-center justify-center text-gray-500">
                    <svg class="w-6 h-6">
                        <use href="#x-mark"></use>
                    </svg>
                </button>
                <span class="font-danaDemiBold text-lg text-zinc-700 dark:text-white">فیلتر</span>
            </div>
            <button id="clear-all-filters" class="flex items-center gap-x-1.5 px-3 py-1.5 text-sm bg-pink-500/10 text-pink-500 dark:bg-red-500/10 dark:text-red-500 rounded-xl">
                <svg class="w-5 h-5">
                    <use href="#trash"></use>
                </svg>
                حذف فیلتر ها
            </button>
        </div>
        <form class="search-cat-form px-6 divide-y-[1px] dark:divide-darkGray-700" id="filter_mobile">
            <label class="relative select-none cursor-pointer w-full flex items-center justify-between py-5">
                <span class="text-sm text-zinc-700 dark:text-white select-none">فقط دوره های رایگان</span>
                <input class="filtering--special-items__input absolute w-0 h-0 opacity-0" type="checkbox" data-value="only_free">
                <span class="filtering--special-items__toggle"></span>
            </label>
            <label class="relative select-none cursor-pointer w-full flex items-center justify-between py-5">
                <span class="text-sm text-zinc-700 dark:text-white select-none">در حال پیش فروش</span>
                <input class="filtering--special-items__input absolute w-0 h-0 opacity-0" type="checkbox" data-value="presale">
                <span class="filtering--special-items__toggle"></span>
            </label>
            <label class="relative select-none cursor-pointer w-full flex items-center justify-between py-5">
                <span class="text-sm text-zinc-700 dark:text-white select-none">دوره ها خریداری شده</span>
                <input class="filtering--special-items__input absolute w-0 h-0 opacity-0" type="checkbox" data-value="enrolled">
                <span class="filtering--special-items__toggle"></span>
            </label>
            <div class="category">
                <div class="category-mobile__header flex items-center justify-between py-5">
                    <span class="text-sm text-zinc-700 dark:text-white select-none">دسته بندی دوره ها</span>
                    <svg class="w-5 h-5 text-darkGray-500 dark:text-white transition-all">
                        <use href="#chevron-down"></use>
                    </svg>
                </div>
                <div class="category-mobile__body pb-5 space-y-3.5">

                </div>
            </div>
        </form>
        <div class="flex h-full items-end mt-6 p-6">
            <button class="apply-mobile-filters w-full py-2.5 bg-primary font-danaDemiBold text-lg text-center text-white rounded-xl select-none">
                اعمال فیلتر ها
            </button>
        </div>
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

    renderShared(user, headerMenus);
    renderSharedCategoriesPages();
    renderFooter(popularCourses);

    // set page title handling
    if (getSearchParam('cat') || getSearchParam('s')) {
        const categoriesWrapper = document.querySelector('.course-categories--wrapper')
        // const pageTitle = document.querySelector('.page-title')
        categoriesWrapper.classList.remove('sm:block')
        // change page title
        // pageTitle.innerHTML = (getSearchParam('s') && `جستجو: ${getSearchParam('s')}`) || (courseCategories.find(category => category.name === getSearchParam('cat'))?.title || getSearchParam('cat'))
        if (getSearchParam('s')) {
            const searchInput = document.querySelector('.search-cat-form input:first-child')
            searchInput.value = getSearchParam('s')
        }

        if (getSearchParam('cat') && !getSearchParam('s')) {
            const courseCategoriesSection = document.querySelector('#course-categories-section')
            courseCategoriesSection.classList.remove('sm:block')
        }
    }

    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    let shownCoursesCount = 12
    showCourseCategories(courseCategories)
    await showCoursesBasedOnUrl(courses, shownCoursesCount)

    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')

    // sort the courses as soon as uer clicks on each sorting button
    desktopSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn, courses, shownCoursesCount))
    })
    mobileSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn, courses, shownCoursesCount))
    })

    // activate category checkboxes and lower filters on page loading
    const courseCategoryCheckboxes = document.querySelectorAll('.course-categories--wrapper input')
    courseCategories.forEach((category, index) => {
        if (getSearchParam(`filter${index + 1}`) && getSearchParam(`filter${index + 1}`) === 'yes') {
            courseCategoryCheckboxes[index].checked = true
        }
    })
    const courseLowerAsideFilters = document.querySelectorAll('.filtering--special-items__input')
    courseLowerAsideFilters.forEach(filter => {
        if (getSearchParam(filter.getAttribute('data-value')) && getSearchParam(filter.getAttribute('data-value')) === 'yes') {
            filter.checked = true
        }
    })

    // activate category checkboxes as soon as user clicks on each of them
    const searchCategorizeForms = document.querySelectorAll('.search-cat-form')
    for (const searchCategorizeForm of searchCategorizeForms) {
        searchCategorizeForm.addEventListener('submit', async event => {
            event.preventDefault()
            const inputs = document.querySelectorAll('.search-cat-form input')
            addSearchParam('s', inputs[0].value)
            for (const input of Array.from(inputs).slice(1)) {
                if (input.checked) {
                    addSearchParam(input.getAttribute('data-value'), 'yes')
                }
            }
            if (getSearchParam('null')) {
                removeSearchParam('null')
            }
            await showCoursesBasedOnUrl(courses, shownCoursesCount)
        })
        searchCategorizeForm.addEventListener('change', async event => {
            // do this to activate and deactivate all inputs with the same data-value in mobile and desktop size at the same time!
            const inputs = document.querySelectorAll('.search-cat-form input');
            const allInputsWSameValue = Array.from(inputs).filter(input => input.getAttribute('data-value') === event.target.getAttribute('data-value'))

            if (getSearchParam(event.target.getAttribute('data-value'))) {
                removeSearchParam(event.target.getAttribute('data-value'))
                allInputsWSameValue.forEach(input => input.checked = false)
            } else {
                addSearchParam(event.target.getAttribute('data-value'), 'yes')
                allInputsWSameValue.forEach(input => input.checked = true)
            }
            await showCoursesBasedOnUrl(courses, shownCoursesCount)
        })
    }

    const showMoreCoursesBtn = document.querySelector('.show-more__content')
    showMoreCoursesBtn.addEventListener('click', async () => {
        shownCoursesCount += 12;
        await showCoursesBasedOnUrl(courses, shownCoursesCount)
    })

    const mobileFilterBtn = document.querySelector('.mobile-filter-btn')
    mobileFilterBtn.addEventListener('click', toggleMobileFilterMenu)

    const mobileSortingBtn = document.querySelector('.mobile-sort-btn')
    mobileSortingBtn.addEventListener('click', toggleMobileSortingMenu)

    const applyMobileFiltersBtn = document.querySelector('.apply-mobile-filters')
    applyMobileFiltersBtn.addEventListener('click', toggleMobileFilterMenu)
}


const toggleMobileCategoriesMenu = () => {
    const categoriesContainer = document.querySelector('.category-mobile__body')
    const categoriesContainerArrowDownIcon = document.querySelector('.category-mobile__header svg')
    categoriesContainer.classList.toggle('category-mobile__body-open')
    categoriesContainerArrowDownIcon.classList.toggle('rotated-svg')
}

const toggleMobileFilterMenu = () => {
    const mobileFilterMenu = document.querySelector('.mobile-filter')
    mobileFilterMenu.classList.toggle('mobile-filter__open')

    const mobileFilterMenuCloseBtn = document.querySelector('.filter__close-btn')
    mobileFilterMenuCloseBtn.addEventListener('click', toggleMobileFilterMenu)

    const clearAllFiltersBtn = document.querySelector('#clear-all-filters')
    clearAllFiltersBtn.addEventListener('click', () => {
        clearSearchParams()
    })

    const mobileCategoriesHeader = document.querySelector('.category-mobile__header')
    mobileCategoriesHeader.addEventListener('click', toggleMobileCategoriesMenu)
}