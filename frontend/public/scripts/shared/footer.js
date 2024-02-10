window.addEventListener('load', async () => {
    const useFullCoursesContainer = document.querySelector("#footer-usefull-courses");

    const response = await fetch('https://amingharibi-sabzlearn.liara.run/v1/courses/popular')
    const popularCourses = await response.json()


    const finalStr = popularCourses.slice(0, 4).map(course => {
        return `
            <a href="course-page.html?c=${course.shortName}" class="hover:text-primary transition-colors">
                ${course.name}
            </a>
        `
    }).join('')

    useFullCoursesContainer.innerHTML = finalStr;
})