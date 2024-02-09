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

const removeFromLocalStorage = key => {
    return localStorage.removeItem(key)
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

const getApplyTotalPaidAmount = courses => {
    const totalPaidTitle = document.querySelector('#total-paid')
    const totalPaidAmount = courses.reduce((total, course) => total + course.price - (course.price * course.discount / 100), 0)
    totalPaidTitle.innerHTML = totalPaidAmount.toLocaleString()
}

const getApplyUsername = name => {
    const accountUsername = document.querySelectorAll('.account-center--username')

    accountUsername.forEach(title => {
        title.innerHTML = name
    })
}

const getApplyBalance = data => {
    const accountBalance = document.querySelectorAll('.account-center--balance')

    accountBalance.forEach(title => {
        title.innerHTML = data.__v
    })
}

const getApplyCoursesCount = courses => {
    const accountCoursesCountTitle = document.querySelectorAll('.account-center--courses-count')

    accountCoursesCountTitle.forEach(title => {
        title.innerHTML = courses.length
    })
}

const getApplyTicketsCount = tickets => {
    const accountTicketsCount = document.querySelectorAll('.account-center--tickets-count')

    accountTicketsCount.forEach(title => {
        title.innerHTML = tickets.length
    })
}

const getApplyOpenTicketsCount = tickets => {
    const openTicketsTitle = document.querySelector('.account-center--open-tickets-count')
    openTicketsTitle.innerHTML = tickets.filter(ticket => !ticket.answer).length
}

const getApplyClosedTicketsCount = tickets => {
    const openTicketsTitle = document.querySelector('.account-center--closed-tickets-count')
    openTicketsTitle.innerHTML = tickets.filter(ticket => ticket.answer).length
}

const getApplyPricedCoursesCount = courses => {
    const title = document.querySelector('.account-center--priced-courses-count')
    let count = 0
    courses.forEach(course => {
        if (course.discount) {
            count++
        }
    })
    title.innerHTML = count.toString()
    return count
}

const getCourses = async () => {
    const response = await fetch('http://localhost:4000/v1/courses')

    return response.json()
}

// quick sort complex
const compareItemsForLastEdited = (itemA, itemB) => {
    const timeA = new Date(itemA.updatedAt).getTime();
    const timeB = new Date(itemB.updatedAt).getTime();

    return timeA - timeB;
}

const compareItemsForLastCreated = (itemA, itemB) => {
    const timeA = new Date(itemA.createdAt).getTime();
    const timeB = new Date(itemB.createdAt).getTime();

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

    return quickSort(courses, compareItemsForLastEdited)
}

const getLastCreatedCourses = async () => {
    const courses = await getCourses()

    return quickSort(courses, compareItemsForLastCreated)
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
            <div class="${course.discount === 0 ? '' : 'relative '}${isSwiperSlide ? '!flex min-h-[414px] swiper-slide ' : 'flex '}flex-col overflow-hidden bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none dark:border dark:border-darkGray-700 rounded-2xl">
                <!--item image-->
                <div class="w-full h-[168px] rounded-2xl overflow-hidden">
                    <a href="course-page.html?c=${course.shortName}" title="${course.name}" class="w-full h-full">
                        <img src="http://localhost:4000/courses/${course.cover}" alt="${course.name}"
                             loading="lazy"
                             class="w-full h-full object-cover">
                    </a>
                </div>
                <!--item body-->
                <div class="${course.discount === 0 ? 'flex flex-col ' : 'pb-2 '}px-5 pt-2.5 flex-grow">
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
                            <a href="teacher-page.html?teacher=${course.creator.username}" class="flex items-center gap-x-1 hover:text-primary transition-colors">
                                <svg class="w-4 h-4">
                                    <use href="#user"></use>
                                </svg>
                                <span>
                                ${course.creator.name}
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
                            <span class="leading-[1px]">${(course.rate)?.toFixed(1) || 0}</span>
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
                        <div class="${course.discount === 0 ? 'flex' : 'hidden'} items-center gap-x-1.5 font-danaMedium text-xl text-primary">
                            <span>${course.price.toLocaleString()}</span>
                            <svg class="w-4 h-4">
                                <use href="#toman"></use>
                            </svg>
                        </div>
                        <div class="${course.discount === 0 ? 'hidden' : 'flex'} flex-col items-start gap-x-1.5 font-danaMedium text-xl text-primary">
                            <span class="course--price__offered">${course.price.toLocaleString()}</span>
                            <span class="course--price">
                                ${course.discount === 100 ? 'رایگان!' : ((course.price - (course.discount * course.price / 100)).toLocaleString())}
                                ${course.discount === 100 ? '' : `<svg class="w-4 h-4">
                                <use href="#toman"></use>
                            </svg>`}
                            </span>
                        </div>
                    </div>
                </div>
                <!--off percentage-->
                <div class="absolute top-2.5 right-2.5 ${course.discount === 0 ? 'hidden' : 'flex'} justify-center items-center w-12 h-6 font-danaDemiBold text-sm bg-primary text-white rounded-xl">
                <span>
                    ${course.discount}%
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
    const allCategories = await getAllCategories()

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

const getAllCategories = async () => {
    const allCourses = await getCourses();
    const response = await fetch('http://localhost:4000/v1/category')
    const allCategories = await response.json()
    let eachCategoryCourses;
    allCategories.forEach(category => {
        eachCategoryCourses = []
        allCourses.forEach(course => {
            if (course.categoryID._id === category._id) {
                eachCategoryCourses.push(course)
            }
        })
        category.coursesCount = eachCategoryCourses.length;
        category.courses = eachCategoryCourses
    })

    return allCategories;
}

// shows all the categories in the page
const showCourseCategories = async () => {
    const allCategories = await getAllCategories()
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
                            ${category.title}
                    </span>
                </label>
                <!--count-->
                <span class="text-sm text-darkGray-500 sm:text-slate-500 dark:text-darkGray-500">
                    ${category.coursesCount}
                </span>
            </div>
        `
    }).join('')

    courseCategoriesContainer.innerHTML = categoriesFinalStr
    mobileCourseCategoriesContainer.innerHTML = categoriesFinalStr
}

const getUserCourses = async () => {
    const response = await fetch(`http://localhost:4000/v1/users/courses`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })

    return await response.json()
}

// handles filtering data
const filterCourses = async (courses, filter) => {
    const categories = await getAllCategories()
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
            courses = courses.filter(course => course.discount === 100)
            break
        case 'presale' :
            courses = courses.filter(course => course.status === 1)
            break
        case 'enrolled' :
            const userCourses = await getUserCourses()
            courses = courses.filter(course => {
                return userCourses.some(userCourse => userCourse.course._id === course._id)
            })
            break
        case getSearchParam('cat') || Math.random() :
            // random is here because when sorting it enters here because both are null
            const targetCategory = categories.find(category => category.name === getSearchParam('cat'))
            const categoryCourses = targetCategory?.courses || []
            courses = courses.filter(course => {
                return categoryCourses.some(catCourse => catCourse._id === course._id)
            })
            break
        default :
            for (const category of categories) {
                const index = categories.indexOf(category);
                if (getSearchParam(`filter${index + 1}`) === 'yes') {
                    const targetCategory = categories.find(c => c._id === category._id)
                    const categoryCourses = targetCategory?.courses || []
                    courses = courses.filter(course => {
                        return categoryCourses.some(catCourse => catCourse._id === course._id)
                    })
                }
            }
            break
    }

    return courses
}

const intlDateToPersianDate = dateToConvert => {
    const date = new Date(dateToConvert)
    return new Intl.DateTimeFormat('fa-IR').format(date)
}

const createArticlesTemplate = articles => {
    let faDate;

    const finalArticlesStr = articles.map(article => {
        faDate = intlDateToPersianDate(article.updatedAt)

        return `
            <div class="flex flex-col overflow-hidden bg-white dark:bg-darkGray-800 shadow-light dark:shadow-none dark:border border-gray-700 rounded-2xl">
                    <!--article image-->
                    <div class="article--image__container">
                        <img src="http://localhost:4000/articles/${article.cover}" alt="${article.title}" class="w-full h-full">
                    </div>
                    <!--article content-->
                    <div class="flex flex-col flex-grow gap-y-8 px-5">
                        <!--upper content-->
                        <div class="pt-1.5">
                            <h4 class="font-danaMedium max-h-12 line-clamp-2 text-zinc-700 dark:text-white mb-2.5">
                                <a href="article-page.html?article=${article.shortName}">
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
                                <a href="article-page.html?article=${article.shortName}"
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

const getCategoryById = async id => {
    const response = await fetch('http://localhost:4000/v1/category')
    const categories = await response.json()
    return categories.find(cat => cat._id === id)
}

const getCourseCreatorDetails = async courseShortName => {
    const course = await getCourseByShortName(courseShortName)
    return course.creator
}

const toggleSeasonHandler = (title, body, className) => {
    title.classList.toggle(className)
    if (title.classList.contains(className)) {
        body.style.maxHeight = ``
    } else {
        body.style.maxHeight = "0px"
    }
}

const getLastEditedArticles = async () => {
    const articles = await getPublishedArticles()

    return quickSort(articles, compareItemsForLastEdited)
}

const filterArticles = async shownArticlesCount => {
    const articles = await getPublishedArticles()
    const filter = getSearchParam('sort')

    switch (filter) {
        case 'newest':
            return (await getLastEditedArticles()).slice(0, shownArticlesCount)
        case 'oldest':
            return (await getLastEditedArticles()).slice(0, shownArticlesCount).reverse()
        default:
            return articles.slice(0, shownArticlesCount)
    }
}

const getUserTickets = async () => {
    const response = await fetch(`http://localhost:4000/v1/tickets/user`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })

    return await response.json()
}

const lastEditedTickets = async () => {
    const tickets = await getUserTickets()

    return quickSort(tickets, compareItemsForLastEdited)
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
    createCourseTemplate,
    createArticlesTemplate,
    searchFormSubmissionHandler,
    clearSearchParams,
    getCourseByShortName,
    intlDateToPersianDate,
    calcCourseProgress,
    timeToHour,
    getCourseComments,
    getUserCourses,
    removeFromLocalStorage,
    getCategoryById,
    getCourseCreatorDetails,
    toggleSeasonHandler,
    getLastEditedArticles,
    filterArticles,
    categoryCoursesLowerOptionsHandler,
    getApplyTotalPaidAmount,
    getUserTickets,
    getApplyPricedCoursesCount,
    getApplyOpenTicketsCount,
    getApplyClosedTicketsCount,
    lastEditedTickets,
    quickSort,
    compareItemsForLastCreated,
    getAllCategories
}