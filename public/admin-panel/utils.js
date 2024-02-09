import {compareItemsForLastCreated, getToken, quickSort} from "../scripts/utils/utils.js";

const getAllUsers = async () => {
    const response = await fetch('http://localhost:4000/v1/users', {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })

    return await response.json()
}

const getLatestSignedUpUsers = async () => {
    const allUsers = await getAllUsers()

    return quickSort(allUsers, compareItemsForLastCreated)
}

const getAllMenusForAdmin = async () => {
    const response = await fetch('http://localhost:4000/v1/menus/all', {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })
    // get all the menus and submenus together
    const menuAndSubmenus = await response.json()

    // just get the menus
    const menus = (!menuAndSubmenus.message && menuAndSubmenus.filter(item => {
        if (!item.parent) {
            return item
        }
    }) )|| []

    // just get the submenus
    const submenus = (!menuAndSubmenus.message && menuAndSubmenus.filter(item => {
        if (item.parent) {
            return item
        }
    }))

    let currentMenusSubmenus
    // add submenus to each menu's subMenu property
    menus.forEach(menu => {
        currentMenusSubmenus = []
        submenus.forEach(submenu => {
            if (submenu.parent._id === menu._id) {
                currentMenusSubmenus.push(submenu)
            }
        })
        menu.subMenus = currentMenusSubmenus
    })

    return menus
}


export {
    getAllUsers,
    getLatestSignedUpUsers,
    getAllMenusForAdmin
}