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

export { toggleProfileDropDown }