import {changeThemeHandler} from "./funcs/ChangeThemeHandler.js";
import {toggleMobileMenu} from "./funcs/toggleMobileMenu.js";
import {toggleProfileDropDown} from "./funcs/toggleProfileDropDown.js";

let $ = document
const userProfileBtn = $.querySelector('#user-profile'),
    themeChangerBtn = $.querySelectorAll('.theme-changer-btn'),
    hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn'),
    mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn'),
    mobileMenuOverlay = $.querySelector('.mobile-menu--overlay'),
    notificationCenterBtn = $.querySelector('.notification-center--btn'),
    notificationCenterDropDown = $.querySelector('.notification-center-dropdown'),
    dropDownOverlay = $.querySelector('.notifications-dropdown--overlay'),
    notificationCenterWrapper = $.querySelector('.notification-center--wrapper');

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

notificationCenterBtn.addEventListener('click', toggleNotificationsCenter)

mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})