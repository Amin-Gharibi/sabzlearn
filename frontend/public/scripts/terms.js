import {
    changeThemeHandler, searchFormSubmissionHandler
} from "./utils/utils.js";
import {getMe} from "./funcs/auth.js";
import {
    showDetailsInAccountCenter,
    toggleMobileMenu,
    toggleProfileDropDown,
    toggleSubMenusHandler
} from "./shared/header.js";

let $ = document
const userProfileBtn = $.querySelector('#user-profile')
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items')

window.addEventListener('load', async () => {
    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    const data = await getMe() // get user info

    showDetailsInAccountCenter(data) // show user details in header
})

mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)
mobileMenuListItems.forEach(item => {
    item.addEventListener('click', event => toggleSubMenusHandler(event))
})
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})