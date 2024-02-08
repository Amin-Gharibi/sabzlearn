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

let $ = document
const seasonsTitle = document.querySelector('.topic__title')
const seasonBody = document.querySelector('.topic__body')
const copyShortLinkBtn = $.querySelector(".short-link--copy-btn")

// -------------------- Functions

window.addEventListener('load', async () => {
    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    const player = new Plyr('#player');

    const [data, course] = await Promise.all([getMe(), getCourseByShortName(getSearchParam('c'))])
    const courseComments = (await getCourseComments(course.name)).filter(comment => comment.isAccepted)

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
    const playerWrapper = document.querySelector('#player-wrapper')
    if (!course.sessions.length || !course.sessions[0].video) {
        playerWrapper.innerHTML = `
            <img src="http://localhost:4000/courses/${course.cover}" class="w-full h-full object-cover" alt="${course.name}">
        `
    } else {
        player.source = {
            type: "video",
            sources: [
                {
                    src: `http://localhost:4000/sessions/${course.sessions[0].video}`,
                    type: 'video/mp4'
                }
            ],
            poster: `http://localhost:4000/courses/${course.cover}`
        }
    }

    // customize main details of the course
    const courseNameTitle = document.querySelector('#course-name')
    const courseDescriptionPara = document.querySelector('#course-description')
    const coursePriceSection = document.querySelector('#course-price')
    const watchOrRegisterCourseBtns = document.querySelector('#watch-or-register-course-btn')
    courseNameTitle.innerHTML = course.name
    courseDescriptionPara.innerHTML = course.description
    coursePriceSection.innerHTML = `
        <span class="${!course.discount ? 'hidden ' : 'flex '}course--price__offered before:-right-[5px] before:-top-1 h-full text-2xl text-slate-500 dark:text-gray-500">
            ${course.price.toLocaleString()}
        </span>
        <span class="inline-flex justify-center items-center gap-x-1.5 flex-wrap font-danaDemiBold text-3xl text-zinc-700 dark:text-white mr-4 sm:mr-2 mb-5 sm:mb-0">
            ${course.discount === 100 ? 'رایگان!' : (course.price - (course.discount * course.price / 100)).toLocaleString()}
            ${course.discount === 100 ? '' : `<svg class="w-6 h-6">
                <use href="#toman"></use>
            </svg>`}
        </span>
    `
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
    const courseUpdatedAt = document.querySelector('#course-updated-at')
    const courseSupportTitle = document.querySelector('#course-support')
    const courseRequirements = document.querySelector('#course-requirement')
    const courseWatchingOption = document.querySelector('#course-watching-option')
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
    courseUpdatedAt.innerHTML = intlDateToPersianDate(course.updatedAt)
    courseSupportTitle.innerHTML = course.support
    courseRequirements.innerHTML = course.requirement
    courseWatchingOption.innerHTML = course.watchingOptions

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
            <img src="http://localhost:4000/profile/${course.creator.profile}" alt="${course.creator.name}" class="block w-[60px] h-[60px] object-cover rounded-full">
            <div>
                <h4 class="mb-1 font-danaDemiBold text-2xl dark:text-white">
                    ${course.creator.name}
                </h4>
                <p class="mt-1.5 text-sm text-slate-500 dark:text-darkGray-500">
                    ${course.creator.status || ''}
                </p>
            </div>
        </div>
        <a href="teacher-page.html?n=${course.creator.username}" class="inline-flex gap-x-1.5 text-sm text-slate-500 dark:text-darkGray-500">
            <svg class="w-5 h-5">
                <use href="#exit"></use>
            </svg>
            <span>
                مشاهده پروفایل
            </span>
        </a>
    `
    courseTeacherSectionDesktop.innerHTML = `
        <img src="http://localhost:4000/profile/${course.creator.profile}" alt="${course.creator.name}" class="block w-[90px] h-[90px] mb-2 object-cover rounded-full">
        <h4 class="mb-1 text-2xl dark:text-white">
            ${course.creator.name}
        </h4>
        <a href="teacher-page.html?n=${course.creator.username}" class="inline-flex gap-x-1.5 text-slate-500 dark:text-darkGray-500 text-sm">
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
        <img src="http://localhost:4000/profile/${data.profile}" alt="${data.name}" class="block w-10 h-10 md:w-14 md:h-14 object-cover rounded-full shrink-0">
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
                                <img src="http://localhost:4000/profile/${comment.answerContent.creator.profile}" alt="${comment.answerContent.creator.name}"
                                     class="block w-10 h-10 md:w-[60px] md:h-[60px] object-cover rounded-full">
                                <span class="w-[60px] h-[18px] ${comment.answerContent.creator.role.toLowerCase() === 'user' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${comment.answerContent.creator.role.toLowerCase() === 'admin' || comment.answerContent.creator.role.toLowerCase() === 'teacher' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
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
                                        <img src="http://localhost:4000/profile/${comment.answerContent.creator.profile}" alt="${comment.answerContent.creator.name}" class="block md:hidden w-10 h-10 object-cover rounded-full shrink-0">
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
                    <img src="http://localhost:4000/profile/${comment.creator.profile}" alt="${comment.creator.name}" class="block w-10 h-10 md:w-[60px] md:h-[60px] object-cover rounded-full">
                    <span class="w-[60px] h-[18px] ${course.creator.role.toLowerCase() === 'user' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${course.creator.role.toLowerCase() === 'admin' || course.creator.role.toLowerCase() === 'teacher' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
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
                            <img src="http://localhost:4000/profile${comment.creator.profile}" alt="${comment.creator.name}" class="block md:hidden w-10 h-10 object-cover rounded-full shrink-0">
                            <div class="shrink-0">
                                <!--username-->
                                <span class="font-danaMedium text-base md:text-xl dark:text-white">
                                    ${comment.creator.name}
                                </span>
                                <!--user role and release date-->
                                <div class="flex items-center gap-x-1.5 mt-1">
                                    <span class="md:hidden w-[60px] h-[18px] ${course.creator.role.toLowerCase() === 'user' ? 'bg-slate-500 dark:bg-slate-400/10 dark:text-slate-400' : ''}${course.creator.role.toLowerCase() === 'admin' || course.creator.role.toLowerCase() === 'teacher' ? 'bg-secondary-light dark:bg-[#4E81FB]/10 dark:text-[#4E81FB]' : ''} text-xs text-white text-center rounded">
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
        console.log(commentContentInput.value)
        const newCommentObj = {
            body: commentContentInput.value,
            courseShortName: course.shortName,
            score: 5,
            isAccepted: 0
        }
        fetch('http://localhost:4000/v1/comments', {
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
})

// Functions End

// ------------------- Event Listeners
seasonsTitle.addEventListener('click', event => toggleSeasonHandler(event.currentTarget, seasonBody, 'topic__title--active'))

copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, $.body))

// Event Listeners End