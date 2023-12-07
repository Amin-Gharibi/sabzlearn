import { alert } from "./alert.js";

const copyShortLinks = (event, alertParent) => {
    // console.log(event.currentTarget.nextElementSibling.innerHTML)
    navigator.clipboard.writeText(event.currentTarget.nextElementSibling.innerHTML)
        .then(() => alert(alertParent, 'check-circle', 'primary', 'موفق', 'لینک با موفقیت کپی شد!'))
        .catch(() => alert(alertParent, 'close-circle', 'red-alert', 'ناموفق', 'خطا در کپی کردن لینک'))
}

export { copyShortLinks }