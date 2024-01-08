import {
    copyShortLinks,
    getLastEditedArticles,
    getSearchParam,
    intlDateToPersianDate,
    searchFormSubmissionHandler
} from "./utils/utils.js";

const copyShortLinkBtn = document.querySelector(".short-link--copy-btn")

window.addEventListener('load', async () => {
    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })
    const response = await fetch(`http://localhost:4000/v1/articles/${getSearchParam('article')}`)
    const article = await response.json()
    console.log(article)
    const lastEditedArticles = (await getLastEditedArticles()).slice(0, 5)

    // make address bar dynamic
    const pageAddressBar = document.querySelector('.page-address-bar')
    pageAddressBar.insertAdjacentHTML('beforeend', `
        <div class="page-address--item">
            <a href="article-page.html?article=${article.shortName}">
                ${article.title}
            </a>
        </div>
    `)

    const articleTitleElem = document.querySelector('.article--title')
    articleTitleElem.innerHTML = article.title
    const articlePublisherElem = document.querySelector('.article--publisher')
    articlePublisherElem.innerHTML = article.creator.name
    const articleUpdatingDateElem = document.querySelector('.article--date')
    articleUpdatingDateElem.innerHTML = intlDateToPersianDate(article.updatedAt)
    const articleMainContentWrapper = document.querySelector('.article--main-content')
    articleMainContentWrapper.insertAdjacentHTML('beforeend', `
        <!--article cover-->
        <img src="http://localhost:4000/courses/covers/${article.cover}" alt="${article.title}" class="w-full block mb-6 rounded-3xl">
        <!--article text-->
        <div class="article--text max-h-[800px] dark:text-white text-lg/7 lg:text-xl/9 overflow-hidden">
            ${article.body}
        </div>
    `)

    const articleBody = document.querySelector('.article--text')
    const showMoreBtn = document.querySelector('.show-more--btn')
    if (articleBody.offsetHeight > 800) {
        articleMainContentWrapper.insertAdjacentHTML('beforeend', `
            <!--lower shadow when showing show more button-->
            <div class="article--text__shadow absolute bottom-0 right-0 left-0 h-[190px] bg-gradient-to-t from-white dark:from-darkGray-800"></div>
        `)
        showMoreBtn.classList.replace('hidden', 'flex')
    }
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const shadow = document.querySelector('.article--text__shadow')
            shadow.classList.add('hidden')
            const text = document.querySelector('.article--text')
            text.classList.remove('max-h-[800px]')

            showMoreBtn.classList.add('hidden')
        })
    }

    const latestArticlesWrapper = document.querySelector('.latest-articles')
    lastEditedArticles.forEach(a => {
        latestArticlesWrapper.insertAdjacentHTML('beforeend', `
        <a href="article-page.html?article=${a.shortName}" class="py-3 line-clamp-3">
            ${a.title}
        </a>
    `)
    })
})

copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, document.body))