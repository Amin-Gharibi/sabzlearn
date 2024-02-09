const userNameValidation = userName => {
    const regex = /^[A-Za-z][A-za-z0-9_]{3,14}$/

    return regex.test(userName)
}

const phoneNumberValidation = phoneNumber => {
    const mainRegex = /^\+989\d{9}$/
    const secondaryRegex = /^09\d{9}$/
    const thirdRegex = /^9\d{9}$/

    const result = {
        isPhoneNumberValid: false,
        formattedPhoneNumber: phoneNumber
    };

    (mainRegex.test(phoneNumber) || secondaryRegex.test(phoneNumber) || thirdRegex.test(phoneNumber)) && (result.isPhoneNumberValid = true)
    thirdRegex.test(phoneNumber) && (result.formattedPhoneNumber = phoneNumber.padStart(11, '0'))

    return result
}

const emailValidation = email => {
    const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/

    return regex.test(email)
}

const passwordValidation = password => {
    const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/

    return regex.test(password)
}


export { userNameValidation, phoneNumberValidation, emailValidation, passwordValidation }