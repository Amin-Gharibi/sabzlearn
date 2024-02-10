import {
    changeThemeHandler,
    alert,
    getApplyBalance,
    getApplyCoursesCount,
    getApplyPricedCoursesCount,
    getApplyTicketsCount,
    getApplyTotalPaidAmount,
    getApplyUsername,
    getSearchParam,
    getToken,
    getApplyOpenTicketsCount,
    getApplyClosedTicketsCount, lastEditedTickets, intlDateToPersianDate
} from "./utils/utils.js";
import {getMe, logOut} from "./funcs/auth.js";
import {showRecentTicketsHandler} from "./funcs/tickets.js";
import {toggleMobileMenu, toggleProfileDropDown} from "./shared/header.js"
import {emailValidation, passwordValidation} from "./funcs/informationValidation.js";

let $ = document
let userProfileBtn, themeChangerBtn, hamburgerMenuBtn, mobileMenuCloseBtn, mobileMenuOverlay,
    notificationCenterBtn, notificationCenterDropDown, dropDownOverlay, notificationCenterWrapper;

const toggleNotificationsCenter = () => {
    notificationCenterDropDown.classList.toggle('notification-center-dropdown__show')
    dropDownOverlay.classList.toggle('notifications-dropdown--overlay__show')
    notificationCenterWrapper.classList.toggle('notification-center--wrapper__show')

    let hasOverlayEvent = false

    if (hasOverlayEvent) {
        dropDownOverlay.removeEventListener('click', toggleNotificationsCenter)
        hasOverlayEvent = false
    } else {
        dropDownOverlay.addEventListener('click', toggleNotificationsCenter)
        hasOverlayEvent = true
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
})

const fetchData = async () => {
    try {
        const [data, tickets] = await Promise.all([getMe(), lastEditedTickets()])

        let departments, targetTicket;
        if (getSearchParam('sec') === "my-tickets" && getSearchParam('add-ticket') && !getSearchParam('ticket')) {
            const departmentsResponse = await fetch('https://amingharibi-sabzlearn.liara.run/v1/tickets/departments')
            departments = await departmentsResponse.json()

        } else if ((getSearchParam('sec') === "my-tickets" && getSearchParam('add-ticket') && getSearchParam('ticket'))) {
            const response = await fetch(`https://amingharibi-sabzlearn.liara.run/v1/tickets/answer/${getSearchParam('ticket')}`, {
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            })
            if (response.status === 403) {
                targetTicket = false;
            } else {
                targetTicket = await response.json()
            }
        }

        renderPage(data, tickets, departments, targetTicket);
    } catch (error) {
        console.log("Error Handling: ", error)
    }
}

const renderPage = (data, tickets, departments, targetTicket) => {
    const container = document.querySelector('#content')
    container.innerHTML = `
        <main class="min-h-screen flex gap-x-10 2xl:gap-x-14 lg:px-8 xl:px-14 2xl:px-[100px] lg:py-7 md:bg-white md:dark:bg-darkGray-800 ">
    <!--menu-->
    <aside id="mobile-menu"
           class="fixed top-0 bottom-0 -right-64 z-50 md:z-0 lg:static w-64 lg:w-56 lg:min-h-[calc(100vh - 68px)] flex flex-col shrink-0 lg:mt-10 px-7 py-5 lg:px-0 lg:py-0 bg-white dark:bg-darkGray-800 transition-all lg:transform-none">
        <!--logos-->
        <div class="flex items-center justify-between pb-5 mb-7 border-b md:border-none border-b-gray-200 dark:border-b-darkSlate">
            <a href="index.html" class="flex items-center gap-x-1.5 md:gap-x-2.5">
                <img src="./images/logos/mainLogo.webp" class="h-10 md:h-14"
                     alt="سبز لرن">
                <svg class="w-[86px] md:w-32 h-10 md:h-[57px]">
                    <use href="#logo-type"></use>
                </svg>
            </a>
            <svg id="mobile-menu--close-btn" class="text-slate-500 dark:text-slate-400 w-5 h-5 md:hidden">
                <use href="#x-mark"></use>
            </svg>
        </div>
        <!--menu items-->
        <div class="space-y-4 text-zinc-700 dark:text-white">
            <a href="dashboard.html" data-value="dashboard"
               class="desktop-menu--items flex items-center gap-x-2.5 h-10 px-3 rounded-lg">
                <svg class="w-6 h-6">
                    <use href="#home"></use>
                </svg>
                پیشخوان
            </a>
            <a href="dashboard.html?sec=my-courses" data-value="my-courses"
               class="desktop-menu--items flex items-center gap-x-2.5 h-10 px-3 rounded-lg">
                <svg class="w-6 h-6">
                    <use href="#folder"></use>
                </svg>
                دوره های من
            </a>
            <a href="dashboard.html?sec=my-tickets" data-value="my-tickets"
               class="desktop-menu--items flex items-center gap-x-2.5 h-10 px-3 rounded-lg">
                <svg class="w-6 h-6">
                    <use href="#chat-bubble"></use>
                </svg>
                تیکت ها
            </a>
            <a href="dashboard.html?sec=my-infos" data-value="my-infos"
               class="desktop-menu--items flex items-center gap-x-2.5 h-10 px-3 rounded-lg">
                <svg class="w-6 h-6">
                    <use href="#user"></use>
                </svg>
                جزئیات حساب
            </a>
            <button type="button" class="log-out-btns flex items-center gap-x-2.5 h-10 px-3 rounded-lg">
                <svg class="w-6 h-6">
                    <use href="#logout-icon"></use>
                </svg>
                خروج
            </button>
        </div>
    </aside>
    <!--dashboard content-->
    <section class="w-full max-w-[1432px] mx-auto md:p-10 bg-gray-100 dark:bg-darkGray lg:rounded-[2rem]">
        <header class="flex justify-between items-center mb-6 md:mb-14 p-5 md:p-0 bg-white dark:bg-darkGray md:bg-transparent dark:border-b md:border-none border-b-darkGray-700">
            <!--for mobile size only title and hamburger menu-->
            <div id="hamburger-menu-btn" class="flex md:hidden font-danaMedium gap-1">
                <svg class="w-6 h-6">
                    <use href="#bars-3-bottom-right"></use>
                </svg>
                <span>
                    پیشخوان
                </span>
            </div>
            <!--for desktop size only, say hello to user-->
            <h3 class="hidden md:block font-danaDemiBold text-2xl">
            <span class="account-center--username">

            </span>
                عزیز; خوش اومدی 🙌
            </h3>
            <!--profile and theme changing btn and notification-->
            <div class="flex justify-end items-center gap-3.5 md:gap-x-7">
                <!--notification center-->
                <div class="notification-center--wrapper relative flex justify-center items-center w-12 h-12 md:w-14 md:h-14 bg-gray-100 md:bg-white hover:bg-gray-200 md:hover:bg-white dark:bg-darkGray-800 md:dark:hover:bg-darkGray-800 text-slate-500 dark:text-darkGray-600 rounded-full transition-colors md:cursor-pointer">
                    <div class="notification-center--btn">
                        <svg class="w-6 h-6 md:w-7 md:h-7">
                            <use href="#bell"></use>
                        </svg>
                    </div>
                    <div class="notification-center-dropdown">
                        <div class="w-80 md:w-96 bg-white dark:bg-darkGray-800 py-5 px-[18px] rounded-2xl">
                            <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-b-gray-200 dark:border-b-slate-500">
                                <span class="font-danaMedium text-xl">اعلان ها</span>
                            </div>
                            <div class="max-h-96 overflow-y-auto space-y-3 -ml-2 pl-2">
                                <div class="text-center bg-gray-100 dark:bg-darkGray-700 p-3 rounded-xl">اعلان جدیدی
                                    وجود ندارد.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--change theme btn-->
                <div class="theme-changer-btn flex justify-center items-center w-12 h-12 md:w-14 md:h-14 bg-gray-100 md:bg-white hover:bg-gray-200 md:hover:bg-white dark:bg-darkGray-800 md:dark:hover:bg-darkGray-800 text-slate-500 dark:text-darkGray-600 rounded-full transition-colors md:cursor-pointer">
                    <svg class="w-6 h-6 md:w-7 md:h-7 block dark:hidden">
                        <use href="#moon"></use>
                    </svg>
                    <svg class="w-6 h-6 md:w-7 md:h-7 hidden dark:block">
                        <use href="#sun"></use>
                    </svg>
                </div>
                <!--account btn-->
                <div class="relative group z-20">
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
                                <!--my infos-->
                                <a href="dashboard.html?sec=my-infos"
                                   class="w-full h-[46px] flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
                                    <svg class="w-5 h-5">
                                        <use href="#chat-bubble"></use>
                                    </svg>
                                    <span>
                                        جزئیات حساب
                                    </span>
                                </a>
                            </div>
                            <!--logout button-->
                            <div class="flex justify-start items-center pt-2 mt-2">
                                <button type="button"
                                   class="log-out-btns w-full h-11 flex justify-start items-center gap-x-3 hover:bg-gray-100 dark:hover:bg-darkSlate px-2.5 rounded-xl transition-colors">
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
        <main class="px-5 md:px-0">
            <!--mobile size only, say hello to user-->
            <h3 class="md:hidden mb-7 font-danaDemiBold">
            <span class="account-center--username">

            </span>
                عزیز; خوش اومدی 🙌
            </h3>
            <!--dashboard-->
            <div id="dashboard" class="dashboard--sections hidden">
                <!--boxes container-->
                <div class="flex flex-wrap gap-x-3 gap-y-4 md:gap-x-10 mb-10 text-white">
                    <!--each box-->
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-amber-400 dark:bg-yellow-400 rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#credit-cart"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            مجموع پرداخت ها
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span id="total-paid"></span> تومان
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-sky-500 dark:bg-secondary rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#rocket-launch"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            دوره های من
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--courses-count"></span> دوره
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-pink-500 dark:bg-rose-500 rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#ticket"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            مجموع تیکت ها
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--tickets-count"></span> تیکت
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-primary rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#currency-dollar"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                    <span class="text-xs">
                        موجودی حساب
                    </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                        <span class="account-center--balance"></span> تومان
                    </span>
                        </div>
                    </div>
                </div>
                <!--recently watched and courses and recent tickets and recent questions-->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-7 items-start">
                    <!--recently watched and courses-->
                    <div>
                        <!--recently watched title and show all courses-->
                        <div class="flex justify-between items-center mb-4 md:mb-5 px-3.5 py-2.5 md:p-[18px] bg-white dark:bg-darkGray-800 rounded-2xl">
                        <span class="font-danaMedium md:text-xl">
                            اخیرا مشاهده شده
                        </span>
                            <a href="dashboard.html?sec=my-courses"
                               class="h-9 flex items-center gap-x-1.5 p-3.5 bg-sky-500/10 dark:bg-secondary/10 text-sm text-sky-500 dark:text-secondary rounded-xl select-none">
                            <span>
                                همه دوره های ثبت‌نام شده
                            </span>
                                <svg class="w-4 h-4">
                                    <use href="#arrow-left-mini"></use>
                                </svg>
                            </a>
                        </div>
                        <!--courses-->
                        <div class="w-full">
                            <!--each course-->
                            <div class="max-h-96 overflow-y-auto space-y-3 -ml-2 pl-2">
                                <div class="text-center bg-gray-100 dark:bg-darkGray-700 p-3 rounded-xl">این بخش توسط بک
                                    اند هندل نشده
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--recent tickets and recent questions-->
                    <div>
                        <!--recent tickets-->
                        <div class="bg-white dark:bg-darkGray-800 p-3.5 md:p-[18px] rounded-2xl">
                            <!--section header-->
                            <div class="flex justify-between items-center pb-3.5 md:pb-4.5 mb-6 md:mb-7 border-b border-b-gray-200 dark:border-b-darkGray-700">
                        <span class="font-danaMedium md:text-xl">
                            تیکت های اخیر
                        </span>
                                <!--all tickets-->
                                <a href="dashboard.html?sec=my-tickets"
                                   class="flex items-center gap-x-1.5 text-sky-500 dark:text-secondary text-sm">
                            <span>
                                همه تیکت ها
                            </span>
                                    <svg class="w-4 h-4">
                                        <use href="#arrow-left-mini"></use>
                                    </svg>
                                </a>
                            </div>
                            <!--section body-->
                            <div class="recent-tickets--wrapper dashboard-recent-tickets-wrapper">

                            </div>
                        </div>
                        <!--recent questions-->
                        <div class="bg-white dark:bg-darkGray-800 p-3.5 md:p-[18px] rounded-2xl mt-7">
                            <!--section header-->
                            <div class="flex justify-between items-center pb-3.5 md:pb-4.5 mb-6 md:mb-7 border-b border-b-gray-200 dark:border-b-darkGray-700">
                        <span class="font-danaMedium md:text-xl">
                            پرسش های اخیر
                        </span>
                            </div>
                            <!--section body-->
                            <div>
                                <!--each question-->
                                <div class="max-h-96 overflow-y-auto space-y-3 -ml-2 pl-2">
                                    <div class="text-center bg-gray-100 dark:bg-darkGray-700 p-3 rounded-xl">این بخش
                                        توسط بک اند هندل نشده
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--my-courses-->
            <div id="my-courses" class="dashboard--sections hidden">
                <!--boxes container-->
                <div class="flex flex-wrap gap-x-3 gap-y-4 md:gap-x-10 mb-10 text-white">
                    <!--each box-->
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-amber-400 dark:bg-yellow-400 rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#credit-cart"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            دوره های ثبت نام شده
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--courses-count"></span> دوره
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-sky-500 dark:bg-secondary rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#rocket-launch"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            دوره های نقدی
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--priced-courses-count"></span> دوره
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-primary rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#currency-dollar"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                    <span class="text-xs">
                        دوره های رایگان
                    </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                        <span class="account-center--free-courses-count"></span> دوره
                    </span>
                        </div>
                    </div>
                </div>
                <!--MY COURSES GRID-->
                <div class="my-courses-container grid grid-rows-2 xs:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">

                </div>
            </div>

            <!--my tickets-->
            <div id="my-tickets" class="dashboard--sections hidden">
                <!--boxes container-->
                <div class="flex flex-wrap gap-x-3 gap-y-4 md:gap-x-10 text-white">
                    <!--each box-->
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-amber-400 dark:bg-yellow-400 rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#credit-cart"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            همه تیکت ها
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--tickets-count"></span> تیکت
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-sky-500 dark:bg-secondary rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#rocket-launch"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            تیکت های باز
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--open-tickets-count">0</span> تیکت
                        </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-2.5 md:gap-x-4 flex-grow md:flex-grow-0 md:w-60 p-2 bg-pink-500 dark:bg-rose-500 rounded-2xl">
                        <!--box logo-->
                        <div class="w-14 h-14 md:w-[68px] md:h-[68px] flex justify-center items-center bg-white/20 rounded-2xl">
                            <svg class="w-8 h-8 md:w-9 md:h-9">
                                <use href="#ticket"></use>
                            </svg>
                        </div>
                        <!--box content-->
                        <div class="flex flex-col  gap-y-1.5 md:gap-y-2">
                        <span class="text-xs">
                            بسته شده
                        </span>
                            <span class="font-danaDemiBold text-sm md:text-lg">
                            <span class="account-center--closed-tickets-count">0</span> تیکت
                        </span>
                        </div>
                    </div>
                </div>
                <!--new ticket button for tickets section FLEX-->
                <a href="dashboard.html?sec=my-tickets&add-ticket=true"
                   class="flex w-full xs:w-max items-center gap-x-[18px] p-4 md:p-6 mt-5 bg-sky-500 dark:bg-secondary font-danaDemiBold text-xl text-white rounded-2xl">
                    <svg class="w-8 h-8">
                        <use href="#plus-circle"></use>
                    </svg>
                    تیکت جدید
                </a>
                <!--TICKETS SECTION-->
                <div class="bg-white dark:bg-darkGray-800 mt-10 p-3.5 md:p-[18px] rounded-2xl">
                    <!--section header-->
                    <div class="flex justify-between items-center pb-3.5 md:pb-4.5 mb-6 md:mb-7 border-b border-b-gray-200 dark:border-b-darkGray-700">
                    <span class="font-danaMedium md:text-xl">
                        تیکت ها
                    </span>
                    </div>
                    <!--section body-->
                    <div class="recent-tickets--wrapper">
                        <!--each ticket-->

                    </div>
                </div>
            </div>

            <!--my infos-->
            <div id="my-infos" class="dashboard--sections hidden">
                <div class="px-5 md:px-0 ">
                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <div class="xl:col-span-2 bg-white dark:bg-darkGray-800 p-[18px] rounded-2xl">
                            <div class="pb-[18px] border-b border-b-gray-200 dark:border-b-darkSlate">
                                <span class="font-danaMedium md:text-xl text-zinc-700 dark:text-white">جزئیات حساب کاربری</span>
                            </div>
                            <form id="edit-account-info" class="p-3.5 pt-8">
                                <div class="relative mb-11">
                                    <img src="" id="profile-image-tag" class="w-32 md:w-44 h-32 md:h-44 rounded-full">
                                    <label for="profile-input" class="absolute bottom-0 right-0 flex justify-center items-center w-10 md:w-14 h-10 md:h-14 rounded-full bg-sky-600 dark:bg-secondary dark:hover:bg-blue-600 border-2 md:border-4 border-white dark:border-darkGray-800 cursor-pointer transition-colors">
                                        <svg class="w-5 md:w-6 h-5 md:h-6 text-white">
                                            <use href="#arrow-path-rounded-square-mini"></use>
                                        </svg>
                                    </label>
                                    <input type="file" class="absolute hide" id="profile-input" accept=".jpg, .jpeg, .png, .webp">
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
                                    <div>
                                        <label for="phone" class="font-danaDemiBold text-zinc-700 dark:text-white">شماره موبایل</label>
                                        <input type="text" id="phone" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-200 dark:bg-darkGray-700 text-base border border-transparent tracking-tight cursor-not-allowed rounded-xl transition-all" style="direction: rtl;" disabled>
                                    </div>
                                    <div class="hidden md:block"></div>
                                    <div>
                                        <label for="first_name" class="font-danaDemiBold text-zinc-700 dark:text-white">نام</label>
                                        <input type="text" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-100 dark:bg-darkGray-700 text-base border border-transparent focus-within:border-gray-300 dark:border-darkGray-800 outline-0 tracking-tight rounded-xl transition-all" id="first_name" name="first_name" required>
                                    </div>
                                    <div>
                                        <label for="last_name" class="font-danaDemiBold text-zinc-700 dark:text-white">نام خانوادگی</label>
                                        <input type="text" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-100 dark:bg-darkGray-700 text-base border border-transparent focus-within:border-gray-300 dark:border-darkGray-800 outline-0 tracking-tight rounded-xl transition-all" id="last_name" name="last_name">
                                    </div>
                                    <div>
                                        <label for="username" class="font-danaDemiBold text-zinc-700 dark:text-white">نام کاربری</label>
                                        <input type="text" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-200 dark:bg-darkGray-700 text-base border border-transparent tracking-tight cursor-not-allowed rounded-xl transition-all" disabled="" id="username">
                                    </div>
                                    <div>
                                        <label for="email" class="font-danaDemiBold text-zinc-700 dark:text-white">ایمیل</label>
                                        <input type="email" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-100 dark:bg-darkGray-700 text-base border border-transparent focus-within:border-gray-300 dark:border-darkGray-800 outline-0 tracking-tight rounded-xl transition-all" id="email" name="email" required>
                                    </div>
                                </div>
                                <button type="submit" class="flex justify-center items-center w-full md:w-auto h-14 gap-y-2 mr-auto mt-10 px-7 bg-primary hover:bg-green-500 text-xl text-white rounded-xl">ثبت اطلاعات</button>
                            </form>
                        </div>
                        <div class="xl:col-span-1 bg-white dark:bg-darkGray-800 p-[18px] rounded-2xl">
                            <div class="pb-[18px] border-b border-b-gray-200 dark:border-b-darkSlate">
                                <span class="font-danaMedium md:text-xl text-zinc-700 dark:text-white">تغییر رمز عبور</span>
                            </div>
                            <form id="edit-account-password" class="p-3.5 pt-8">
                                <div class="space-y-5 md:space-y-6">
                                    <div>
                                        <label for="old_pass" class="font-danaDemiBold text-zinc-700 dark:text-white">رمز عبور فعلی</label>
                                        <input type="password" id="old_pass" name="old_pass" required="" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-100 dark:bg-darkGray-700 text-base border border-transparent focus-within:border-gray-300 dark:border-darkGray-800 outline-0 tracking-tight rounded-xl transition-all" placeholder="رمز فعلی را وارد کنید">
                                    </div>
                                    <div>
                                        <label for="new_pass" class="font-danaDemiBold text-zinc-700 dark:text-white">رمز عبور جدید</label>
                                        <input type="password" class="w-full h-14 px-5 mt-3.5 md:mt-4 bg-gray-100 dark:bg-darkGray-700 text-base border border-transparent focus-within:border-gray-300 dark:border-darkGray-800 outline-0 tracking-tight rounded-xl transition-all" id="new_pass" name="new_pass" required="" placeholder="رمز جدید را وارد کنید">
                                    </div>
                                </div>
                                <button type="submit" class="flex justify-center items-center w-full md:w-auto h-14 gap-y-2 mr-auto mt-10 px-7 bg-primary hover:bg-green-500 text-xl text-white rounded-xl">تغییر رمز</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!--add ticket form-->
            <div id="add-ticket-form-container" class="hidden px-5 md:px-0">
                <div class="bg-white dark:bg-darkGray-800 p-3.5 md:p-[18px] rounded-2xl">
                    <div class="flex justify-between items-center pb-3.5 md:pb-[18px] mb-6 md:mb-7 border-b border-b-gray-200 dark:border-b-darkGray-700">
                        <span class="font-danaMedium md:text-xl text-zinc-700 dark:text-white">ارسال تیکت</span>
                    </div>
                    <form id="add-ticket">
                        <div>
                            <label for="department"
                                   class="font-danaDemiBold text-zinc-700 dark:text-white">دپارتمان</label>
                            <select name="department" id="department" required
                                    class="mt-3.5 md:mt-4 w-full p-3 sm:p-5 font-danaLight text-sm sm:text-base tracking-tight text-zinc-700 dark:text-white bg-gray-100 dark:bg-darkGray-700 rounded-xl border border-transparent focus:border-gray-300 dark:focus:border-darkSlate placeholder:text-slate-500 dark:placeholder:text-darkGray-500 outline-0 transition-all">
                                <option value="">دپارتمان مورد نظر...</option>
                            </select>
                        </div>
                        <div class="mt-6">
                            <label for="title" class="font-danaDemiBold text-zinc-700 dark:text-white">
                                موضوع تیکت
                            </label>
                            <input type="text"
                                   class="w-full h-12 sm:h-14 mt-3.5 md:mt-4 px-3 sm:px-5 bg-gray-100 dark:bg-darkGray-700 text-sm sm:text-base tracking-tight text-zinc-700 dark:text-white border border-transparent rounded-xl transition-all outline-0"
                                   id="title" name="title" required=""
                                   placeholder="موضوع تیکت خود را وارد کنید">
                        </div>
                        <div class="mt-6">
                            <label for="text" class="font-danaDemiBold text-zinc-700 dark:text-white">متن تیکت</label>
                            <textarea rows="8"
                                      class="mt-3.5 md:mt-4 w-full p-3 sm:p-5 font-danaRegular text-sm sm:text-base tracking-tight text-zinc-700 dark:text-white bg-gray-100 dark:bg-darkGray-700 rounded-xl border border-transparent focus:border-gray-300 dark:focus:border-darkSlate placeholder:text-slate-500 dark:placeholder:text-darkGray-500 outline-0 transition-all"
                                      id="text" name="text" required
                                      placeholder="متن تیکت خود را وارد کنید"></textarea>
                        </div>
                        <div class="flex justify-between gap-5 flex-wrap mt-6">
                            <div class="flex gap-x-3 mr-auto">
                                <button class="w-max h-10 flex justify-center items-center px-[18px] text-base bg-primary hover:bg-green-500 text-white select-none rounded-xl transition-all"
                                        type="submit">ارسال
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="db-overlay invisible opacity-0 fixed w-full h-full top-0 left-0 bg-black/40 z-20 transition-all"></div>
            </div>

            <!--ticket page-->
            <div id="ticket-page" class="hidden">
                <div class="px-5 md:px-0">
                    <div class="bg-white dark:bg-darkGray-800 p-3.5 md:p-[18px] rounded-2xl">
                        <div class="flex justify-between items-center pb-3.5 md:pb-[18px] mb-6 md:mb-7 border-b border-b-gray-200 dark:border-b-darkGray-700">
                            <span id="ticket-title" class="font-danaMedium md:text-xl text-zinc-700 dark:text-white"></span>
                        </div>
                        <div class="space-y-4 ticket-content-container">
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </section>
</main>
    `

    userProfileBtn = $.querySelector('#user-profile')
    themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
    hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
    mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
    mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
    notificationCenterBtn = $.querySelector('.notification-center--btn')
    notificationCenterDropDown = $.querySelector('.notification-center-dropdown')
    dropDownOverlay = $.querySelector('.notifications-dropdown--overlay')
    notificationCenterWrapper = $.querySelector('.notification-center--wrapper')

    if (!data) {
        location.href = 'login-email.html'
    } else {
        getApplyTotalPaidAmount(data.courses)
        getApplyUsername(data.name)
        getApplyBalance(data)
        getApplyCoursesCount(data.courses)
        getApplyTicketsCount(tickets)
        showRecentTicketsHandler(tickets)
        getApplyPricedCoursesCount(data.courses)
        getApplyOpenTicketsCount(tickets)
        getApplyClosedTicketsCount(tickets)
        const userProfilePicElem = document.querySelectorAll('.user-profile-pictures')
        userProfilePicElem.forEach(pic => {
            pic.setAttribute('src', `https://amingharibi-sabzlearn.liara.run/profile/${data.profile}`)
        })

        const logOutBtns = document.querySelectorAll('.log-out-btns')
        logOutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                logOut()
            })
        })

        const desktopMenuItems = document.querySelectorAll('.desktop-menu--items')
        desktopMenuItems.forEach(item => {
            item.classList.remove('active')
        })
        const targetItem = Array.from(desktopMenuItems).find(item => item.getAttribute('data-value') === getSearchParam('sec')) || Array.from(desktopMenuItems)[0]
        targetItem.classList.add('active')

        const dashboardSections = document.querySelectorAll('.dashboard--sections')
        const targetSection = Array.from(dashboardSections).find(sec => sec.id === getSearchParam('sec')) || Array.from(dashboardSections)[0]
        if (getSearchParam('sec') === 'dashboard' || !getSearchParam('sec') || (getSearchParam('sec') === 'my-tickets' && !getSearchParam('add-ticket') && !getSearchParam('ticket'))) {
            targetSection.classList.remove('hidden')
        } else if (getSearchParam('sec') === "my-tickets" && getSearchParam('add-ticket') && !getSearchParam('ticket')) {
            const addTicketFormContainer = document.querySelector('#add-ticket-form-container')
            addTicketFormContainer.classList.remove('hidden')


            const departmentsSelectBox = document.querySelector('#department')
            departments.forEach(department => {
                departmentsSelectBox.insertAdjacentHTML('beforeend', `
                <option value="${department._id}">
                ${department.title}
                </option>
            `)
            })
            const addTicketForm = document.querySelector('#add-ticket')

            addTicketForm.addEventListener('submit', async event => {
                event.preventDefault()
                const selectedDepartmentIndex = departmentsSelectBox.selectedIndex
                const selectedOption = departmentsSelectBox.options[selectedDepartmentIndex]
                const subDepartmentOfSelectedDepartment = await (await fetch(`https://amingharibi-sabzlearn.liara.run/v1/tickets/departments-subs/${selectedOption.value}`)).json()
                const ticketTitle = document.querySelector('#title')
                const ticketText = document.querySelector('#text')
                if (ticketTitle.value.trim() && ticketText.value.trim() && selectedOption.value) {
                    const ticketBody = {
                        departmentID: selectedOption.value,
                        departmentSubID: subDepartmentOfSelectedDepartment[0]._id,
                        title: ticketTitle.value.trim(),
                        priority: 3,
                        body: ticketText.value.trim()
                    }
                    fetch('https://amingharibi-sabzlearn.liara.run/v1/tickets', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getToken()}`
                        },
                        body: JSON.stringify(ticketBody)
                    }).then(response => {
                        if (response.status === 201) {
                            alert(document.body, 'check-circle', 'primary', 'موفق', 'تیکت شما با موفقیت ارسال شد!')

                            setTimeout(() => {
                                location.href = 'dashboard.html?sec=my-tickets'
                            }, 2000)
                        } else {
                            alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطایی در ارسال تیکت رخ داد. دوباره تلاش کنید!')
                        }
                    })
                } else {
                    alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'تیکت باید دارای موضوع و بدنه باشد و به دپارتمان مشخصی ارسال گردد!')
                }
            })
        } else if ((getSearchParam('sec') === "my-tickets" && getSearchParam('add-ticket') && getSearchParam('ticket'))) {
            const ticketPage = document.querySelector('#ticket-page')
            ticketPage.classList.remove('hidden')

            if (!targetTicket) {
                ticketPage.innerHTML = `
                <span class="text-zinc-700 dark:text-white text-xl text-center block">شما مجار به ورود به این صفحه نیستید!</span>
            `} else {
                const detailedTicket = tickets.find(ticket => ticket._id === getSearchParam('ticket'))
                const localDate = new Date(detailedTicket.createdAt)

                const ticketTitle = document.querySelector('#ticket-title')
                ticketTitle.innerHTML = detailedTicket.title

                const ticketContentContainer = document.querySelector('.ticket-content-container')

                ticketContentContainer.insertAdjacentHTML('beforeend', `
            <div class="w-11/12 sm:w-2/3 bg-gray-100 dark:bg-darkGray-700 text-zinc-700 dark:text-white p-4 rounded-2xl rounded-tr-sm">
                <h4 class="font-danaMedium text-xl mb-1 text-right">${detailedTicket.user}</h4>
                <span class="block text-xs font-danaRegular text-slate-500 dark:text-slate-400 text-right"
                      style="direction: ltr;">${intlDateToPersianDate(detailedTicket.createdAt)} ${localDate.toString().split(' ')[4].slice(0, 5)}</span>
                <p class="font-danaRegular mt-[18px]">
                    ${targetTicket.ticket || detailedTicket.body}
                </p>
            </div>
            ${targetTicket.answer && `<div class="w-11/12 sm:w-2/3 mr-auto bg-sky-500/30 dark:bg-secondary/20 text-zinc-700 dark:text-white p-4 rounded-2xl rounded-tl-sm">
                <h4 class="font-danaMedium text-xl mb-1 text-left">توسط بک اند هندل نشده</h4>
                <span class="block text-xs font-danaLight text-slate-500 dark:text-slate-400 text-left"
                      style="direction: ltr;">تایم هم هندل نشده</span>
                <p class="font-danaRegular mt-[18px]">
                    ${targetTicket.answer}
                </p>
            </div>` || ''}
        `)
            }

        } else if (getSearchParam('sec') === "my-courses") {
            targetSection.classList.remove('hidden')
            const myCoursesSection = document.querySelector('#my-courses:not(.hidden)')
            if (myCoursesSection) {
                const myCoursesContainer = document.querySelector('.my-courses-container')
                myCoursesContainer.innerHTML = 'در حال لود...'
                myCoursesContainer.innerHTML = data.courses.map(course => {
                    return `
                <div class="flex flex-col overflow-hidden bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none dark:border dark:border-darkGray-700 rounded-2xl">
                    <!-- Course Banner -->
                    <div class="relative h-[168px]">
                        <a class="w-full h-full block" href="course-page.html?c=${course.shortName}/#lessons"
                           title="${course.name}">
                            <img class="block w-full h-full object-cover rounded-2xl"
                                 src="https://amingharibi-sabzlearn.liara.run/courses/${course.cover}"
                                 alt="${course.name}">
                        </a>
                    </div>
                    <!-- Course Body -->
                    <div class="px-5 pb-3.5 pt-2.5 flex-grow ">
                        <!-- Course Title -->
                        <h4 class="font-danaMedium h-12 line-clamp-2 text-zinc-700 dark:text-white mb-2.5">
                            <a href="course-page.html?c=${course.shortName}/#lessons">
                                ${course.name}
                            </a>
                        </h4>
                        <!-- Course Footer -->
                        <div class="pt-3 border-t border-t-gray-100 dark:border-t-darkGray-700">
                            <div class="flex items-center justify-between text-xs mb-1.5">
                                <span>میزان مشاهده</span>
                                <span class="text-slate-500 dark:text-slate-400">0%</span>
                            </div>
                            <div class="bg-gray-100 dark:bg-darkGray-700 h-[5px] rounded-full">
                                <div class="bg-primary h-full rounded-full" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `
                }).join('')
            }

            const freeCoursesCountTitle = document.querySelector('.account-center--free-courses-count')
            if (freeCoursesCountTitle) {
                freeCoursesCountTitle.innerHTML = (data.courses.length - getApplyPricedCoursesCount(data.courses)).toString()
            }
        } else if (getSearchParam('sec') === 'my-infos') {
            targetSection.classList.remove('hidden')

            // set default values
            const profileImageTag = document.querySelector('#profile-image-tag')
            profileImageTag.setAttribute('src', `https://amingharibi-sabzlearn.liara.run/profile/${data.profile}`)

            const userPhoneNumberInput = document.querySelector('#phone')
            userPhoneNumberInput.setAttribute('value', data.phone)

            const userFirstNameInput = document.querySelector('#first_name')
            userFirstNameInput.setAttribute('value', (data.name).split(' ')[0])

            const userLastNameInput = document.querySelector('#last_name')
            userLastNameInput.setAttribute('value', (data.name).split(' ')[1] || '')

            const userNameInput = document.querySelector('#username')
            userNameInput.setAttribute('value', data.username)

            const userEmailInput = document.querySelector('#email')
            userEmailInput.setAttribute('value', data.email)

            const editAccountInfoForm = document.querySelector('#edit-account-info')
            editAccountInfoForm.setAttribute('data-value', data._id)

            const editAccountPasswordForm = document.querySelector('#edit-account-password')
            editAccountPasswordForm.setAttribute('data-value', data._id)

            // handle changing profile picture
            const profileInput = document.querySelector('#profile-input')
            profileInput.addEventListener('change', event => {
                const selectedFile = event.target.files[0];
                if (selectedFile) {
                    const reader = new FileReader()
                    reader.onload = event => {
                        profileImageTag.src = event.target.result
                    }
                    reader.readAsDataURL(selectedFile)
                }
            })

            // handle changing initial infos
            editAccountInfoForm.addEventListener('submit', event => {
                event.preventDefault()

                if (!emailValidation(userEmailInput.value.trim())) {
                    alert(document.body, 'close-circle', 'alert-red', 'دقت', 'ایمیل مورد نظر قابل قبول نیست!')
                    return false;
                }

                const sendingBody = new FormData();
                sendingBody.append('name', userFirstNameInput.value.trim() + ' ' + userLastNameInput.value.trim())
                sendingBody.append('email', userEmailInput.value.trim())
                sendingBody.append('profile', profileInput.files[0])

                fetch(`https://amingharibi-sabzlearn.liara.run/v1/users/${event.target.getAttribute('data-value')}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    },
                    body: sendingBody
                }).then(res => {
                    if (res.ok) {
                        alert(document.body, 'check-circle', 'primary', 'موفق', 'اطلاعات شما با موفقیت ویرایش شد!')
                    } else {
                        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطایی در ویرایش اطلاعات رخ داد!')
                    }
                })
            })


            // handle changing account password
            editAccountPasswordForm.addEventListener('submit', event => {
                event.preventDefault()

                const currentPasswordInput = document.querySelector('#old_pass')
                const newPasswordInput = document.querySelector('#new_pass')

                if (!passwordValidation(newPasswordInput.value.trim())) {
                    alert(document.body, 'close-circle', 'alert-red', 'دقت', 'رمز عبور جدید قابل قبول نیست!')
                    return false;
                }

                const sendingBody = {
                    currentPassword: currentPasswordInput.value.trim(),
                    newPassword: newPasswordInput.value.trim()
                }

                fetch(`https://amingharibi-sabzlearn.liara.run/v1/users/${event.target.getAttribute('data-value')}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: sendingBody
                }).then(res => {
                    if (res.ok) {
                        alert(document.body, 'check-circle', 'primary', 'موفق', 'رمز عبور شما با موفقیت عوض شد!')
                        setTimeout(() => {
                            logOut()
                            location.href = 'login-email.html'
                        }, 2000)
                    } else if (res.status === 403) {
                        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'رمز عبور کنونی شما درست نیست!')
                        setTimeout(() => {
                            logOut()
                            location.href = 'login-email.html'
                        }, 2000)
                    } else {
                        alert(document.body, 'close-circle', 'alert-red', 'ناموفق', 'خطایی در عوض کردن رمز عبور شما رخ داد!')
                    }
                })
            })
        }

        notificationCenterBtn.addEventListener('click', toggleNotificationsCenter)

        mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
        mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
        hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
        userProfileBtn.addEventListener('click', toggleProfileDropDown)
        themeChangerBtn.forEach(btn => {
            btn.addEventListener('click', changeThemeHandler)
        })
    }
}