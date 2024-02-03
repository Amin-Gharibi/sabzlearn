let body = document.body;
let menuBtn = document.querySelector(".sidebar-menu-btn");
let nameInput = document.querySelector(".name input");
let emailInput = document.querySelector(".email input");
let familyInput = document.querySelector(".family input");
let phoneInput = document.querySelector(".phone input");
let passwordInput = document.querySelector(".password input");
let form = document.querySelector(".form");
let inputs = document.querySelectorAll(".input input");
let errorMessage = document.querySelectorAll(".error-message");
let userArray = [];
let isThereUser = false;

//!==============> sidebar <==============!//
menuBtn.addEventListener("click", function () {
  if (body.className !== "active-sidebar") {
    body.classList.add("active-sidebar");
    body.classList.remove("notactive-sidebar");
  } else {
    body.classList.add("notactive-sidebar");
    body.classList.remove("active-sidebar");
  }
});
//!==============> sidebar <==============!//

//!==============> Form Validation <==============!//
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
//!==============> Form Validation <==============!//

// !==============> Adding New Users <==============!//
function addNewUsers() {
  let userObj = {
    id: userArray.length,
    name: nameInput.value,
    family: familyInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    phoneNumber: phoneInput.value,
  };
  userArray.push(userObj);
  addUserToDataBase(userArray);
}

function addUserToDataBase(userArr) {
  localStorage.setItem("users", JSON.stringify(userArr));
}

function getUsersFromDataBase() {
  let users = JSON.parse(localStorage.getItem("users"));
  if (users !== null) {
    userArray = users;
  } else {
    userArray = [];
  }
  addUserToDataBase(userArray);
}

function validateUsers() {
  let users = JSON.parse(localStorage.getItem("users"));
  if (users !== null) {
    let validateEmailThere = users.some(function (user) {
      return user.email === emailInput.value;
    });
    let validatePhoneThere = users.some(function (user) {
      return user.phoneNumber === phoneInput.value;
    });

    if (validatePhoneThere === true || validateEmailThere === true) {
      isThereUser = true;
    } else {
      isThereUser = false;
    }
  }
}
//!==============> Adding New Users <==============!//

//!==============> Form Validation Events <==============!//
nameInput.addEventListener("keyup", function (e) {
  let lengthReq = 3;
  validateLength(e, lengthReq);
});
familyInput.addEventListener("keyup", function (e) {
  let lengthReq = 4;
  validateLength(e, lengthReq);
});
emailInput.addEventListener("keyup", function (e) {
  // let lengthReq = 10;
  // validateLength(e, lengthReq);
  validateEmail(e);
  validateUsers();
});
passwordInput.addEventListener("keyup", function (e) {
  let lengthReq = 8;
  validateLength(e, lengthReq);
});
phoneInput.addEventListener("keyup", function (e) {
  let lengthReq = 11;
  validateLength(e, lengthReq);
  validateUsers();
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = false;
  inputs.forEach(function (input) {
    let isValidAttr = input.getAttribute("isValid");
    if (isValidAttr === "false") {
      isValid = false;
    } else {
      isValid = true;
    }
  });
  if (isValid === false) {
    errorMessage.forEach(function (err) {
      err.innerHTML = "لطفا مقادیر را به درستی وارد کنید !";
      err.style.display = "block";
    });
  } else if (isThereUser === true) {
    alert("این کاربر از قبل وجود دارد");
  } else {
    addNewUsers();
  }
  validateUsers();
});
//!==============> Form Validation Events <==============!//
window.addEventListener("load", getUsersFromDataBase);
