window.addEventListener('load', async () => {
    const useFullCoursesContainer = document.querySelector("#footer-usefull-courses");

    const response = await fetch('http://localhost:4000/v1/courses/popular')
    const popularCourses = await response.json()

    console.log()
    const finalStr = popularCourses.slice(0, 4).map(course => {
        return `
            <a href="course-page.html?c=${course.shortName}" class="hover:text-primary transition-colors">
                ${course.name}
            </a>
        `
    }).join('')

    useFullCoursesContainer.innerHTML = finalStr;
})