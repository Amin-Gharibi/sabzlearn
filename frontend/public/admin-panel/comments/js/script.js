import {getToken, intlDateToPersianDate} from "../../../scripts/utils/utils.js";

const response = await fetch('https://amingharibi-sabzlearn.liara.run/v1/comments')
const allComments = (await response.json()).reverse()

const commentsContainer = document.querySelector('tbody')
allComments.forEach((comment, index) => {
  commentsContainer.insertAdjacentHTML('beforeend', `
    <tr>
                <td class="${
      comment.answer === 1 ? "answer-comment" : "no-answer-comment"
  }">${index + 1}</td>
                <td>${comment.creator.name}</td>
                <td>${comment.course}</td>
                <td>${intlDateToPersianDate(comment.createdAt)}</td>
                <td>${comment.score}</td>
                <td class="${comment.isAccepted ? "text-success" : "text-danger"}">${comment.isAccepted ? "تایید شده" : "تایید نشده"}</td>
                <td>
                    <button type='button' data-value="${comment._id}" class='btn btn-primary view-btn'>مشاهده</button>
                </td>
                <td>
                    <button type='button' data-value="${comment._id}" class='btn btn-primary answer-btn'>پاسخ</button>
                </td>
                <td>
                    <button type='button' data-value="${comment._id}" class='btn btn-primary accept-btn'>تایید</button>
                </td>
                <td>
                    <button type='button' data-value="${comment._id}" class='btn btn-primary reject-btn'>رد</button>
                </td>
                <td>
                    <button type='button' data-value="${comment._id}" class='btn btn-danger delete-btn'>حذف</button>
                </td>
            </tr>
  `)
})

const viewBtns = document.querySelectorAll('.view-btn')
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => viewCommentContentHandler(btn.getAttribute('data-value')))
})

const viewCommentContentHandler = commentId => {
  const targetComment = allComments.find(comment => comment._id === commentId)
  const commentText = targetComment.answer ? `${targetComment.body}<br><br><span class="text-success">پاسخ: ${targetComment.answerContent.body}</span>` : targetComment.body;
  Swal.fire({
    title: "متن کامنت",
    html: `
      <span>${commentText}</span>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: "بستن"
  });
}


const answerBtns = document.querySelectorAll('.answer-btn')
answerBtns.forEach(btn => {
  btn.addEventListener('click', () => answerToCommentHandler(btn.getAttribute('data-value')))
})

const answerToCommentHandler = commentId => {
  Swal.fire({
    input: "textarea",
    inputLabel: "پاسخ",
    inputPlaceholder: "پاسخ را بنویسید",
    confirmButtonText: "ثبت",
    allowOutsideClick: true,
    inputValidator: (value) => {
      if (!value) {
        return 'پاسخ نمی‌تواند خالی باشد!';
      }
    }
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`https://amingharibi-sabzlearn.liara.run/v1/comments/answer/${commentId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          body: result.value.trim()
        })
      }).then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "موفق",
            text: "پاسخ با موفقیت ثبت شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          Swal.fire({
            title: "ناموفق",
            text: "خطا در ثبت پاسخ برای این کامنت، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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


const acceptBtns = document.querySelectorAll('.accept-btn')
acceptBtns.forEach(btn => {
  btn.addEventListener('click', () => acceptCommentHandler(btn.getAttribute('data-value')))
})

const acceptCommentHandler = commentId => {
  swal.fire({
    title: 'تایید کامنت',
    text: "آیا مطمئن هستید میخواهید این کامنت را تایید کنید؟",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "تایید",
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`https://amingharibi-sabzlearn.liara.run/v1/comments/accept/${commentId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "موفق",
            text: "کامنت با موفقیت تایید شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          Swal.fire({
            title: "ناموفق",
            text: "خطایی در تایید کامنت رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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


const rejectBtns = document.querySelectorAll('.reject-btn')
rejectBtns.forEach(btn => {
  btn.addEventListener('click', () => rejectCommentHandler(btn.getAttribute('data-value')))
})

const rejectCommentHandler = commentId => {
  swal.fire({
    title: 'رد کامنت',
    text: "آیا مطمئن هستید میخواهید این کامنت را رد کنید؟",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "رد",
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`https://amingharibi-sabzlearn.liara.run/v1/comments/reject/${commentId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "موفق",
            text: "کامنت با موفقیت رد شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          Swal.fire({
            title: "ناموفق",
            text: "خطایی در رد کامنت رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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


const deleteBtns = document.querySelectorAll('.delete-btn')
deleteBtns.forEach(btn => {
  btn.addEventListener('click', () => deleteCommentHandler(btn.getAttribute('data-value')))
})

const deleteCommentHandler = commentId => {
  swal.fire({
    title: 'حذف کامنت',
    text: "آیا مطمئن هستید میخواهید این کامنت را حذف کنید؟",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لغو",
    confirmButtonText: "حذف",
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`https://amingharibi-sabzlearn.liara.run/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status === 200) {
          Swal.fire({
            title: "موفق",
            text: "کامنت با موفقیت حذف شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          Swal.fire({
            title: "ناموفق",
            text: "خطایی در حذف کامنت رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
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