import {
    searchFormSubmissionHandler
} from "./utils/utils.js";


window.addEventListener('load', () => {
    // handle search input in the header of page
    const searchForms = document.querySelectorAll('.search-form')
    searchForms.forEach(form => {
        form.addEventListener('submit', event => searchFormSubmissionHandler(event))
    })
})