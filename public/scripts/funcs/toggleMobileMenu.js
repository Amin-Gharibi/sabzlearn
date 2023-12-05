// toggles menu that gets opened as soon as user clicks on hamburger manu icon
const toggleMobileMenu = () => {
    const mobileMenu = document.querySelector("#mobile-menu")
    const mobileMenuOverlay = document.querySelector('.mobile-menu--overlay')

    mobileMenu.classList.contains('-right-64') ? mobileMenu.classList.replace('-right-64', 'right-0') && mobileMenuOverlay.classList.add('mobile-menu--overlay__show') : mobileMenu.classList.replace('right-0', '-right-64') && mobileMenuOverlay.classList.remove('mobile-menu--overlay__show')
}

export { toggleMobileMenu }