import {getCourses, getToken} from "../../../scripts/utils/utils.js";
import {getMe} from "../../../scripts/funcs/auth.js";

let [ allCourses, user, allSessions ] = await Promise.all([getCourses(), getMe(), fetch(`http://localhost:4000/v1/courses/sessions`)])
allSessions = (await allSessions.json()).reverse()
if (user.role !== "ADMIN") {
  allCourses = allCourses.filter(course => {
    return course.creator._id === user._id
  })

  allSessions = allSessions.filter(session => {
    return allCourses.some(course => course.name === session.course.name)
  })
}

const sessionsContainer = document.querySelector('tbody')
allSessions.forEach((session, index) => {
  const date = new Date(session.createdAt)
  sessionsContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${index + 1}</td>
        <td>${session.title}</td>
        <td>${session.time}</td>
        <td>${date.toLocaleTimeString('fa-IR') + ' ,' + date.toLocaleDateString('fa-IR')}</td>
        <td>${session.course.name}</td>
        <td>
              <button type='button' class='btn btn-danger delete-btn' data-value="${session._id}">حذف</button>
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

const form = document.querySelector('form')
form.addEventListener('submit', event => {
  event.preventDefault()

  const sessionTitle = document.querySelector('#session-name')
  const sessionTime = document.querySelector('#session-time')
  const sessionVideo = document.querySelector('#session-video-file')
  let isSessionFree = document.querySelector('#is-session-free')
  isSessionFree = +isSessionFree.checked

  const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if (coursesContainer.value === "0") {
    const alertContainer = document.querySelector('.alert-container')
    if (alertContainer.children[alertContainer.children.length - 1].classList.contains('alert')) {
      alertContainer.children[alertContainer.children.length - 1].remove()
    }
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="alert text-danger" style="padding-right: 1rem;">لطفا دوره را انتخاب کنید*</span>
    `)
    return false;
  } else if (sessionVideo.files.length > 1) {
    const alertContainer = document.querySelector('.alert-container')
    if (alertContainer.children[alertContainer.children.length - 1].classList.contains('alert')) {
      alertContainer.children[alertContainer.children.length - 1].remove()
    }
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="alert text-danger" style="padding-right: 1rem;">تعداد ویدیو نمی تواند بیشتر از یکی باشد*</span>
    `)
    return false;
  } else if (!timePattern.test(sessionTime.value.trim())) {
    const alertContainer = document.querySelector('.alert-container')
    if (alertContainer.children[alertContainer.children.length - 1].classList.contains('alert')) {
      alertContainer.children[alertContainer.children.length - 1].remove()
    }
    alertContainer.insertAdjacentHTML('beforeend', `
        <span class="alert text-danger" style="padding-right: 1rem;">مدت زمان جلسه صحیح نیست*</span>
    `)
    return false;
  }

  const sendingBody = new FormData();
  sendingBody.append('title', sessionTitle.value.trim())
  sendingBody.append('time', sessionTime.value.trim())
  sendingBody.append('video', sessionVideo.files[0])
  sendingBody.append('free', isSessionFree)

  fetch(`http://localhost:4000/v1/courses/${coursesContainer.value}/sessions`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${getToken()}`
    },
    body: sendingBody
  }).then(res => {
    if (res.status === 201) {
      swal.fire({
        title: "موفق",
        text: "جلسه با موفقیت اضافه شد",
        icon: "success",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    } else {
      swal.fire({
        title: "ناموفق",
        text: "خطا در اضافه کردن جلسه رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
        icon: "error",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    }
  })
})


const deleteBtns = document.querySelectorAll('.delete-btn')
deleteBtns.forEach(btn => {
  btn.addEventListener('click', () => deleteSessionHandler(btn.getAttribute('data-value')))
})

const deleteSessionHandler = sessionId => {
  swal.fire({
    title: `آیا از حذف این جلسه اطمینان دارید؟`,
    text: "اگر جلسه را حذف کنید دیگر قادر به بازگرداندن آن نخواهید بود",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "حذف",
  }).then(willDelete => {
    if (willDelete.isConfirmed) {
      fetch(`http://localhost:4000/v1/courses/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status === 200) {
          swal.fire({
            title: "موفق",
            text: "جلسه با موفقیت حذف شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          swal.fire({
            title: "ناموفق",
            text: "خطایی در حذف جلسه رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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