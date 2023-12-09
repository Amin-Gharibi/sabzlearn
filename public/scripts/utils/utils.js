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

//toggle mobile menu
const toggleMobileMenu = () => {
    const mobileMenu = document.querySelector("#mobile-menu")
    const mobileMenuOverlay = document.querySelector('.mobile-menu--overlay')

    mobileMenu.classList.contains('-right-64') ? mobileMenu.classList.replace('-right-64', 'right-0') && mobileMenuOverlay.classList.add('mobile-menu--overlay__show') : mobileMenu.classList.replace('right-0', '-right-64') && mobileMenuOverlay.classList.remove('mobile-menu--overlay__show')
}

// toggles the dropdown when user clicks on his profile picture
const toggleProfileDropDown = () => {
    const userProfileDropDownWrapper = document.querySelector('.user-profile-dropdown')
    const dropDownOverlay = document.querySelector('.profile-dropdown--overlay')

    userProfileDropDownWrapper.classList.toggle('user-profile-dropdown__show')
    dropDownOverlay.classList.toggle('profile-dropdown--overlay__show')

    let hasOverlayEvent = false

    if (hasOverlayEvent) {
        dropDownOverlay.removeEventListener('click', toggleProfileDropDown)
        hasOverlayEvent = false
    } else {
        dropDownOverlay.addEventListener('click', toggleProfileDropDown)
        hasOverlayEvent = true
    }
}

// toggles the submenus of hamburger menu list items
const toggleSubMenusHandler = event => {
    // if the target had 2 children then it has submenu
    if (event.currentTarget.children.length === 2) {
        // open the submenu
        event.currentTarget.children[1].classList.toggle('mobile-menu--submenu__open')
        // rotate the chevron down svg
        event.currentTarget.children[0].children[0].classList.toggle('rotated-svg')
    }
}

const saveToLocalStorage = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = key => {
    return JSON.parse(localStorage.getItem(key))
}

const getToken = () => {
    return (JSON.parse(localStorage.getItem('user'))).token || null
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

// show user detail in header in account center
const showDetailsInAccountCenter = data => {
    const loginSignupBtnsWrapper = document.querySelector('.login-signup-btn--wrapper')
    const accountCenterBtn = document.querySelector('.account-center-btn')

    if (!data) {
        loginSignupBtnsWrapper.classList.remove('hidden')
        accountCenterBtn.classList.add('hidden')
    } else {
        loginSignupBtnsWrapper.classList.add('hidden')
        accountCenterBtn.classList.remove('hidden')

        getApplyUsername(data)
        getApplyBalance(data)
    }
}

const getHeaderMenus = async () => {
    const response = await fetch('http://localhost:4000/v1/menus', {
        method: 'GET',
    })
    return await response.json()
}

const showHeaderMenus = async () => {
    const data = await getHeaderMenus()

    const menus = data.map(menu => {
        return `
            <li class="relative group flex justify-start items-center">
                <a href="${menu.href}"
                   class="group-hover:text-primary flex justify-start items-center gap-x-1.5 transition-colors">
                    ${menu.title}
                    ${
                        (menu.submenus.length && `
                            <svg class="w-4 h-4">
                                <use href="#chevron-down"></use>
                            </svg>
                        `) || ''
                    }
                </a>
                ${
                    menu.submenus.length && `
                        <div class="absolute top-full right-0 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 pt-1 xl:pt-4 transition-all">
                            <ul class="w-64 flex flex-col justify-start items-start gap-y-5 shadow-light rounded-2xl py-5 px-6 bg-white dark:bg-darkGray-700">
                                ${
                                    menu.submenus.map(submenu => {
                                        return`<li class="w-full hover:text-primary transition-colors">
                                                                                    <a href="${submenu.href}" class="block overflow-hidden text-ellipsis whitespace-nowrap text-base">
                                                                                        ${submenu.title}
                                                                                    </a>
                                                                                </li>`
                                    }).join('')
                                }
                            </ul>
                        </div>
                    ` || ''
                }
            </li>
        `
    }).join('')

    const navigationLinksWrapper = document.querySelector('.navigation-links--wrapper')
    navigationLinksWrapper.insertAdjacentHTML('beforeend', menus)
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
};

const compareCoursesForLastCreated = (courseA, courseB) => {
    const timeA = new Date(courseA.createdAt).getTime();
    const timeB = new Date(courseB.createdAt).getTime();

    return timeA - timeB;
};

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


export {
    alert,
    changeThemeHandler,
    copyShortLinks,
    toggleMobileMenu,
    toggleProfileDropDown,
    toggleSubMenusHandler,
    saveToLocalStorage,
    getFromLocalStorage,
    getToken,
    showDetailsInAccountCenter,
    getApplyUsername,
    getApplyBalance,
    getApplyCoursesCount,
    getApplyTicketsCount,
    getHeaderMenus,
    showHeaderMenus,
    getCourses,
    getLastEditedCourses,
    getLastCreatedCourses,
    getArticles,
    getPublishedArticles,
    getPreSaleCourses,
    getPopularCourses
}