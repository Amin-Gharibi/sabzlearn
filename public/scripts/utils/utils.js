//project alert
function alert(wholeContainer, logoId, alertColor, alertTitle, alertDescription) {
    const oldAlertBox = document.querySelector('.alert-box')
    oldAlertBox && oldAlertBox.remove()

    wholeContainer.insertAdjacentHTML('afterend', `
        <div class="alert-box">
            <div class="alert--content-container">
                <!--alert logo-->
                <div>
                    <svg class="w-10 h-10 text-${alertColor}">
                        <use href="#${logoId}"></use>
                    </svg>    
                </div>
                <!--alert text content-->
                <div class="alert--content__text-side">
                    <span class="font-danaDemiBold text-xl dark:text-white">
                        ${alertTitle}
                    </span>
                    <p class="font-danaRegular dark:text-darkGray-500">
                        ${alertDescription}
                    </p>
                </div>
            </div>
            <div class="alert--progress bg-${alertColor}"></div>
        </div>
    `)

    const alertBox = document.querySelector('.alert-box'),
        alertProgress = document.querySelector('.alert--progress');
    let timer1, timer2;

    setTimeout(() => {
        alertBox.classList.add('active')
        alertProgress.classList.add('active')
        timer1 = setTimeout(() => {
            alertBox.classList.remove('active')
        }, 3000)
        timer2 = setTimeout(() => {
            alertProgress.classList.remove('active')
        }, 4000)
    }, 10)
}

//theme changer
const changeThemeHandler = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.remove('dark')
        localStorage.theme = 'light'
    } else {
        document.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
    }
}

//copy short-links
const copyShortLinks = (event, alertParent) => {
    navigator.clipboard.writeText(event.currentTarget.nextElementSibling.innerHTML)
        .then(() => alert(alertParent, 'check-circle', 'primary', 'موفق', 'لینک با موفقیت کپی شد!'))
        .catch(() => alert(alertParent, 'close-circle', 'red-alert', 'ناموفق', 'خطا در کپی کردن لینک'))
}

const saveToLocalStorage = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = key => {
    return JSON.parse(localStorage.getItem(key))
}

const getToken = () => {
    return getFromLocalStorage('user') && getFromLocalStorage('user').token || null
}

const getHeaderMenus = async () => {
    const response = await fetch('http://localhost:4000/v1/menus', {
        method: 'GET',
    })
    return await response.json()
}

const getApplyUsername = data => {
    const accountUsername = document.querySelectorAll('.account-center--username')

    accountUsername.forEach(title => {
        title.innerHTML = data.name
    })
}

const getApplyBalance = data => {
    const accountBalance = document.querySelectorAll('.account-center--balance')

    accountBalance.forEach(title => {
        title.innerHTML = data.__v
    })
}

const getApplyCoursesCount = data => {
    const accountCoursesCountTitle = document.querySelectorAll('.account-center--courses-count')

    accountCoursesCountTitle.forEach(title => {
        title.innerHTML = data.courses.length
    })
}

const getApplyTicketsCount = tickets => {
    const accountTicketsCount = document.querySelectorAll('.account-center--tickets-count')

    accountTicketsCount.forEach(title => {
        title.innerHTML = tickets.length
    })
}

const getCourses = async () => {
    const response = await fetch('http://localhost:4000/v1/courses')

    return response.json()
}

// quick sort complex
const compareCoursesForLastEdited = (courseA, courseB) => {
    const timeA = new Date(courseA.updatedAt).getTime();
    const timeB = new Date(courseB.updatedAt).getTime();

    return timeA - timeB;
}

const compareCoursesForLastCreated = (courseA, courseB) => {
    const timeA = new Date(courseA.createdAt).getTime();
    const timeB = new Date(courseB.createdAt).getTime();

    return timeA - timeB;
}

const compareCoursesForCheapest = (courseA, courseB) => {
    const priceA = courseA.price - (courseA.off * courseA.price / 100)
    const priceB = courseB.price - (courseB.off * courseB.price / 100)

    return priceB - priceA;
}

const compareCoursesForExpensive = (courseA, courseB) => {
    const priceA = courseA.price - (courseA.off * courseA.price / 100)
    const priceB = courseB.price - (courseB.off * courseB.price / 100)

    return priceA - priceB;
}

const compareCoursesForPopular = (courseA, courseB) => {
    const registersA = courseA.registers
    const registersB = courseB.registers

    return registersA - registersB;
}

const quickSort = (arr, compareCourses) => {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        const comparisonResult = compareCourses(arr[i], pivot);
        if (comparisonResult > 0) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left, compareCourses), pivot, ...quickSort(right, compareCourses)];
};

// quick sort complex end

const getLastEditedCourses = async () => {
    const courses = await getCourses()

    return quickSort(courses, compareCoursesForLastEdited)
}

const getLastCreatedCourses = async () => {
    const courses = await getCourses()

    return quickSort(courses, compareCoursesForLastCreated)
}

const getPreSaleCourses = async () => {
    const response = await fetch('http://localhost:4000/v1/courses/presell')

    return response.json()
}

const getPopularCourses = async () => {
    const response = await fetch('http://localhost:4000/v1/courses/popular')

    return response.json()
}

const getArticles = async () => {
    const response = await fetch('http://localhost:4000/v1/articles')

    return response.json()
}

const getPublishedArticles = async () => {
    const allArticles = await getArticles()

    return allArticles.filter(article => article.publish)
}

const timeToHour = time => {
    const separatedTime = time.split(':').map(copyOfTime => +copyOfTime)
    let finalAnswer;
    if (separatedTime.length === 3) {
        finalAnswer = separatedTime[0] * 3600 + separatedTime[1] * 60 + separatedTime[3]
    } else if (separatedTime.length === 2) {
        finalAnswer = separatedTime[0] * 60 + separatedTime[1]
    } else if (separatedTime.length === 1) {
        finalAnswer = separatedTime[0]
    }

    return finalAnswer / 3600;
}

const createCourseTemplate = async (courses, isSwiperSlide) => {
    const coursesFinalStr = await Promise.all(Array.from(courses).map(async course => {
        const courseWithSessions = await getCourseByShortName(course.shortName)
        const relativeMin = courseWithSessions.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0).toString().split('.')[1] || '0'
        const exactMin = (Number('0.' + relativeMin) * 60).toFixed(0)

        return `
            <div class="${course.off === 0 ? '' : 'relative '}${isSwiperSlide ? '!flex min-h-[414px] swiper-slide ' : 'flex '}flex-col overflow-hidden rounded-2xl bg-white dark:bg-darkGray-800">
                <!--item image-->
                <div class="w-full h-[168px] rounded-2xl overflow-hidden">
                    <a href="course-page.html?c=${course.shortName}" title="${course.name}" class="w-full h-full">
                        <img src="http://localhost:4000/courses/covers/${course.cover}" alt="${course.name}"
                             loading="lazy"
                             class="w-full h-full object-cover">
                    </a>
                </div>
                <!--item body-->
                <div class="${course.off === 0 ? 'flex flex-col ' : 'pb-2 '}px-5 pt-2.5 flex-grow">
                    <!--item tags-->
                    <div class="mb-2.5">
                        <a href="${course.categoryID.name}"
                           class="inline-flex items-center justify-center text-xs text-sky-500 dark:text-yellow-400 bg-sky-500/10 dark:bg-yellow-400/10 py-1 px-1.5 rounded">
                            ${course.categoryID.title}
                        </a>
                    </div>
                    <!--item title-->
                    <a href="course-page.html?c=${course.shortName}"
                       class="inline-flex font-danaMedium text-zinc-700 dark:text-white mb-2.5 max-h-12 line-clamp-2">
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
                                    ${(courseWithSessions.sessions.reduce((accumulator, currentValue) => accumulator + timeToHour(currentValue.time), 0) || '0').toString().split('.')[0].padStart(2, '0') + ':' + exactMin.padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                        <!--rate-->
                        <div class="flex items-center gap-x-1 text-amber-400 text-xs">
                            <span class="leading-[1px]">${(course.courseAverageScore).toFixed(1)}</span>
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
                        <div class="${course.off === 0 ? 'flex' : 'hidden'} items-center gap-x-1.5 font-danaMedium text-xl text-primary">
                            <span>${course.price.toLocaleString()}</span>
                            <svg class="w-4 h-4">
                                <use href="#toman"></use>
                            </svg>
                        </div>
                        <div class="${course.off === 0 ? 'hidden' : 'flex'} flex-col items-start gap-x-1.5 font-danaMedium text-xl text-primary">
                            <span class="course--price__offered">${course.price.toLocaleString()}</span>
                            <span class="course--price">
                                ${course.off === 100 ? 'رایگان!' : ((course.price - (course.off * course.price / 100)).toLocaleString())}
                                ${course.off === 100 ? '' : `<svg class="w-4 h-4">
                                <use href="#toman"></use>
                            </svg>`}
                            </span>
                        </div>
                    </div>
                </div>
                <!--off percentage-->
                <div class="absolute top-2.5 right-2.5 ${course.off === 0 ? 'hidden' : 'flex'} justify-center items-center w-12 h-6 font-danaDemiBold text-sm bg-primary text-white rounded-xl">
                <span>
                    ${course.off}%
                </span>
                </div>
            </div>
        `
    }))

    return coursesFinalStr.join('')
}

const addSearchParam = (key, value) => {
    const currentUrl = new URL(window.location.href)
    const searchParams = currentUrl.searchParams
    searchParams.set(key, value)
    currentUrl.search = searchParams.toString()

    window.history.replaceState({}, '', currentUrl.href)
}

const getSearchParam = key => {
    const currentUrl = new URL(window.location.href)
    const searchParams = currentUrl.searchParams

    return searchParams.get(key)
}

const removeSearchParam = key => {
    const currentUrl = new URL(window.location.href)
    const searchParams = currentUrl.searchParams
    searchParams.delete(key)

    window.history.replaceState({}, '', currentUrl.href)
}

const clearSearchParams = () => {
    const currentUrl = new URL(window.location.href)

    location.href = currentUrl.href.split('?')[0]
}

// when the url changes this function gets called and applies the filters
const showCoursesBasedOnUrl = async (courses, shownCoursesCount) => {
    const filteredCoursesWrapper = document.querySelector('.filtered-courses--wrapper')
    filteredCoursesWrapper.innerHTML = 'در حال لود...'
    let finalCourses = courses;
    let onlyThisCatCourses;
    const allCategories = await getAllEnCategories()

    // applies the changes in the sort of the courses
    if (!getSearchParam('sort') || getSearchParam('sort') === 'default' || getSearchParam('sort') === 'cheapest' || getSearchParam('sort') === 'expensive' || getSearchParam('sort') === 'popular') {
        finalCourses = await filterCourses(courses, getSearchParam('sort'))
    }

    if (getSearchParam('cat')) {
        onlyThisCatCourses = await filterCourses(courses, getSearchParam('cat'))
        finalCourses = finalCourses.filter(course => {
            return onlyThisCatCourses.some(catCourse => catCourse._id === course._id)
        })
    }

    // filters the courses based on their name and description
    if (getSearchParam('s')) {
        finalCourses = finalCourses.filter(course => course.name.includes(getSearchParam('s')) || course.description.includes(getSearchParam('s')))
    }

    // filters the courses based on user category choices
    for (const category of allCategories) {
        const index = allCategories.indexOf(category);
        if (getSearchParam(`filter${index + 1}`) && getSearchParam(`filter${index + 1}`) === 'yes') {
            onlyThisCatCourses = await filterCourses(courses, 'filters')
            finalCourses = finalCourses.filter(course => {
                return onlyThisCatCourses.some(catCourse => catCourse._id === course._id)
            })
        }
    }

    // filters the courses based on if user has turned on lower side toggles or not
    const allAsideLowerFilters = document.querySelectorAll('.filtering--special-items__input')
    for (const filter of allAsideLowerFilters) {
        if (getSearchParam(filter.getAttribute('data-value')) && getSearchParam(filter.getAttribute('data-value')) === 'yes') {
            onlyThisCatCourses = await filterCourses(courses, filter.getAttribute('data-value'), shownCoursesCount)
            finalCourses = finalCourses.filter(course => {
                return onlyThisCatCourses.some(catCourse => catCourse._id === course._id)
            })
        }
    }

    // updates the inner html of the container
    filteredCoursesWrapper.innerHTML = await createCourseTemplate(finalCourses.slice(0, shownCoursesCount), false)
    // updates the note at the end of the page
    categoryCoursesLowerOptionsHandler(finalCourses, shownCoursesCount)
}

// changes the note at the end of the page
const categoryCoursesLowerOptionsHandler = (courses, shownCoursesCount) => {
    const showMoreCoursesTitle = document.querySelector('.show-more')
    const allShownTitle = document.querySelector('.all-courses__loaded')
    const noCoursesFoundTitle = document.querySelector('.no-course-with-filter')

    if (!courses.length) {
        showMoreCoursesTitle.classList.replace('flex', 'hidden')
        allShownTitle.classList.add('hidden')
        noCoursesFoundTitle.classList.remove('hidden')
    } else if (courses.length > shownCoursesCount) {
        showMoreCoursesTitle.classList.replace('hidden', 'flex')
        allShownTitle.classList.add('hidden')
        noCoursesFoundTitle.classList.add('hidden')
    } else if (courses.length < shownCoursesCount) {
        showMoreCoursesTitle.classList.replace('flex', 'hidden')
        allShownTitle.classList.remove('hidden')
        noCoursesFoundTitle.classList.add('hidden')
    }
}

// get all categories persian name
const getAllFaCategories = async () => {
    const allCourses = await getCourses()
    const categories = []
    let isAlreadyInCategories;
    allCourses.forEach(course => {
        isAlreadyInCategories = categories.find(category => category === course.categoryID.title)
        if (!isAlreadyInCategories) {
            categories.push(course.categoryID.title)
        }
    })

    return categories
}

// get all categories english name
const getAllEnCategories = async () => {
    const allCourses = await getCourses()
    const categories = []
    let isAlreadyInCategories;
    allCourses.forEach(course => {
        isAlreadyInCategories = categories.find(category => category === course.categoryID.name)
        if (!isAlreadyInCategories) {
            categories.push(course.categoryID.name)
        }
    })

    return categories
}

// get each categories courses by searching with categories persian name
const getEachCategoriesCoursesFa = async categories => {
    const allCourses = await getCourses()
    const categoryCourses = []

    if (typeof categories !== "string") {
        Array.from(categories).forEach(() => categoryCourses.push([]))
        Array.from(categories).forEach((category, index) => {
            allCourses.forEach(course => {
                if (course.categoryID.title === category) {
                    categoryCourses[index].push(course)
                }
            })
        })
    } else {
        allCourses.forEach(course => {
            if (course.categoryID.title === category) {
                categoryCourses.push(course)
            }
        })
    }
    return categoryCourses
}

// get each categories courses by searching with categories english name
const getEachCategoriesCoursesEn = async categories => {
    const allCourses = await getCourses()
    const categoryCourses = []

    if (typeof categories !== 'string') {
        Array.from(categories).forEach(() => categoryCourses.push([]))
        Array.from(categories).forEach((category, index) => {
            allCourses.forEach(course => {
                if (course.categoryID.name === category) {
                    categoryCourses[index].push(course)
                }
            })
        })
    } else {
        allCourses.forEach(course => {
            if (course.categoryID.name === categories) {
                categoryCourses.push(course)
            }
        })
    }
    return categoryCourses
}

// shows all the categories in the page
const showCourseCategories = async () => {
    const allCategories = await getAllFaCategories()
    const categoryCourses = await getEachCategoriesCoursesFa(allCategories)
    const courseCategoriesContainer = document.querySelector('.course-categories--wrapper')
    const mobileCourseCategoriesContainer = document.querySelector('.category-mobile__body')

    const categoriesFinalStr = allCategories.map((category, index) => {
        return `
            <div class="w-full flex justify-between items-center">
                <!--tick and title-->
                <label class="relative flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" class="absolute w-0 h-0 opacity-0" data-value="filter${index + 1}">
                    <span class="categories--toggle w-4 h-4 shrink-0 rounded-[2px] bg-gray-200 dark:bg-darkGray transition-all select-none"></span>
                    <span class="text-sm sm:text-base dark:text-white select-none">
                            ${category}
                    </span>
                </label>
                <!--count-->
                <span class="text-sm text-darkGray-500 sm:text-slate-500 dark:text-darkGray-500">
                    ${categoryCourses[index].length}
                </span>
            </div>
        `
    }).join('')

    courseCategoriesContainer.innerHTML = categoriesFinalStr
    mobileCourseCategoriesContainer.innerHTML = categoriesFinalStr
}

// handles filtering data
const filterCourses = async (courses, filter) => {
    const categories = await getAllEnCategories()
    switch (filter) {
        case 'default' || false :
            courses = await getCourses()
            break
        case 'cheapest' :
            courses = quickSort(courses, compareCoursesForCheapest)
            break
        case 'expensive' :
            courses = quickSort(courses, compareCoursesForExpensive)
            break
        case 'popular' :
            courses = quickSort(courses, compareCoursesForPopular)
            break
        case 'only_free' :
            courses = courses.filter(course => course.off === 100)
            break
        case 'presale' :
            courses = courses.filter(course => course.status === 'presale')
            break
        case 'enrolled' :
            const response = await fetch(`http://localhost:4000/v1/users/courses`, {
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            })
            const userCourses = await response.json()
            courses = courses.filter(course => {
                return userCourses.some(userCourse => userCourse._id === course._id)
            })
            break
        case getSearchParam('cat') || Math.random() :
            // random is here because when sorting it enters here because both are null
            console.log(getSearchParam('cat'))
            const categoryCourses = await getEachCategoriesCoursesEn(getSearchParam('cat'))
            courses = courses.filter(course => {
                return categoryCourses.some(catCourse => catCourse._id === course._id)
            })
            break
        default :
            for (const category of categories) {
                const index = categories.indexOf(category);
                if (getSearchParam(`filter${index + 1}`) === 'yes') {
                    const categoryCourses = await getEachCategoriesCoursesEn(category)

                    courses = courses.filter(course => {
                        return categoryCourses.some(catCourse => catCourse._id === course._id)
                    })
                }
            }
            break
    }

    return courses
}

const intlDateToPersianDate = (year, month, day) => {
    const date = new Date(year, month, day)
    return new Intl.DateTimeFormat('fa-IR').format(date)
}

const createArticlesTemplate = articles => {
    let day, month, year, date, faDate;

    const finalArticlesStr = articles.map(article => {

        year = parseInt(article.updatedAt.slice(0, 4))
        month = parseInt(article.updatedAt.slice(5, 7))
        day = parseInt(article.updatedAt.slice(8, 10))
        faDate = intlDateToPersianDate(year, month, day)

        return `
            <div class="flex flex-col overflow-hidden bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none dark:border border-gray-700 rounded-2xl">
                    <!--article image-->
                    <div class="article--image__container">
                        <img src="http://localhost:4000/courses/covers/${article.cover}" alt="${article.title}" class="w-full h-full">
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

    return finalArticlesStr
}

const searchFormSubmissionHandler = event => {
    event.preventDefault()
    const searchInput = event.target.querySelector('input')

    location.href = `search-categories.html?s=${searchInput.value}`
}

const getCourseByShortName = async shortName => {
    const response = await fetch(`http://localhost:4000/v1/courses/${shortName}`)
    return response.json()
}

const calcCourseProgress = course => {
    const uploadedSessions = course.sessions.length
    const promisedSessions = course.promisedSessions

    return (uploadedSessions * 100 / promisedSessions).toFixed(0)
}

const getAllComments = async () => {
    const response = fetch('http://localhost:4000/v1/comments')

    return (await response).json()
}

const getCourseComments = async courseName => {
    const allComments = await getAllComments()

    return allComments.filter(comment => comment.course === courseName)
}

export {
    alert,
    changeThemeHandler,
    copyShortLinks,
    saveToLocalStorage,
    getFromLocalStorage,
    getToken,
    getHeaderMenus,
    getApplyUsername,
    getApplyBalance,
    getApplyCoursesCount,
    getApplyTicketsCount,
    getCourses,
    getLastEditedCourses,
    getLastCreatedCourses,
    getArticles,
    getPublishedArticles,
    getPreSaleCourses,
    getPopularCourses,
    showCourseCategories,
    showCoursesBasedOnUrl,
    addSearchParam,
    removeSearchParam,
    getSearchParam,
    getAllEnCategories,
    createCourseTemplate,
    createArticlesTemplate,
    getEachCategoriesCoursesEn,
    getAllFaCategories,
    searchFormSubmissionHandler,
    clearSearchParams,
    getCourseByShortName,
    intlDateToPersianDate,
    calcCourseProgress,
    timeToHour,
    getCourseComments
}