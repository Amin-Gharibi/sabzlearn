import {
    copyShortLinks,
    searchFormSubmissionHandler
} from "./utils/utils.js";

const copyShortLinkBtn = document.querySelector(".short-link--copy-btn")

window.addEventListener('load', async () => {
    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })
})

copyShortLinkBtn.addEventListener('click', event => copyShortLinks(event, document.body))