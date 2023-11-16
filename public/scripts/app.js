let $ = document
const userProfileBtn = $.querySelector('#user-profile')
const userProfileDropDownWrapper = $.querySelector('.user-profile-dropdown')
const dropDownOverlay = $.querySelector('.profile-dropdown--overlay')

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

userProfileBtn.addEventListener('click', toggleProfileDropDown)