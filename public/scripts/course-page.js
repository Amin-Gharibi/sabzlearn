let $ = document
const seasonsTitle = $.querySelectorAll('.topic__title')
const seasonsEpsContainer = $.querySelectorAll('.topic__body')

const toggleSeasonHandler = (title, index) => {
    console.log(title, index)
    title.classList.toggle('topic__title--active')
    if (title.classList.contains('topic__title--active')) {
        let numberOfEps = 2
        seasonsEpsContainer[index].style.maxHeight = `500px`
    } else {
        seasonsEpsContainer[index].style.maxHeight = "0px"
    }
}

seasonsTitle.forEach((title, index) => {
    title.addEventListener('click', () => toggleSeasonHandler(title, index))
})