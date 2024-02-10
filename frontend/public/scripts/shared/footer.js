import {getPopularCourses} from "../utils/utils.js";

export const footerFetches = async () => {
    return (await getPopularCourses())
}

export const renderFooter = popularCourses => {
    const useFullCoursesContainer = document.querySelector("#footer-usefull-courses");

    const finalStr = popularCourses.slice(0, 4).map(course => {
        return `
            <a href="course-page.html?c=${course.shortName}" class="hover:text-primary transition-colors">
                ${course.name}
            </a>
        `
    }).join('')

    useFullCoursesContainer.innerHTML = finalStr;
}