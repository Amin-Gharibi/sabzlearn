import {
    getCategoryById, getCourseByShortName,
    getCourseCreatorDetails,
    getSearchParam, getToken,
    searchFormSubmissionHandler, timeToHour, toggleSeasonHandler
} from "./utils/utils.js";
import {getMe} from "./funcs/auth.js";


window.addEventListener('load', async () => {
    const accessingToSessionValidation = async () => {
        const user = await getMe()
        const course = await getCourseByShortName(getSearchParam('c'))
        const isSessionFree = course.sessions.find(session => session._id === getSearchParam('session')).free
        if (isSessionFree) {
            return course
        }
        return (user && user.courses.find(course => course.shortName === getSearchParam('c'))) || false
    }
    const targetCourse = await accessingToSessionValidation()
    if (targetCourse) {

        const response = await fetch(`https://amingharibi-sabzlearn.liara.run/v1/courses/${getSearchParam('c')}/${getSearchParam('session')}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        })
        const session = await response.json()

        // handle search input in the header of page
        const searchForms = document.querySelectorAll('.search-form')
        searchForms.forEach(form => {
            form.addEventListener('submit', event => searchFormSubmissionHandler(event))
        })
        // customize the addressBar
        const courseCategory = await getCategoryById(targetCourse.categoryID._id || targetCourse.categoryID)
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
        const player = new Plyr('#player');
        player.source = {
            type: "video",
            sources: [
                {
                    src: `https://amingharibi-sabzlearn.liara.run/sessions/${session.session.video}`,
                    type: 'video/mp4'
                }
            ],
            poster: `https://amingharibi-sabzlearn.liara.run/courses/${targetCourse.cover}`
        }
        const lessonNumber = document.querySelector('#lesson-number')
        const lessonTitle = document.querySelector('#lesson-title')
        lessonNumber.innerHTML = (() => {
            return  session.sessions.findIndex(s => s._id === session.session._id) + 1
        })()
        lessonTitle.innerHTML = session.session.title

        // customize session options
        const downloadVideoBtn = document.querySelector('#download-video-btn')
        downloadVideoBtn.setAttribute('href', `https://amingharibi-sabzlearn.liara.run/sessions/${session.session.video}`)
        downloadVideoBtn.setAttribute('download', session.session.title)

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
        const teacher = await getCourseCreatorDetails(targetCourse.shortName)
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
    } else {
        document.body.innerHTML = `
            <div class="h-screen flex justify-center items-center text-zinc-700 dark:text-white">
            شما مجاز به ورود به این صفحه نیستید!
            </div> 
        `
    }
})