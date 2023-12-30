import {getApplyBalance, getApplyUsername, getHeaderMenus} from "../utils/utils.js";

//toggle mobile menu
const toggleMobileMenu = () => {
    const mobileMenu = document.querySelector("#mobile-menu")
    const mobileMenuOverlay = document.querySelector('.mobile-menu--overlay')

    mobileMenu.classList.contains('-right-64') ? mobileMenu.classList.replace('-right-64', 'right-0') && mobileMenuOverlay.classList.add('mobile-menu--overlay__show') : mobileMenu.classList.replace('right-0', '-right-64') && mobileMenuOverlay.classList.remove('mobile-menu--overlay__show')
}

// toggles the dropdown when user clicks on his profile picture
const toggleProfileDropDown = () => {
    const userProfileDropDownWrapper = document.querySelector('.user-profile-dropdown')
    const dropDownOverlay = document.querySelector('.profile-dropdown--overlay')

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

// toggles the submenus of hamburger menu list items
const toggleSubMenusHandler = event => {
    // if the target had 2 children then it has submenu
    if (event.currentTarget.children.length === 2) {
        // open the submenu
        event.currentTarget.children[1].classList.toggle('mobile-menu--submenu__open')
        // rotate the chevron down svg
        event.currentTarget.children[0].children[0].classList.toggle('rotated-svg')
    }
}

// show user detail in header in account center
const showDetailsInAccountCenter = data => {
    const loginSignupBtnsWrapper = document.querySelector('.login-signup-btn--wrapper')
    const accountCenterBtn = document.querySelector('.account-center-btn')

    if (!data) {
        loginSignupBtnsWrapper.classList.remove('hidden')
        accountCenterBtn.classList.add('hidden')
    } else {
        loginSignupBtnsWrapper.classList.add('hidden')
        accountCenterBtn.classList.remove('hidden')

        getApplyUsername(data)
        getApplyBalance(data)
    }
}

const showHeaderMenusForDesktop = async () => {
    const data = await getHeaderMenus()
    const menus = data.map((menu, index) => {
        return `
            <li class="relative group flex justify-start items-center">
                <a href="${index === data.length - 1 ? 'article-page.html' : `search-categories.html?cat=${menu.cat}`}"
                   class="group-hover:text-primary flex justify-start items-center gap-x-1.5 transition-colors">
                    ${menu.title}
                    ${
            (menu.submenus.length && `
                            <svg class="w-4 h-4">
                                <use href="#chevron-down"></use>
                            </svg>
                        `) || ''
        }
                </a>
                ${
            menu.submenus.length && `
                        <div class="absolute top-full right-0 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 pt-1 xl:pt-4 transition-all">
                            <ul class="w-64 flex flex-col justify-start items-start gap-y-5 shadow-light rounded-2xl py-5 px-6 bg-white dark:bg-darkGray-700">
                                ${
                menu.submenus.map(submenu => {
                    return `<li class="w-full hover:text-primary transition-colors">
                                                                                    <a href="${submenu.href}" class="block overflow-hidden text-ellipsis whitespace-nowrap text-base">
                                                                                        ${submenu.title}
                                                                                    </a>
                                                                                </li>`
                }).join('')
            }
                            </ul>
                        </div>
                    ` || ''
        }
            </li>
        `
    }).join('')

    const navigationLinksWrapper = document.querySelector('.navigation-links--wrapper')
    navigationLinksWrapper.insertAdjacentHTML('beforeend', menus)
}

const showHeaderMenusForMobile = async () => {
    const data = await getHeaderMenus()

    const finalStr = data.map(menu => {

        return `
            <li class="mobile-menu--list-items">
                <span class="mobile-menu__link flex items-center justify-between ">
                    ${menu.title}
                    ${menu.submenus.length && `
                        <svg class="w-4 h-4">
                            <use href="#chevron-down"></use>
                        </svg>
                    ` || ''}
                </span>
                ${menu.submenus.length && `
                <!--submenu-->
                <ul class="mobile-menu__submenu">
                    ${menu.submenus.map(submenu => {
                        const submenuHrefSplitted = submenu.href.split('/')
                        const submenuHref = submenuHrefSplitted[submenuHrefSplitted.length - 1]
                        return `
                            <li>
                                <a href='course-page.html?c=${submenuHref}'>${submenu.title}</a>
                            </li>
                        `
                    }).join('')}
                </ul>
                ` || ''}
            </li>
        `
    }).join('')

    const wrapper = document.querySelector('.mobile-navigation-links--wrapper')
    wrapper.innerHTML = finalStr
}

export {toggleMobileMenu, toggleProfileDropDown, toggleSubMenusHandler, showDetailsInAccountCenter, getHeaderMenus, showHeaderMenusForDesktop, showHeaderMenusForMobile}