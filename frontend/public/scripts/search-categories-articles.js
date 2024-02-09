import {
    addSearchParam,
    categoryCoursesLowerOptionsHandler,
    createArticlesTemplate,
    filterArticles
} from "./utils/utils.js";
import {toggleMobileSortingMenu} from "./shared/shared-categories-pages.js";

window.addEventListener('load', async () => {
    let shownArticlesCount = 12
    const filteredArticles = await filterArticles(shownArticlesCount)

    const showFilteredArticles = articles => {
        const filteredArticlesWrapper = document.querySelector('.filtered-articles--wrapper')
        filteredArticlesWrapper.innerHTML = 'در حال لود...'
        filteredArticlesWrapper.innerHTML = createArticlesTemplate(articles)
        categoryCoursesLowerOptionsHandler(filteredArticles, shownArticlesCount)
    }
    showFilteredArticles(filteredArticles)

    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')
    let btnValue;
    const sortingButtonsClickHandler = async btn => {
        desktopSortingButtons.forEach(button => button.classList.remove('active'))
        mobileSortingButtons.forEach(button => button.classList.remove('bottom-sheet__item--selected'))

        btnValue = btn.getAttribute('data-value')
        const desktopBtn = Array.from(desktopSortingButtons).find(button => button.getAttribute('data-value') === btnValue)
        const mobileBtn = Array.from(mobileSortingButtons).find(button => button.getAttribute('data-value') === btnValue)
        desktopBtn.classList.add('active')
        mobileBtn.classList.add('bottom-sheet__item--selected')

        addSearchParam('sort', btnValue)
        showFilteredArticles(await filterArticles(shownArticlesCount))
    }

    // sort the courses as soon as uer clicks on each sorting button
    desktopSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn))
    })
    mobileSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn))
    })

    const showMoreArticlesBtn = document.querySelector('.show-more__content')
    showMoreArticlesBtn.addEventListener('click', async () => {
        shownArticlesCount += 12;
        showFilteredArticles(await filterArticles(shownArticlesCount))
    })

    const mobileSortingBtn = document.querySelector('.mobile-sort-btn')
    mobileSortingBtn.addEventListener('click', () => toggleMobileSortingMenu())
})