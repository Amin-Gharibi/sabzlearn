import {getMe, logOut} from "../scripts/funcs/auth.js";

const user = await getMe()

if (user.role === 'USER' || !user) {
    location.replace('../../index.html')
}

const logOutBtn = document.querySelector('#log-out-btn')
logOutBtn.addEventListener('click', () => {
    logOut()
    location.replace('../../index.html')
})

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
    elem.setAttribute('src', `https://amingharibi-sabzlearn.liara.run/profile/${user.profile}`)
    elem.setAttribute('alt', user.name)
})