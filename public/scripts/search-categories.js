import {
    addSearchParam,
    clearSearchParams,
    getAllEnCategories, getAllFaCategories,
    getCourses,
    getSearchParam,
    removeSearchParam, searchFormSubmissionHandler,
    showCourseCategories,
    showCoursesBasedOnUrl,
} from "./utils/utils.js";

window.addEventListener('load', async () => {
    // set page title handling
    if (getSearchParam('cat') || getSearchParam('s')) {
        const categoriesWrapper = document.querySelector('.course-categories--wrapper')
        const pageTitle = document.querySelector('.page-title')
        categoriesWrapper.classList.remove('sm:block')
        // change page title
        const [enCategories, faCategories] = await Promise.all([getAllEnCategories(), getAllFaCategories()])
        // create an object with english categories as key and persian categories as value
        const resultObject = enCategories.reduce((result, key, index) => {
            result[key] = faCategories[index];
            return result;
        }, {});
        pageTitle.innerHTML = (getSearchParam('s') && `جستجو: ${getSearchParam('s')}`) || (resultObject[getSearchParam('cat')] || getSearchParam('cat'))
        if (getSearchParam('s')) {
            const searchInput = document.querySelector('.search-cat-form input:first-child')
            searchInput.value = getSearchParam('s')
        }
    }

    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })

    let shownCoursesCount = 12
    let courses = await getCourses()
    // get all asynchronous functions
    const [courseCategories] = await Promise.all([getAllEnCategories(), showCourseCategories(), showCoursesBasedOnUrl(courses, shownCoursesCount)])

    // get both buttons so if one changed in a size the other one also changes
    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')
    let btnValue;
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

    const sortingButtonsClickHandler = async btn => {
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

    // sort the courses as soon as uer clicks on each sorting button
    desktopSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn))
    })
    mobileSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn))
    })

    // activate category checkboxes and lower filters on page loading
    const courseCategoryCheckboxes = document.querySelectorAll('.course-categories--wrapper input')
    courseCategories.forEach((category, index) => {
        if (getSearchParam(`filter${index + 1}`) && getSearchParam(`filter${index + 1}`) === 'yes') {
            courseCategoryCheckboxes[index].checked = true
        }
    })
    const courseLowerAsideFilters = document.querySelectorAll('.filtering--special-items__input')
    courseLowerAsideFilters.forEach(filter => {
        if (getSearchParam(filter.getAttribute('data-value')) && getSearchParam(filter.getAttribute('data-value')) === 'yes') {
            filter.checked = true
        }
    })

    // activate category checkboxes as soon as user clicks on each of them
    const searchCategorizeForms = document.querySelectorAll('.search-cat-form')
    for (const searchCategorizeForm of searchCategorizeForms) {
        searchCategorizeForm.addEventListener('submit', async event => {
            event.preventDefault()
            const inputs = document.querySelectorAll('.search-cat-form input')
            addSearchParam('s', inputs[0].value)
            for (const input of Array.from(inputs).slice(1)) {
                if (input.checked) {
                    addSearchParam(input.getAttribute('data-value'), 'yes')
                }
            }
            if (getSearchParam('null')) {
                removeSearchParam('null')
            }
            await showCoursesBasedOnUrl(courses, shownCoursesCount)
        })
        searchCategorizeForm.addEventListener('change', async event => {
            // do this to activate and deactivate all inputs with the same data-value in mobile and desktop size at the same time!
            const inputs = document.querySelectorAll('.search-cat-form input');
            const allInputsWSameValue = Array.from(inputs).filter(input => input.getAttribute('data-value') === event.target.getAttribute('data-value'))

            if (getSearchParam(event.target.getAttribute('data-value'))) {
                removeSearchParam(event.target.getAttribute('data-value'))
                allInputsWSameValue.forEach(input => input.checked = false)
            } else {
                addSearchParam(event.target.getAttribute('data-value'), 'yes')
                allInputsWSameValue.forEach(input => input.checked = true)
            }
            await showCoursesBasedOnUrl(courses, shownCoursesCount)
        })
    }
})


const toggleMobileCategoriesMenu = () => {
    const categoriesContainer = document.querySelector('.category-mobile__body')
    const categoriesContainerArrowDownIcon = document.querySelector('.category-mobile__header svg')
    categoriesContainer.classList.toggle('category-mobile__body-open')
    categoriesContainerArrowDownIcon.classList.toggle('rotated-svg')
}

const mobileFilterBtn = document.querySelector('.mobile-filter-btn')
const toggleMobileFilterMenu = () => {
    const mobileFilterMenu = document.querySelector('.mobile-filter')
    mobileFilterMenu.classList.toggle('mobile-filter__open')

    const mobileFilterMenuCloseBtn = document.querySelector('.filter__close-btn')
    mobileFilterMenuCloseBtn.addEventListener('click', toggleMobileFilterMenu)

    const clearAllFiltersBtn = document.querySelector('#clear-all-filters')
    clearAllFiltersBtn.addEventListener('click', () => {
        clearSearchParams()
    })

    const mobileCategoriesHeader = document.querySelector('.category-mobile__header')
    mobileCategoriesHeader.addEventListener('click', toggleMobileCategoriesMenu)
}
mobileFilterBtn.addEventListener('click', toggleMobileFilterMenu)


const mobileSortingBtn = document.querySelector('.mobile-sort-btn')
const toggleMobileSortingMenu = () => {
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
mobileSortingBtn.addEventListener('click', toggleMobileSortingMenu)

const applyMobileFiltersBtn = document.querySelector('.apply-mobile-filters')
applyMobileFiltersBtn.addEventListener('click', toggleMobileFilterMenu)