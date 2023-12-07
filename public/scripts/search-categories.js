import {changeThemeHandler} from "./funcs/ChangeThemeHandler.js";
import {toggleMobileMenu} from "./funcs/toggleMobileMenu.js";
import {toggleProfileDropDown} from "./funcs/toggleProfileDropDown.js";
import {toggleSubMenusHandler} from "./funcs/toggleSubMenusHandler.js";

let $ = document
const userProfileBtn = $.querySelector('#user-profile'),
    themeChangerBtn = $.querySelectorAll('.theme-changer-btn'),
    hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn'),
    mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn'),
    mobileMenuOverlay = $.querySelector('.mobile-menu--overlay'),
    mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items');





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