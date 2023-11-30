let $ = document
const rememberMeCheckBox = $.querySelector('.remember-me--checkbox')

const toggleRememberMeCheckBox = (event) => {
    const input = event.currentTarget.firstChild
    const checkBoxMark = event.currentTarget.children[1]

    input.checked === undefined && (input.checked = true)
    input.checked ? input.checked = false : input.checked = true

    checkBoxMark.classList.toggle('remember-me--checkbox__checked')
}

rememberMeCheckBox.addEventListener('click', (event) => toggleRememberMeCheckBox(event))