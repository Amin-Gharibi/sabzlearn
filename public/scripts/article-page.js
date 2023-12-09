import {
    changeThemeHandler,
    toggleMobileMenu,
    toggleProfileDropDown,
    toggleSubMenusHandler,
    copyShortLinks,
    showDetailsInAccountCenter, showHeaderMenus
} from "./utils/utils.js";
import {getMe} from "./funcs/auth.js";

let $ = document
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const userProfileBtn = $.querySelector('#user-profile')
const mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items')
const copyShortLinkBtn = $.querySelector(".short-link--copy-btn")

window.addEventListener('load', async () => {
    // const data = await getMe()
    const [data] = await Promise.all([getMe(), showHeaderMenus()])
    showDetailsInAccountCenter(data)
})

themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})

mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)

userProfileBtn.addEventListener('click', toggleProfileDropDown)
mobileMenuListItems.forEach(item => {
    item.addEventListener('click', event => toggleSubMenusHandler(event))
})

copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, $.body))