import {
	getCategoryById, getCourseByShortName,
	getCourseCreatorDetails,
	getSearchParam, getToken,
	searchFormSubmissionHandler, timeToHour, toggleSeasonHandler
} from "./utils/utils.js";
import {getMe} from "./funcs/auth.js";
import {renderShared, sharedFetches} from "./shared/shared.js";
import {footerFetches, renderFooter} from "./shared/footer.js";

document.addEventListener('DOMContentLoaded', async () => {
	await fetchData();
})

const fetchData = async () => {
	try {
		const targetCourse = await accessingToSessionValidation()
		if (!targetCourse) {
			document.body.innerHTML = `
                <div class="h-screen flex justify-center items-center text-zinc-700 dark:text-white">
                شما مجاز به ورود به این صفحه نیستید!
                </div> 
            `
			return false;
		}

		const response = await fetch(`https://amingharibi-sabzlearn.liara.run/v1/courses/${getSearchParam('c')}/${getSearchParam('session')}`, {
			headers: {
				"Authorization": `Bearer ${getToken()}`
			}
		})

		const [session, courseCategory, teacher, {user, headerMenus}, popularCourses] = await Promise.all([
			response.json(),
			getCategoryById(targetCourse.categoryID._id || targetCourse.categoryID),
			getCourseCreatorDetails(targetCourse.shortName),
			sharedFetches(),
			footerFetches()
		])

        renderPage(targetCourse, session, courseCategory, teacher, user, headerMenus, popularCourses);
	} catch (error) {
		console.log("Error Handling: ", error)
	}
}

const renderPage = (targetCourse, session, courseCategory, teacher, user, headerMenus, popularCourses) => {
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
        <!--player and sessions section-->
        <section class="flex items-start lg:items-stretch flex-col lg:flex-row gap-4 md:gap-5 mt-5 md:mt-7">
            <!-- player -->
            <div class="w-full bg-white dark:bg-darkGray-800 px-3.5 pb-3.5 pt-5 md:px-5 md:pb-5 md:pt-7 shadow-light dark:shadow-none rounded-2xl">
                <!-- course title -->
                <div class="flex items-start gap-x-3.5 mb-4 md:mb-5">
                    <span class="block shrink-0 w-2.5 h-10 bg-sky-500 dark:bg-secondary rounded-sm"></span>
                    <h3 id="course-title" class="text-zinc-700 dark:text-white font-morabbaBold text-2xl/10 lg:text-3xl/[44px]">آموزش

                    </h3>
                </div>
                <!-- course video player -->
                <div id="player-wrapper" class="mb-3 md:mb-5 rounded-xl md:rounded-2xl overflow-hidden">
                    <video id="player" controls crossorigin playsinline data-poster="https://amingharibi-sabzlearn.liara.run/courses/${targetCourse.cover}">
                        <source src="https://amingharibi-sabzlearn.liara.run/sessions/${session.session.video}"
                                type="video/mp4" size="720">
                    </video>
                </div>
                <!-- session title -->
                <div class="flex items-start pb-5 mb-5 border-b border-b-gray-100 dark:border-b-darkGray-700">
                    <span id="lesson-number" class="inline-block text-slate-500 dark:text-darkGray-500 font-danaDemiBold text-lg md:text-2xl border-l border-l-gray-200 dark:border-l-darkGray-700 pl-2 ml-2"></span>
                    <h5 id="lesson-title" class="h-auto lg:h-[86px] xl:max-h-14 text-zinc-700 dark:text-white font-danaDemiBold text-base md:text-xl">

                    </h5>
                </div>
                <!-- session options -->
                <div class="flex justify-between items-center flex-wrap gap-4 tracking-tight">
                    <!-- right options -->
                    <div class="w-full sm:w-auto flex items-center flex-wrap gap-3">
                        <a href="#" id="download-video-btn" class="w-max h-10 flex justify-center items-center gap-x-2 px-3 text-base bg-primary dark:bg-primary/10 hover:bg-green-500 dark:hover:bg-primary/10 text-white dark:text-primary select-none rounded-xl transition-all">
                            <svg class="w-5 h-5">
                                <use href="#arrow-down-tray"></use>
                            </svg>
                            دانلود ویدیو
                        </a>
                        <a href="#"
                           class="hidden w-max h-10 justify-center items-center gap-x-2 px-3 text-base bg-yellow-400 dark:bg-yellow-400/10 hover:bg-[#F9A134] dark:hover:bg-yellow-400/10 text-white dark:text-yellow-400 select-none rounded-xl transition-all">
                            <svg class="w-5 h-5">
                                <use href="#envelope"></use>
                            </svg>
                            دانلود پیوست
                        </a>
                    </div>
                    <!-- left options -->
                    <div>
                        <a href="#"
                           class="hidden w-max h-10 justify-center items-center gap-x-2 flex-grow sm:flex-grow-0 px-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-darkGray-700 dark:hover:bg-darkSlate text-slate-500 dark:text-darkGray-500 select-none rounded-xl transition-all">
                            <svg class="w-5 h-5">
                                <use xlink:href="#arrow-down-tray"></use>
                            </svg>
                            <span class="inline-block">دانلود همگانی</span>
                        </a>
                    </div>
                </div>
            </div>
            <!-- sessions section -->
            <div class="w-full lg:w-80 xl:w-96 flex flex-col lg:flex-row gap-4 md:gap-5">
                <div class="chapters">
                    <!--lessons container-->
                    <div class="chapters--wrapper">
                        <!--chapters-->
                        <div class="chapter">
                            <!--title and what you see whe closed-->
                            <div class="chapter__title">
                                <h3 class="font-danaMedium text-base md:text-lg transition-colors line-clamp-1">
                                    سرفصل ها توسط بک اند هندل نشده اند :(
                                </h3>
                                <svg class="w-5 h-5 transition-all">
                                    <use href="#chevron-down"></use>
                                </svg>
                            </div>
                            <!--lesson-->
                            <div class="chapter__body" style="max-height: 0;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="flex flex-col lg:flex-row gap-4 md:gap-5 mt-4 md:mt-5">
            <!-- Questions and mobile teacher -->
            <div class="w-full">
                <!-- Course Questions -->
                <div class="bg-white dark:bg-darkGray-800 px-3.5 md:px-5 pt-5 md:pt-7 pb-3.5 md:pb-6 shadow-light dark:shadow-none rounded-2xl">
                    <!-- Section Head -->
                    <div class="flex items-center justify-between flex-wrap mb-6">
                        <div class="flex items-center gap-x-3.5">
                            <span class="block w-2.5 h-10 bg-amber-400 dark:text-yellow-400 rounded-sm"></span>
                            <h3 class="text-zinc-700 dark:text-white font-morabbaBold text-2xl md:text-3xl">
                                پرسش و پاسخ
                            </h3>
                        </div>
                    </div>
                    <!-- question Form -->
                    <div class="mb-6 hidden">
                        <div class="flex gap-x-2 mb-3">
                            <img class="block w-10 h-10 md:w-14 md:h-14 object-cover rounded-full shrink-0" alt="Amin" src="./images/profile.png">
                            <div class="flex flex-col">
                                <span class="text-zinc-700 dark:text-white font-danaMedium text-base md:text-xl">Amin</span>
                                <span class="text-slate-500 dark:text-gray-500 text-sm">پرسش
                                        جدید
                                </span>
                            </div>
                        </div>
                        <div dir="rtl" class="h-48 text-slate-500 dark:text-gray-500 focus:text-zinc-700 dark:focus:text-white bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-gray-200 dark:focus:border-slate rounded-2xl"></div>
                    </div>
                    <!-- List of questions -->
                    <div class="space-y-3.5 sm:space-y-5">
                        <!-- Comments -->
                        <p class="text-zinc-700 dark:text-white font-danaLight leading-7 mt-3.5">
                            این بخش توسط بک اند هندل نشده!
                        </p>
                    </div>
                </div>
                <!-- Course Teacher -->
                <div class="course-teacher-section__mobile flex flex-col items-center md:hidden bg-white dark:bg-darkGray-800 pt-5 pb-3.5 px-3.5 xs:px-5 shadow-light dark:shadow-none rounded-2xl mt-4">
                </div>
            </div>
            <aside class="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-5 space-y-5">
                <!-- Mini Box Information like time, status, lessons count -->
                <div class="block">
                    <div class="flex gap-3 md:gap-4">
                        <div class="w-full bg-white py-3 dark:bg-darkGray-800 text-center shadow-light dark:shadow-none rounded-2xl">
                            <svg class="text-primary w-7 h-7 mx-auto">
                                <use href="#exclamation-circle"></use>
                            </svg>
                            <div class="flex flex-col items-center justify-center mt-2.5">
                                <span id="course-situation" class="font-danaDemiBold text-lg text-zinc-700 dark:text-white"></span>
                                <p class="text-slate-500 dark:text-gray-500 text-xs">وضعیت دوره</p>
                            </div>
                        </div>
                        <div class="w-full bg-white py-3 dark:bg-darkGray-800 text-center shadow-light dark:shadow-none rounded-2xl">
                            <svg class="text-primary w-7 h-7 mx-auto">
                                <use href="#clock"></use>
                            </svg>
                            <div class="flex flex-col items-center justify-center mt-2.5">
                                <span id="course-time" class="font-danaDemiBold text-lg text-zinc-700 dark:text-white"></span>
                                <p class="text-slate-500 dark:text-gray-500 text-xs">زمان دوره</p>
                            </div>
                        </div>
                        <div class="w-full bg-white py-3 dark:bg-darkGray-800 text-center shadow-light dark:shadow-none rounded-2xl">
                            <svg class="text-primary w-7 h-7 mx-auto">
                                <use href="#video-camera"></use>
                            </svg>
                            <div class="flex flex-col items-center justify-center mt-2.5">
                                <span id="all-sessions-count" class="font-danaDemiBold text-lg text-zinc-700 dark:text-white"></span>
                                <p class="text-slate-500 dark:text-gray-500 text-xs">جلسات دوره</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-darkGray-800 p-5 pb-4 shadow-light dark:shadow-none rounded-2xl">
                    <div class="flex items-center justify-between mb-3.5 text-zinc-700 dark:text-white text-xl">
                        <span class="font-danaDemiBold">پیشرفت شما</span>
                        <span>0%</span>
                    </div>
                    <progress value="0" max="100" class="h-2.5 w-full align-baseline"></progress>
                </div>
                <!-- Course Teacher -->
                <div class="course-teacher-section__desktop block bg-white dark:bg-darkGray-800 px-5 py-6 shadow-light dark:shadow-none rounded-2xl text-center">
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

	renderShared(user, headerMenus);
	renderFooter(popularCourses)

	// initialize video player
	const player = new Plyr('#player');

	// handle search input in the header of page
	const searchForms = document.querySelectorAll('.search-form')
	searchForms.forEach(form => {
		form.addEventListener('submit', event => searchFormSubmissionHandler(event))
	})

	// customize the addressBar
	const pageAddressBar = document.querySelector('.page-address-bar')
	pageAddressBar.insertAdjacentHTML('beforeend', `
        <div class="page-address--item">
                <a href="search-categories.html?cat=${courseCategory.name}">
                    ${courseCategory.title}
                </a>
            </div>
            <svg class="w-10 h-full text-gray-100 dark:text-darkGray">
                <use href="#chevron-left-address"></use>
            </svg>

            <div class="page-address--item">
                <a href="targetCourse-page.html?c=${targetCourse.shortName}">
                    ${targetCourse.name}
                </a>
            </div>
    `)

	// customize course name and session name and video
	const courseTitle = document.querySelector('#course-title')
	courseTitle.innerHTML = targetCourse.name

	const lessonNumber = document.querySelector('#lesson-number')
	const lessonTitle = document.querySelector('#lesson-title')
	lessonNumber.innerHTML = (() => {
		return session.sessions.findIndex(s => s._id === session.session._id) + 1
	})()
	lessonTitle.innerHTML = session.session.title

	// customize session options
	const downloadVideoBtn = document.querySelector('#download-video-btn')
	downloadVideoBtn.setAttribute('href', `https://amingharibi-sabzlearn.liara.run/sessions/${session.session.video}`)
	downloadVideoBtn.setAttribute('download', session.session.title + '.' + (session.session.video).split('.')[(session.session.video).split('.').length - 1])

	// customize the info boxes of the course
	const courseSituationTitle = document.querySelector('#course-situation')
	const courseTimeTitle = document.querySelector('#course-time')
	const allSessionsCount = document.querySelector('#all-sessions-count')
	courseSituationTitle.innerHTML = (() => {
		switch (+targetCourse.status) {
			case 1:
				return 'پیش فروش'
			case 2:
				return 'در حال برگزاری'
			case 3:
				return 'تکمیل شده'
		}
	})()
	const relativeMin = session.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0).toString().split('.')[1] || '0'
	const exactMin = (Number('0.' + relativeMin) * 60).toFixed(0)
	courseTimeTitle.innerHTML = (session.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0) || '0').toString().split('.')[0].padStart(2, '0') + ':' + exactMin.padStart(2, '0')
	allSessionsCount.innerHTML = session.sessions.length

	// customize teacher section
	const courseTeacherSectionMobile = document.querySelector('.course-teacher-section__mobile')
	const courseTeacherSectionDesktop = document.querySelector('.course-teacher-section__desktop')
	courseTeacherSectionMobile.innerHTML = `
        <div class="w-full flex justify-center items-center gap-x-2.5 mb-3.5 pb-5 border-b lg:border-none border-b-gray-100 dark:border-b-darkSlate">
            <img src="https://amingharibi-sabzlearn.liara.run/profile/${teacher.profile}" alt="${teacher.name}" class="block w-[60px] h-[60px] object-cover rounded-full">
            <div>
                <h4 class="mb-1 font-danaDemiBold text-2xl dark:text-white">
                    ${teacher.name}
                </h4>
                <p class="mt-1.5 text-sm text-slate-500 dark:text-darkGray-500">
                    ${teacher.status || ''}
                </p>
            </div>
        </div>
        <a href="teacher-page.html?n=${teacher.username}" class="inline-flex gap-x-1.5 text-sm text-slate-500 dark:text-darkGray-500">
            <svg class="w-5 h-5">
                <use href="#exit"></use>
            </svg>
            <span>
                مشاهده پروفایل
            </span>
        </a>
    `
	courseTeacherSectionDesktop.innerHTML = `
        <img src="https://amingharibi-sabzlearn.liara.run/profile/${teacher.profile}" alt="${teacher.name}" class="block w-[90px] h-[90px] mx-auto mb-2 object-cover rounded-full">
        <h4 class="mb-1 text-2xl dark:text-white">
            ${teacher.name}
        </h4>
        <a href="teacher-page.html?n=${teacher.username}" class="inline-flex gap-x-1.5 text-slate-500 dark:text-darkGray-500 text-sm">
            <span>
                مدرس دوره
            </span>
            <svg class="w-5 h-5">
                <use href="#exit"></use>
            </svg>
        </a>
        <p class="text-zinc-700 dark:text-white font-danaLight mt-2.5">
            ${teacher.status || ''}
        </p>
    `

	// customize chapters
	const chapterTitle = document.querySelector('.chapter__title')
	const chapterBody = document.querySelector('.chapter__body')
	chapterTitle.addEventListener('click', event => toggleSeasonHandler(event.currentTarget, chapterBody, 'chapter__title--active'))
	// add lessons to chapters
	const lessons = session.sessions
	if (lessons.length) {
		lessons.forEach((lesson, index) => {
			chapterBody.insertAdjacentHTML('beforeend', `
                <div class="lesson${lesson._id === getSearchParam('session') ? ' lesson--watching' : ''}">
                    <!-- title -->
                    <div class="flex items-center gap-x-1.5">
                        <span class="lesson__status"></span>
                        <a href='session-page.html?c=${targetCourse.shortName}&session=${lesson._id}' class="text-sm md:text-base line-clamp-1">
                            ${lesson.title}
                        </a>
                    </div>
                    <!-- time -->
                    <span class="text-xs md:text-sm">${lesson.time}</span>
                </div>
        `)
		})
	} else {
		chapterBody.insertAdjacentHTML('beforeend', `
        <span class="block w-full h-full text-center py-3 bg-gray-100 dark:bg-darkGray-700 text-zinc-700 dark:text-white">به زودی :)</span>
    `)
	}
}

const accessingToSessionValidation = async () => {
	const user = await getMe()
	const course = await getCourseByShortName(getSearchParam('c'))
	const isSessionFree = course.sessions.find(session => session._id === getSearchParam('session')).free
	if (isSessionFree) {
		return course
	}
	return (user && user.courses.find(course => course.shortName === getSearchParam('c'))) || false
}