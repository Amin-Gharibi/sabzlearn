import {changeThemeHandler} from "./funcs/ChangeThemeHandler.js";
import {toggleMobileMenu} from "./funcs/toggleMobileMenu.js";
import {toggleProfileDropDown} from "./funcs/toggleProfileDropDown.js";
import {toggleSubMenusHandler} from "./funcs/toggleSubMenusHandler.js";
import {copyShortLinks} from "./funcs/copyShortLinks.js";

let $ = document
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn'),
    mobileMenuOverlay = $.querySelector('.mobile-menu--overlay'),
    mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn'),
    hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn'),
    userProfileBtn = $.querySelector('#user-profile'),
    mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items'),
    copyShortLinkBtn = $.querySelector(".short-link--copy-btn");

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