function alert(wholeContainer, logoId, alertColor, alertTitle, alertDescription) {
    const oldAlertBox = document.querySelector('.alert-box')
    oldAlertBox && oldAlertBox.remove()

    wholeContainer.insertAdjacentHTML('afterend', `
        <div class="alert-box">
            <div class="alert--content-container">
                <!--alert logo-->
                <div>
                    <svg class="w-10 h-10 text-${alertColor}">
                        <use href="#${logoId}"></use>
                    </svg>    
                </div>
                <!--alert text content-->
                <div class="alert--content__text-side">
                    <span class="font-danaDemiBold text-xl dark:text-white">
                        ${alertTitle}
                    </span>
                    <p class="font-danaRegular dark:text-darkGray-500">
                        ${alertDescription}
                    </p>
                </div>
            </div>
            <div class="alert--progress"></div>
        </div>
    `)

    const alertBox = document.querySelector('.alert-box'),
        alertProgress = document.querySelector('.alert--progress');
    let timer1, timer2;

    setTimeout(() => {
        alertBox.classList.add('active')
        alertProgress.classList.add('active')
        timer1 = setTimeout(() => {
            alertBox.classList.remove('active')
        }, 3000)
        timer2 = setTimeout(() => {
            alertProgress.classList.remove('active')
        }, 4000)
    }, 10)
}

export {alert}