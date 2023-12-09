import {
    changeThemeHandler,
    getApplyBalance, getApplyCoursesCount, getApplyTicketsCount,
    getApplyUsername, getToken,
    toggleMobileMenu,
    toggleProfileDropDown
} from "./utils/utils.js";
import {getMe} from "./funcs/auth.js";
import {getTickets, showRecentTicketsHandler} from "./funcs/tickets.js";

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
    const [data, tickets] = await Promise.all([getMe(), getTickets()])
    getApplyUsername(data)
    getApplyBalance(data)
    getApplyCoursesCount(data)
    getApplyTicketsCount(tickets)
    showRecentTicketsHandler(tickets)
})

notificationCenterBtn.addEventListener('click', toggleNotificationsCenter)

mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})