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

export { toggleSubMenusHandler }