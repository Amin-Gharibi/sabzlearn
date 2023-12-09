import {
    changeThemeHandler,
    toggleProfileDropDown,
    toggleMobileMenu,
    toggleSubMenusHandler,
    copyShortLinks,
    showDetailsInAccountCenter, showHeaderMenus
} from './utils/utils.js';
import {getMe} from "./funcs/auth.js";

let $ = document
const seasonsTitle = $.querySelectorAll('.topic__title')
const seasonsEpsContainer = $.querySelectorAll('.topic__body')
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const userProfileBtn = $.querySelector('#user-profile')
const mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const copyShortLinkBtn = $.querySelector(".short-link--copy-btn")

// -------------------- Functions

window.addEventListener('load', async () => {
    const [data] = await Promise.all([getMe(), showHeaderMenus()])
    showDetailsInAccountCenter(data)
})

const toggleSeasonHandler = (title, index) => {
    title.classList.toggle('topic__title--active')
    if (title.classList.contains('topic__title--active')) {
        let numberOfEps = 2
        seasonsEpsContainer[index].style.maxHeight = `500px`
    } else {
        seasonsEpsContainer[index].style.maxHeight = "0px"
    }
}

// Functions End

// ------------------- Event Listeners

seasonsTitle.forEach((title, index) => {
    title.addEventListener('click', () => toggleSeasonHandler(title, index))
})
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})
userProfileBtn.addEventListener('click', toggleProfileDropDown)
mobileMenuListItems.forEach(item => {
    item.addEventListener('click', event => toggleSubMenusHandler(event))
})
mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)

copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, $.body))

// Event Listeners End