let $ = document
const userProfileBtn = $.querySelector('#user-profile')
const userProfileDropDownWrapper = $.querySelector('.user-profile-dropdown')
const dropDownOverlay = $.querySelector('.profile-dropdown--overlay')
const themeChangerBtn = $.querySelector('#theme-changer-btn')

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

const changeThemeHandler = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        $.documentElement.classList.remove('dark')
        localStorage.theme = 'light'
    } else {
        $.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
    }
}

userProfileBtn.addEventListener('click', toggleProfileDropDown)
themeChangerBtn.addEventListener('click', changeThemeHandler)