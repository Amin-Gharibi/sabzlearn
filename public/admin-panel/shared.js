import {getMe} from "../scripts/funcs/auth.js";

const user = await getMe()

// activate sidebar menu item
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu > ul > li")

const addressArr = location.href.split('/')
let currentLocation = addressArr[addressArr.length - 1];

if (addressArr[addressArr.length - 1].includes('.html') || !currentLocation) {
    currentLocation = addressArr[addressArr.length - 2]
}
sidebarMenuItems.forEach(item => {
    if (item.id === currentLocation) {
        item.classList.add("active-menu")
        item.children[0].href = '#'
    }
})

// make admin info dynamic
const adminNameElems = document.querySelectorAll('.admin-name')
adminNameElems.forEach(elem => {
    elem.innerHTML = user.name;
})
const adminProfPicElem = document.querySelectorAll('.home-profile-image > img')
adminProfPicElem.forEach(elem => {
    elem.setAttribute('src', `http://localhost:4000${user.profile}`)
    elem.setAttribute('alt', user.name)
})