import {addSearchParam, showCoursesBasedOnUrl} from "../utils/utils.js";

let btnValue;
const sortingButtonsClickHandler = async (btn, courses, shownCoursesCount) => {
    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')

    desktopSortingButtons.forEach(button => button.classList.remove('active'))
    mobileSortingButtons.forEach(button => button.classList.remove('bottom-sheet__item--selected'))

    btnValue = btn.getAttribute('data-value')
    const desktopBtn = Array.from(desktopSortingButtons).find(button => button.getAttribute('data-value') === btnValue)
    const mobileBtn = Array.from(mobileSortingButtons).find(button => button.getAttribute('data-value') === btnValue)
    desktopBtn.classList.add('active')
    mobileBtn.classList.add('bottom-sheet__item--selected')

    addSearchParam('sort', btnValue)
    await showCoursesBasedOnUrl(courses, shownCoursesCount)
}

export { sortingButtonsClickHandler }