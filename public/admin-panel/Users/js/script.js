let menuBtn = document.querySelector(".sidebar-menu-btn");
let tBodyTable = document.querySelector("tbody");
let homeContent = document.querySelector("#home-content .container");
let latsetUser = document.querySelector(".home-content-latset-users");
let body = document.body;
let userArray = [];
menuBtn.addEventListener("click", function () {
  if (body.className !== "active-sidebar") {
    body.classList.add("active-sidebar");
    body.classList.remove("notactive-sidebar");
  } else {
    body.classList.add("notactive-sidebar");
    body.classList.remove("active-sidebar");
  }
});

function getDataFromDataBase() {
  let datas = JSON.parse(localStorage.getItem("users"));
  if (datas !== null) {
    datas.forEach(function (user) {
      tBodyTable.insertAdjacentHTML(
        "beforeend",
        "<tr><td>" +
          user.id +
          "</td><td>" +
          user.name +
          "</td><td>" +
          user.family +
          "</td><td>" +
          user.phoneNumber +
          "</td><td>" +
          user.email +
          "</td><td>" +
          user.password +
          "</td><td>" +
          "<button type='button' onclick='editUsers(event)' class='btn btn-primary edit-btn'>ویرایش</button>" +
          "</td><td>" +
          "<button type='button' onclick='deleteUsers(event)' class='btn btn-danger delete-btn'>حذف</button>" +
          "</td></tr>"
      );
    });
  }
}

function editUsers(e) {
  let userId = e.target.parentElement.parentElement.firstChild.innerHTML;
  let users = JSON.parse(localStorage.getItem("users"));
  let userFromLs = users.find(function (user) {
    return +userId === +user.id;
  });
  latsetUser.style.display = "none";
  let template = `
  <div class="home-content-edit">
  <div class="back-btn">
      <i class="fas fa-arrow-right" onclick="hideEditTemplate(event)"></i>
  </div>
  <form class="form" onsubmit="editUserToDataBase(event,${userId})">
      <div class="col-6">
          <div class="name input">
              <label class="input-title">نام</label>
              <input type="text" isValid="false" onkeyup="validateLength(event,${3})" value="${
    userFromLs.name
  }" placeholder="لطفا نام کاربر را وارد کنید...">
              <span class="error-message text-danger"></span>
          </div>
      </div>
      <div class="col-6">
          <div class="family input">
              <label class="input-title">نام خانوادگی</label>
              <input type="text" isValid="false" value="${
                userFromLs.family
              }" onkeyup="validateLength(event,${4})"
                  placeholder="لطفا نام خانوادگی کاربر را وارد کنید...">
              <span class="error-message text-danger"></span>
          </div>
      </div>
      <div class="col-6">
          <div class="email input">
              <label class="input-title">ایمیل</label>
              <input type="text" isValid="false" value="${
                userFromLs.email
              }" onkeyup="validateEmail(event)" placeholder="لطفا ایمیل کاربر را وارد کنید...">
              <span class="error-message text-danger"></span>
          </div>
      </div>
      <div class="col-6">
          <div class="password input">
              <label class="input-title">رمز عبور</label>
              <input type="password" isValid="false" value="${
                userFromLs.password
              }" onkeyup="validateLength(event,${8})"
                  placeholder="لطفا رمز عبور کاربر را وارد کنید...">
              <span class="error-message text-danger"></span>
          </div>
      </div>
      <div class="col-6">
          <div class="phone input">
              <label class="input-title">شماره تلفن</label>
              <input type="text" isValid="false" value="${
                userFromLs.phoneNumber
              }" onkeyup="validateLength(event,${11})" placeholder="لطفا شماره تلفن کاربر را وارد کنید...">
              <span class="error-message text-danger"></span>
          </div>
      </div>
      <div class="col-12">
          <div class="bottom-form">
              <div class="sex">
                  <label class="input-title">جنسیت</label>
                  <div class="radios">
                      <div class="male">
                          <label>
                              <span>مرد</span>
                              <input type="radio" name="sex">
                          </label>
                      </div>
                      <div class="female">
                          <label>
                              <span>زن</span>
                              <input type="radio" name="sex">
                          </label>
                      </div>
                      <div class="other">
                          <label>
                              <span>سایر</span>
                              <input type="radio" name="sex">
                          </label>
                      </div>
                  </div>
              </div>
              <div class="submit-btn">
                  <input type="submit" value="ویرایش" >
              </div>
          </div>
      </div>
  </form>
</div>
  `;
  homeContent.insertAdjacentHTML("beforeend", template);
}

function hideEditTemplate(e) {
  latsetUser.style.display = "block";
  e.target.parentElement.parentElement.style.display = "none";
}

function editUserToDataBase(event, userId) {
  event.preventDefault();
  let getUserFromDataBase = JSON.parse(localStorage.getItem("users"));
  if (getUserFromDataBase !== null) {
    userArray = getUserFromDataBase;
  } else {
    userArray = [];
  }
  let form = event.target;
  let nameInput = form.querySelector(".name input");
  let familyInput = form.querySelector(".family input");
  let emailInput = form.querySelector(".email input");
  let passwordInput = form.querySelector(".password input");
  let phoneInput = form.querySelector(".phone input");
  let userFromDataBase = getUserFromDataBase.find(function (user) {
    return +userId === user.id;
  });
  userFromDataBase.name = nameInput.value;
  userFromDataBase.family = familyInput.value;
  userFromDataBase.email = emailInput.value;
  userFromDataBase.password = passwordInput.value;
  userFromDataBase.phoneNumber = phoneInput.value;
  swal("کاربر با موفقیت ویرایش شد!", "", "success");
  setTimeout(function () {
    location.reload();
  }, 2000);
  addToDataBase(getUserFromDataBase);
}

function addToDataBase(userArr) {
  localStorage.setItem("users", JSON.stringify(userArr));
}

function validateLength(e, lengthReq) {
  let valueLength = e.target.value.length;
  let valueLengthReq = lengthReq;
  let spanError = e.target.nextElementSibling;
  if (valueLength < valueLengthReq) {
    spanError.innerHTML =
      "لطفا تعداد کارکتر را به درستی وارد کنید!" +
      "(حداقل " +
      valueLengthReq +
      "کارکتر )";
    spanError.style.display = "block";
    e.target.style.border = "1px solid #dc3545";
    e.target.setAttribute("isValid", "false");
  } else {
    spanError.innerHTML = "";
    spanError.style.display = "none";
    e.target.style.border = "1px solid #4CAF50";
    e.target.setAttribute("isValid", "true");
  }
}

function validateEmail(e) {
  let emailValue = e.target.value;
  let spanError = e.target.nextElementSibling;
  if (!emailValue.includes("@")) {
    spanError.innerHTML = "لطفا ایمیل معتبر وارد کنید!";
    spanError.classList.add("text-danger");
    spanError.style.display = "block";
    e.target.style.border = "1px solid #dc3545";
    e.target.setAttribute("isValid", "false");
  } else {
    spanError.innerHTML = "";
    spanError.style.display = "none";
    e.target.style.border = "1px solid #4CAF50";
    e.target.setAttribute("isValid", "true");
  }
}

function deleteUsers(event) {
  document.body.classList = "active-modal"
  // let userId = event.target.parentElement.parentElement.firstChild.innerHTML;
  // let users = JSON.parse(localStorage.getItem("users"));
  // let userFromDataBase = users.findIndex(function (user) {
  //   return +userId === user.id;
  // });
  // users.splice(userFromDataBase, 1);
  // addToDataBase(users);
  // swal("کاربر با موفقیت حذف شد!", "", "success");
  // setTimeout(function () {
  //   location.reload();
  // }, 2000);
}

window.addEventListener("load", getDataFromDataBase);
