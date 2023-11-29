import {changeThemeHandler} from './funcs/ChangeThemeHandler'

let $ = document
const userProfileBtn = $.querySelector('#user-profile')
const userProfileDropDownWrapper = $.querySelector('.user-profile-dropdown')
const dropDownOverlay = $.querySelector('.profile-dropdown--overlay')
const themeChangerBtn = $.querySelectorAll('.theme-changer-btn')
const hamburgerMenuBtn = $.querySelector('#hamburger-menu-btn')
const mobileMenu = $.querySelector("#mobile-menu")
const mobileMenuCloseBtn = $.querySelector('#mobile-menu--close-btn')
const mobileMenuOverlay = $.querySelector('.mobile-menu--overlay')
const mobileMenuListItems = $.querySelectorAll('.mobile-menu--list-items')

// toggles the dropdown when user clicks on his profile picture
const toggleProfileDropDown = () => {
    userProfileDropDownWrapper.classList.toggle('user-profile-dropdown__show')
    dropDownOverlay.classList.toggle('profile-dropdown--overlay__show')

    let hasOverlayEvent = false

    if (hasOverlayEvent) {
        dropDownOverlay.removeEventListener('click', toggleProfileDropDown)
        hasOverlayEvent = false
    } else {
        dropDownOverlay.addEventListener('click', toggleProfileDropDown)
        hasOverlayEvent = true
    }
}

// changes theme as user loads the page
changeThemeHandler()

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

// toggles menu that gets opened as soon as user clicks on hamburger manu icon
const toggleMobileMenu = () => {
    mobileMenu.classList.contains('-right-64') ? mobileMenu.classList.replace('-right-64', 'right-0') && mobileMenuOverlay.classList.add('mobile-menu--overlay__show') : mobileMenu.classList.replace('right-0', '-right-64') && mobileMenuOverlay.classList.remove('mobile-menu--overlay__show')
}

// toggles the submenus of hamburger menu list items
const toggleSubMenusHandler = (event) => {
    // if the target had 2 children then it has submenu
    if (event.currentTarget.children.length === 2) {
        // open the submenu
        event.currentTarget.children[1].classList.toggle('mobile-menu--submenu__open')
        // rotate the chevron down svg
        event.currentTarget.children[0].children[0].classList.toggle('rotated-svg')
    }
}

// add event listeners
mobileMenuOverlay.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)
mobileMenuListItems.forEach(item => {
    item.addEventListener('click', event => toggleSubMenusHandler(event))
})
userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.forEach(btn => {
    btn.addEventListener('click', changeThemeHandler)
})
hamburgerMenuBtn.addEventListener('click', toggleMobileMenu)