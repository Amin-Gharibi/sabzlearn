import {getCourses, getSearchParam, showCoursesBasedOnUrl} from "./utils/utils.js";
import {sortingButtonsClickHandler} from "./shared/shared-between-teacher-and-categories-page.js";
import {toggleMobileSortingMenu} from "./shared/shared-categories-pages.js";

window.addEventListener('load', async () => {
    const courses = (await getCourses()).filter(course => course.creator.username === getSearchParam('teacher'));
    // get the courses based on teacher name
    let shownCoursesCount = 12
    await showCoursesBasedOnUrl(courses, shownCoursesCount)

    const teacher = courses[0].creator
    const teacherProfilePic = document.querySelector('#teacher-profile-pic')
    teacherProfilePic.setAttribute('src', `https://amingharibi-sabzlearn.liara.run/profile/${teacher.profile}`)
    teacherProfilePic.setAttribute('alt', teacher.name)

    const teacherName = document.querySelector('#teacher-name')
    teacherName.innerHTML = teacher.name

    const desktopSortingButtons = document.querySelectorAll('.sorting-data:not(.mobile-sorting-data) > button')
    const mobileSortingButtons = document.querySelectorAll('.mobile-sorting-data > button')

    // sort the courses as soon as uer clicks on each sorting button
    desktopSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn, courses, shownCoursesCount))
    })
    mobileSortingButtons.forEach(btn => {
        btn.addEventListener('click', async () => await sortingButtonsClickHandler(btn, courses, shownCoursesCount))
    })

    const mobileSortingBtn = document.querySelector('.mobile-sort-btn')
    mobileSortingBtn.addEventListener('click', toggleMobileSortingMenu)
})