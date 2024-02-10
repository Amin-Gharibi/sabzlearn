import {
    showDetailsInAccountCenter,
    showHeaderMenusForDesktop,
    showHeaderMenusForMobile,
    toggleMobileMenu, toggleProfileDropDown, toggleSubMenusHandler
} from "./header.js";
import {getMe, logOut} from "../funcs/auth.js";
import {changeThemeHandler} from "../utils/utils.js";

window.addEventListener('load',  async () => {
    const [data] = await Promise.all([getMe(), showHeaderMenusForDesktop(), showHeaderMenusForMobile()])
    showDetailsInAccountCenter(data)

    const userProfileBtn = document.querySelector('#user-profile')
    const themeChangerBtn = document.querySelectorAll('.theme-changer-btn')
    const hamburgerMenuBtn = document.querySelector('#hamburger-menu-btn')
    const mobileMenuCloseBtn = document.querySelector('#mobile-menu--close-btn')
    const mobileMenuOverlay = document.querySelector('.mobile-menu--overlay')
    const mobileMenuListItems = document.querySelectorAll('.mobile-menu--list-items')

    const userProfilePicElem = document.querySelectorAll('.user-profile-pictures')
    userProfilePicElem.forEach(pic => {
        pic.setAttribute('src', (data ? `https://amingharibi-sabzlearn.liara.run/profile/${data.profile}` : ''))
    })

    const logOutBtn = document.querySelector('#logout-btn')
    logOutBtn.addEventListener('click', () => {
        logOut()
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
})