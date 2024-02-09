import {getCourses, getToken} from "../../../scripts/utils/utils.js";

const [discountsResponse, allCourses] = await Promise.all([fetch('http://localhost:4000/v1/offs', {headers: {"Authorization": `Bearer ${getToken()}`}}), getCourses()])

const allDiscounts = await discountsResponse.json()
const discountsContainer = document.querySelector('tbody')
allDiscounts.forEach(discount => {
  const targetCourse = allCourses.find(course => course._id === discount.course)
  discountsContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${discount.code}</td>
        <td>${discount.percent}</td>
        <td>${targetCourse.name}</td>
        <td>${discount.max}</td>
        <td>${discount.uses}</td>
        <td>${discount.creator}</td>
        <td>
            <button type="button" class="btn btn-danger delete-btns" data-value="${discount._id}">
            حذف
			</button>
        </td>
    </tr>
  `)
})

const coursesContainer = document.querySelector('#courses-container')
allCourses.forEach(course => {
  coursesContainer.insertAdjacentHTML('beforeend', `
      <option value="${course._id}">${course.name}</option>
  `)
})


const deleteBtns = document.querySelectorAll('.delete-btns')
deleteBtns.forEach(btn => {
  btn.addEventListener('click', () => deleteDiscountCodeHandler(btn.getAttribute('data-value')))
})

const deleteDiscountCodeHandler = discountCodeId => {
  swal.fire({
    title: `آیا مطمئن هستید؟`,
    text: "اگر کد تخفیف را حذف کنید دیگر کاربران قادر به استفاده از آن نخواهند بود",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "حذف",
  }).then(willDelete => {
    if (willDelete.isConfirmed) {
      fetch(`http://localhost:4000/v1/offs/${discountCodeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          swal.fire({
            title: "موفق",
            text: `کد تخفیف با موفقیت حذف شد`,
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          swal.fire({
            title: "ناموفق",
            text: `خطا در حذف کد تخفیف، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
            icon: "error",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        }
      })
    }
  })
}

const activateAllDiscountBtn = document.querySelector('#activate-all-discount')
activateAllDiscountBtn.addEventListener('click', () => {
  const discountAmount = document.querySelector('#discount-amount')

  if (discountAmount.value.trim() < 0 || discountAmount.value.trim() > 99 || !discountAmount.value) {
    const alertContainer = document.querySelector('.all-courses-discount-input')
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger" style="font-size: 14px">مقدار تخفیف باید بین 0 تا 99 باشد*</span>
    `)
    return false;
  }

  fetch('http://localhost:4000/v1/offs/setall', {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      discount: +discountAmount.value.trim()
    })
  }).then(res => {
    if (res.status === 200) {
      swal.fire({
        title: "موفق",
        text: `کد تخفیف همگانی با موفقیت فعال شد`,
        icon: "success",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    } else {
      swal.fire({
        title: "ناموفق",
        text: `خطا در اعمال تخفیف همگانی، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
        icon: "error",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    }
  })
})

const deactivateAllCoursesDiscountInput = document.querySelector('#deactivate-all-discount')
deactivateAllCoursesDiscountInput.addEventListener('click', () => {
  swal.fire({
    title: `آیا مطمئن هستید؟`,
    text: "اگر تخفیف همگانی را غیرفعال کنید دیگر کاربران قادر به استفاده از آن نخواهند بود",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "غیرفعال",
  }).then(willDelete => {
    if (willDelete.isConfirmed) {
      fetch(`http://localhost:4000/v1/offs/unsetall`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status === 200) {
          swal.fire({
            title: "موفق",
            text: `تخفیف همگانی با موفقیت غیرفعال شد`,
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          swal.fire({
            title: "ناموفق",
            text: `خطا در غیرفعال کردن تخفیف همگانی، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
            icon: "error",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        }
      })
    }
  })
})

const activateOneCodeSubmitBtn = document.querySelector('#activate-one-discount')
activateOneCodeSubmitBtn.addEventListener('click', () => {
  const codeInput = document.querySelector('#discount-code-on-one')
  const discountAmountInput = document.querySelector('#discount-amount-on-one')
  const courseInput = document.querySelector('#courses-container')
  const maxUseInput = document.querySelector('#discount-max-use-on-one')

  if (!codeInput.value.trim() || !discountAmountInput.value.trim() || !courseInput.value.trim() || !maxUseInput.value.trim()) {
    const alertContainer = document.querySelector('.one-course-alert-container')
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger" style="font-size: 14px">لطفا همه مقادیر را وارد کنید*</span>
    `)
    return false;
  }

  if (discountAmountInput.value.trim() < 0 || discountAmountInput.value.trim() > 100) {
    const alertContainer = document.querySelector('.one-course-discount-input')
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger" style="font-size: 14px">لطفا مقدار را بین 0 تا 100 وارد*</span>      
    `)
    return false;
  }

  if (maxUseInput.value.trim() < 0) {
    const alertContainer = document.querySelector('.one-course-max-use-input')
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="text-danger" style="font-size: 14px">لطفا مقدار را بزرگتر از 0 وارد کنید*</span>      
    `)
    return false;
  }

  const sendingBody = {
    code: codeInput.value.trim(),
    percent: discountAmountInput.value.trim(),
    course: courseInput.value.trim(),
    max: maxUseInput.value.trim()
  }

  fetch('http://localhost:4000/v1/offs', {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sendingBody)
  }).then(res => {
    if (res.status === 201) {
      swal.fire({
        title: "موفق",
        text: `کد تخقیق روی دوره مورد نظر با موفقیت قعال شد`,
        icon: "success",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    } else {
      swal.fire({
        title: "ناموفق",
        text: `خطا در فعالسازی کد تخفیف روی دوره مورد نظر، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
        icon: "error",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    }
  })
})