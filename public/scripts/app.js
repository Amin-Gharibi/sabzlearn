import { changeThemeHandler } from './funcs/ChangeThemeHandler.js';
import { toggleProfileDropDown } from "./funcs/toggleProfileDropDown.js";
import { toggleMobileMenu } from "./funcs/toggleMobileMenu.js";
import { toggleSubMenusHandler } from "./funcs/toggleSubMenusHandler.js";

let $ = document
const userProfileBtn = $.querySelector('#user-profile')
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items')

// settings for swiper
window.addEventListener('load', () => {
    const swiper = new Swiper('.swiper', {
        direction: "horizontal",
        loop: true,
        autoplay: {
            delay: 2000,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 20,
            }
        }
    })
})

// add event listeners
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