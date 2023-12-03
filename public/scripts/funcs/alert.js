function alert(wholeContainer, logoId, alertColor, alertTitle, alertDescription) {
    const alertBox = document.querySelector('#alert')
    if (!alertBox || !alertBox.classList.contains('alert__show')) {
        wholeContainer.insertAdjacentHTML('afterend', `
        <!--alert-->
<div id="alert" class="alert__show">
    <!--upper side-->
    <div class="alert--up-side">
        <!--tick logo-->
        <div>
            <svg class="w-10 h-10 text-${alertColor}">
                <use href="#${logoId}"></use>
            </svg>
        </div>
        <!--alert content-->
        <div>
            <span class="font-danaDemiBold text-xl">${alertTitle}</span>
            <p class="alert--description">
                ${alertDescription}
            </p>
        </div>
    </div>
    <!--lower side-->
    <div class="alert--lower-side alert--lower-side__full bg-${alertColor}">
    </div>
</div>
    `)

        const alertContainer = document.querySelector('#alert')

        setTimeout(() => {
            alertContainer.children[1].classList.replace('alert--lower-side__full', 'alert--lower-side__none')
        }, 0)

        setTimeout(function () {
            alertContainer.classList.replace('alert__show', 'alert__hide')
        }, 3000)
        alertContainer.children[1].classList.replace('alert--lower-side__none', 'alert--lower-side__full')

        const hideAlertBox = () => {
            const alertBox = document.querySelector('#alert')
            alertBox.classList.replace('alert__show', 'alert__hide')
        }

        alertContainer.addEventListener('click', hideAlertBox)

        setTimeout(() => {
            alertContainer.removeEventListener('click', hideAlertBox)
        }, 3000)
    }
}

export {alert}