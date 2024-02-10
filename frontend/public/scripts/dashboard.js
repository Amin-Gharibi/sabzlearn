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
const userProfileBtn = $.querySelector('#user-profile')
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const notificationCenterBtn = $.querySelector('.notification-center--btn')
const notificationCenterDropDown = $.querySelector('.notification-center-dropdown')
const dropDownOverlay = $.querySelector('.notifications-dropdown--overlay')
const notificationCenterWrapper = $.querySelector('.notification-center--wrapper')

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

window.addEventListener('load', async () => {
    const [data, tickets] = await Promise.all([getMe(), lastEditedTickets()])

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

            const departmentsResponse = await fetch('https://amingharibi-sabzlearn.liara.run/v1/tickets/departments')
            const departments = await departmentsResponse.json()
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
            const response = await fetch(`https://amingharibi-sabzlearn.liara.run/v1/tickets/answer/${getSearchParam('ticket')}`, {
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            })
            if (response.status === 403) {
                ticketPage.innerHTML = `
                <span class="text-zinc-700 dark:text-white text-xl text-center block">شما مجار به ورود به این صفحه نیستید!</span>
            `
            } else {
                const targetTicket = await response.json()
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
            const user = await getMe()
            targetSection.classList.remove('hidden')

            // set default values
            const profileImageTag = document.querySelector('#profile-image-tag')
            profileImageTag.setAttribute('src', `https://amingharibi-sabzlearn.liara.run/profile/${user.profile}`)

            const userPhoneNumberInput = document.querySelector('#phone')
            userPhoneNumberInput.setAttribute('value', user.phone)

            const userFirstNameInput = document.querySelector('#first_name')
            userFirstNameInput.setAttribute('value', (user.name).split(' ')[0])

            const userLastNameInput = document.querySelector('#last_name')
            userLastNameInput.setAttribute('value', (user.name).split(' ')[1] || '')

            const userNameInput = document.querySelector('#username')
            userNameInput.setAttribute('value', user.username)

            const userEmailInput = document.querySelector('#email')
            userEmailInput.setAttribute('value', user.email)

            const editAccountInfoForm = document.querySelector('#edit-account-info')
            editAccountInfoForm.setAttribute('data-value', user._id)

            const editAccountPasswordForm = document.querySelector('#edit-account-password')
            editAccountPasswordForm.setAttribute('data-value', user._id)

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
    }
})

notificationCenterBtn.addEventListener('click', toggleNotificationsCenter)

mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})