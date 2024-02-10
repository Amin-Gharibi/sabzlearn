import {
    copyShortLinks, getAllCategories,
    getLastEditedArticles,
    getSearchParam,
    intlDateToPersianDate,
    searchFormSubmissionHandler
} from "./utils/utils.js";
import {renderShared, sharedFetches} from "./shared/shared.js";
import {footerFetches, renderFooter} from "./shared/footer.js";

document.addEventListener('DOMContentLoaded', async () => {
    await fetchData()
})

const fetchData = async () => {
    try {
        let [article, lastEditedArticles, allCategories , {user, headerMenus}, popularCourses] = await Promise.all([
            fetch(`https://amingharibi-sabzlearn.liara.run/v1/articles/${getSearchParam('article')}`),
            getLastEditedArticles(),
            getAllCategories(),
            sharedFetches(),
            footerFetches()
        ])
        article = await article.json()
        lastEditedArticles = lastEditedArticles.slice(0, 5)

        if (!article.publish) {
            document.body.innerHTML = `
            <div class="h-screen flex justify-center items-center text-zinc-700 dark:text-white">
            شما مجاز به ورود به این صفحه نیستید!
            </div>    
    `
            return false
        }

        renderPage(article, lastEditedArticles, user, headerMenus, popularCourses, allCategories)
    } catch (error) {
        console.log("Error Handling: ", error)
    }
}


const renderPage = (article, lastEditedArticles, user, headerMenus, popularCourses, allCategories) => {
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
            <section class="page-address-bar h-[50px] hidden md:flex justify-start items-center mt-7 bg-white dark:bg-darkGray-800 text-lg text-zinc-700 dark:text-white shadow-light overflow-x-auto overflow-y-hidden rounded-2xl">
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
                    <a href="search-categories-articles.html">
                        وبلاگ
                    </a>
                </div>
                <svg class="w-10 h-full text-gray-100 dark:text-darkGray">
                    <use href="#chevron-left-address"></use>
                </svg>
            </section>
            <!--article content and short link and newest articles and categories and comments-->
            <section class="grid lg:grid-cols-3 gap-3.5 sm:gap-5 mt-7">
                <!--article content and comments section-->
                <div class="col-span-1 lg:col-span-2 space-y-5">
                    <!--article content-->
                    <div class="p-5 bg-white dark:bg-darkGray-800 dark:border border-darkGray-700 shadow-light dark:shadow-none rounded-2xl">
                        <!--article title-->
                        <div class="mb-5 pb-6 border-b border-b-gray-200 dark:border-b-darkGray-700">
                            <h1 class="article--title font-morabbaBold dark:text-white text-2xl/9 lg:text-4xl/[48px]">
                                ${article.title}
                            </h1>
                        </div>
                        <!--article publisher and release date-->
                        <div class="flex items-center gap-3 flex-wrap mb-6">
                            <!--article publisher-->
                            <div class="font-danaMedium text-xs dark:text-white">
                                <svg class="inline w-5 h-5 ml-0.5">
                                    <use href="#user"></use>
                                </svg>
                                <span>
                                نوشته از <span class="article--publisher">${article.creator.name}</span>
                            </span>
                            </div>
                            <!--release date-->
                            <div class="font-danaMedium text-xs dark:text-white">
                                <svg class="inline w-5 h-5 ml-0.5">
                                    <use href="#calendar-days"></use>
                                </svg>
                                <span class="article--date">
                                    ${intlDateToPersianDate(article.updatedAt)}
                                </span>
                            </div>
                        </div>
                        <!--article main content-->
                        <div class="article--main-content relative">

                        </div>
                        <button type="button" class="show-more--btn w-max h-[56px] hidden justify-center items-center gap-x-2.5 mx-auto mt-2 px-5 text-xl bg-primary hover:bg-green-500 text-white select-none rounded-full transition-all">
                            <span>مشاهده بیشتر</span>
                            <svg class="shrink-0 w-5 h-5">
                                <use href="#chevron-down"></use>
                            </svg>
                        </button>
                    </div>
                    <!--comment section-->
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
                        </div>
                        <span class="text-zinc-700 dark:text-white">این قسمت توسط بک اند هندل نشده!</span>
                    </div>
                </div>
                <!--side content-->
                <div class="hidden lg:block col-span-1 space-y-5">
                    <!--short link-->
                    <div class="hidden lg:block px-5 py-6 bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                    <span class="side-bar--titles before:bg-amber-400 before:dark:bg-yellow-400 relative flex justify-start items-center mb-5 pr-4 font-danaDemiBold text-2xl dark:text-white">
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
                    <!--latest articles-->
                    <div class="hidden lg:block px-5 py-6 bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                    <span class="side-bar--titles before:bg-pink-500 before:dark:bg-rose-500 relative flex justify-start items-center mb-5 pr-4 font-danaDemiBold text-2xl dark:text-white">
                        جدیدترین نوشته ها
                    </span>
                        <div class="latest-articles flex flex-col mt-5 px-4 text-xl dark:text-white divide-y divide-dashed divide-slate-500 dark:divide-darkGray-500">

                        </div>
                    </div>
                    <!--categories-->
                    <div class="hidden lg:block px-5 py-6 bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none rounded-2xl overflow-hidden">
                    <span class="side-bar--titles before:bg-primary relative flex justify-start items-center mb-5 pr-4 font-danaDemiBold text-2xl dark:text-white">
                        دسته بندی  ها
                    </span>
                        <ul class="flex flex-col gap-y-6 pr-4 font-danaLight text-xl text-zinc-700 dark:text-white">
                            ${allCategories.length && allCategories.slice(0, 5).map(category => {
                                return `
                                    <li class="flex justify-start items-center gap-2">
                                        <svg class="w-3 h-3 text-primary">
                                            <use href="#triangle"></use>
                                        </svg>
                                        <a href="search-categories-articles.html?cat=${category.name}">${category.title}</a>
                                    </li>
                                `
    }).join('')}
                        </ul>
                    </div>
                </div>
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

    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    // make address bar dynamic
    const pageAddressBar = document.querySelector('.page-address-bar')
    pageAddressBar.insertAdjacentHTML('beforeend', `
        <div class="page-address--item">
            <a href="article-page.html?article=${article.shortName}">
                ${article.title}
            </a>
        </div>
    `)


    const articleMainContentWrapper = document.querySelector('.article--main-content')
    articleMainContentWrapper.insertAdjacentHTML('beforeend', `
        <!--article cover-->
        <img src="https://amingharibi-sabzlearn.liara.run/articles/${article.cover}" alt="${article.title}" class="w-full block mb-6 rounded-3xl">
        <!--article text-->
        <div class="article--text max-h-[800px] dark:text-white text-lg/7 lg:text-xl/9 overflow-hidden">
            ${article.body}
        </div>
    `)

    const articleBody = document.querySelector('.article--text')
    const showMoreBtn = document.querySelector('.show-more--btn')
    if (articleBody.offsetHeight > 800) {
        articleMainContentWrapper.insertAdjacentHTML('beforeend', `
            <!--lower shadow when showing show more button-->
            <div class="article--text__shadow absolute bottom-0 right-0 left-0 h-[190px] bg-gradient-to-t from-white dark:from-darkGray-800"></div>
        `)
        showMoreBtn.classList.replace('hidden', 'flex')
    }
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const shadow = document.querySelector('.article--text__shadow')
            shadow.classList.add('hidden')
            const text = document.querySelector('.article--text')
            text.classList.remove('max-h-[800px]')

            showMoreBtn.classList.add('hidden')
        })
    }

    const latestArticlesWrapper = document.querySelector('.latest-articles')
    lastEditedArticles.forEach(a => {
        latestArticlesWrapper.insertAdjacentHTML('beforeend', `
        <a href="article-page.html?article=${a.shortName}" class="py-3 line-clamp-3">
            ${a.title}
        </a>
    `)
    })

    const copyShortLinkBtn = document.querySelector(".short-link--copy-btn")
    copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, document.body))
}