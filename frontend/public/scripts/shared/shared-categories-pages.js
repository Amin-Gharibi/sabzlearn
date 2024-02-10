import {getSearchParam} from "../utils/utils.js";

export const renderSharedCategoriesPages = () => {
    // get both buttons so if one changed in a size the other one also changes
    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')
    // activate sorting button on page loading
    if (getSearchParam('sort')) {
        desktopSortingButtons.forEach(btn => {
            btn.classList.remove('active')
        })
        mobileSortingButtons.forEach(btn => {
            btn.classList.remove('bottom-sheet__item--selected')
        })
        desktopSortingButtons.forEach(btn => {
            if (getSearchParam('sort') && btn.getAttribute('data-value') === getSearchParam('sort')) {
                btn.classList.add('active')
            }
        })
        mobileSortingButtons.forEach(btn => {
            if (getSearchParam('sort') && btn.getAttribute('data-value') === getSearchParam('sort')) {
                btn.classList.add('bottom-sheet__item--selected')
            }
        })
    }
    const defaultValue = document.querySelector('.sorting-data > button[data-value = "default"]')
    const sortedTitle = document.querySelector('#sorted-title')
    sortedTitle.innerHTML = (() => {
        switch (getSearchParam('sort')) {
            case 'cheapest':
                return 'ارزان ترین'
            case 'expensive':
                return 'گران ترین'
            case 'popular':
                return 'پر مخاطب ها'
            case 'newest':
                return 'جدید ترین'
            case 'oldest':
                return 'قدیمی ترین'
            default:
                return defaultValue.innerHTML
        }
    })()
}

export const toggleMobileSortingMenu = () => {
    const defaultValue = document.querySelector('.sorting-data > button[data-value = "default"]')
    const sortedTitle = document.querySelector('#sorted-title')
    sortedTitle.innerHTML = (() => {
        switch (getSearchParam('sort')) {
            case 'cheapest':
                return 'ارزان ترین'
            case 'expensive':
                return 'گران ترین'
            case 'popular':
                return 'پر مخاطب ها'
            case 'newest':
                return 'جدید ترین'
            case 'oldest':
                return 'قدیمی ترین'
            default:
                return defaultValue.innerHTML
        }
    })()
    const mobileSortingMenu = document.querySelector('.bottom-sheet')
    const mobileSortingMenuOverlay = document.querySelector('.mobile-bottom-sheet--overlay')
    const mobileSortingMenuCloseBtn = document.querySelector('.bottom-sheet--close-btn')
    mobileSortingMenu.classList.toggle('bottom-sheet__open')
    mobileSortingMenuOverlay.classList.toggle('mobile-bottom-sheet--overlay__show')

    mobileSortingMenuOverlay.addEventListener('click', toggleMobileSortingMenu)
    mobileSortingMenuCloseBtn.addEventListener('click', toggleMobileSortingMenu)

    const mobileSortingBtns = document.querySelectorAll('.mobile-sorting-data > button')
    mobileSortingBtns.forEach(btn => {
        btn.addEventListener('click', toggleMobileSortingMenu)
    })
}