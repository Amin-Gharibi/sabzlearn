import {getToken} from "../../../scripts/utils/utils.js";

const response = await fetch('http://localhost:4000/v1/category')
const allCategories = await response.json()

const categoriesContainer = document.querySelector('tbody')
allCategories.forEach(cat => {
  categoriesContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${cat._id}</td>        
        <td>${cat.name}</td>
        <td>${cat.title}</td>
        <td>
                <button type='button' class='btn btn-primary edit-btn' data-name="${cat.name}" data-title="${cat.title}" data-value="${cat._id}">ویرایش</button>
        </td>
        <td>
                <button type='button' class='btn btn-danger delete-btn' data-value="${cat._id}">حذف</button>
        </td>
    </tr>
  `)
})

const addCatForm = document.querySelector('form')

addCatForm.addEventListener('submit', event => {
  event.preventDefault()

  const newCatTitle = document.querySelector('#new-cat-title-input')
  const newCatName = document.querySelector('#new-cat-name-input')

  const newCat = {
    title: newCatTitle.value.trim(),
    name: newCatName.value.trim()
  }

  fetch('http://localhost:4000/v1/category', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newCat)
  }).then(res => {
    if (res.status !== 201) {
      swal.fire({
        title: "ناموفق",
        text: `خطا در اضافه کردن دسته بندی به دیتابیس. لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
        icon: "error",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    } else {
      swal.fire({
        title: "موفق",
        text: "دسته بندی با موفقیت به دیتابیس اضافه شد",
        icon: "success",
        confirmButtonText: "بستن"
      }).then(() => {
        location.reload()
      })
    }
  })
})

const deleteBtns = document.querySelectorAll('.delete-btn')
deleteBtns.forEach(btn => {
  btn.addEventListener('click', () => removeCategoryHandler(btn.getAttribute('data-value')))
})

const removeCategoryHandler = catId => {
  swal.fire({
    title: `آیا از حذف این دسته بندی مطمئن هستید؟`,
    text: "اگر دسته بندی را حذف کنید دیگر قادر به بازگرداندن آن نخواهید بود",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "لفو",
    confirmButtonText: "حذف",
    dangerMode: true,
  }).then(async willDelete => {
    if (willDelete.isConfirmed) {

      const targetCat = allCategories.find(cat => cat._id === catId)

      fetch(`http://localhost:4000/v1/category/${targetCat._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      }).then(res => {
        if (res.status !== 200) {
          swal.fire({
            title: "ناموفق",
            text: `خطا در حذف کردن دسته بندی از دیتابیس. لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید`,
            icon: "error",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        } else {
          swal.fire({
            title: "موفق",
            text: "دسته بندی با موفقیت حذف شد",
            icon: "success",
            confirmButtonText: "بستن"
          }).then(() => {
            location.reload()
          })
        }
      })
    }
  })
}

const editBtns = document.querySelectorAll(".edit-btn")

editBtns.forEach(btn => {
  btn.addEventListener('click', async () => await editCategoryHandler(btn.getAttribute('data-value'), btn.getAttribute('data-name'), btn.getAttribute('data-title')))
})

const editCategoryHandler = async (catId, catName, catTitle) => {

  let titleInput = HTMLInputElement
  let nameInput = HTMLInputElement

  const { value: formValues } = await Swal.fire({
    title: "ویرایش",
    customClass: "swal-wide",
    html: `
    <label for="edit-cat-title-input">نام فارسی دسته بندی:</label>
    <input type="text" value="${catTitle}" id="edit-cat-title-input" placeholder="لطفا نام فارسی اصلاحی را وارد کنید..." class="swal2-input">
    <label for="edit-cat-name-input">نام انگلیسی دسته بندی:</label>
    <input type="text" value="${catName}" id="edit-cat-name-input" placeholder="لطفا نام انگلیسی اصلاحی را وارد کنید..." class="swal2-input">
  `,
    confirmButtonText: "ثبت",
    focusConfirm: false,
    allowOutsideClick: () => !Swal.isLoading(),
    didOpen: () => {
      const popup = Swal.getPopup()
      titleInput = popup.querySelector('#edit-cat-title-input')
      nameInput = popup.querySelector('#edit-cat-name-input')
      titleInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
      nameInput.addEventListener('keyup', event => event.key === 'Enter' && Swal.clickConfirm())
    },
    preConfirm: () => {
      const title = titleInput.value.trim()
      const name = nameInput.value.trim()
      if (!title || !name) {
        Swal.showValidationMessage(`لطفا نام فارسی و انگلیسی اصلاحی را وارد کنید`)
      } else {
        const sendingBody = {
          title,
          name
        }
        fetch(`http://localhost:4000/v1/category/${catId}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sendingBody)
        }).then(res => {
          return res.status === 201 ? "succeed" : "failed"
        })
      }
    }
  });
  
  if (formValues === "succeed") {
    swal.fire({
      title: "موفق",
      text: "دسته بندی با موفقیت ویرایش شد",
      icon: "success",
      confirmButtonText: "بستن"
    }).then(() => {
      location.reload()
    })
  } else if (formValues === "failed"){
    swal.fire({
      title: "ناموفق",
      text: "خطایی در اصلاح دسته بندی رخ داد، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
      icon: "error",
      confirmButtonText: "بستن"
    }).then(() => {
      location.reload()
    })
  }
}