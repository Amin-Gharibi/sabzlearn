let body = document.body;
let menuBtn = document.querySelector(".sidebar-menu-btn");
let form = document.querySelector(".form");
let nameInput = document.querySelector(".name input");
let priceInput = document.querySelector(".price input");
let numberInput = document.querySelector(".number input");
let available = document.querySelector(".available input");
let presellTrue = document.querySelector(".presell-true input");
let inputs = document.querySelectorAll(".input input");
let fileInput = document.querySelector(".file input");
let products = [];
let isValid = false;

menuBtn.addEventListener("click", function () {
  if (body.className !== "active-sidebar") {
    body.classList.add("active-sidebar");
    body.classList.remove("notactive-sidebar");
  } else {
    body.classList.add("notactive-sidebar");
    body.classList.remove("active-sidebar");
  }
});

function addProducts(event) {
  let randomId;

  let dataFromDataBase = JSON.parse(localStorage.getItem("products"));
  if (dataFromDataBase !== null) {
    let isRandomNumberAvalibe = dataFromDataBase.some(function (product) {
      return +randomId === product.id;
    });
    console.log(isRandomNumberAvalibe)
    if (isRandomNumberAvalibe === false) {
      randomId = generateRandomId();
    }
  }

  let imgSrc = `../NewProducts/img/products/${fileInput.value.slice(
    12,
    fileInput.value.length
  )}`;
  event.preventDefault();
  if (isValid === true) {
    let condition = true;
    if (available.checked === true) {
      condition = true;
    } else {
      condition = false;
    }

    let presell = true;
    if (presellTrue.checked === true) {
      presell = true;
    } else {
      presell = false;
    }
    let productObj = {
      id: +randomId,
      name: nameInput.value,
      price: priceInput.value,
      number: numberInput.value,
      condition: condition,
      presell: presell,
      img: imgSrc,
    };
    products.push(productObj);
    addToDataBase(products);
  }
  validateInputsForm();
}

function validateInputsForm() {
  let nameInputLength = nameInput.value.length;
  let priceInputLength = priceInput.value.length;
  let numberInputLength = numberInput.value.length;
  let errorMessage = document.querySelectorAll('[isValid="false"]');

  if (nameInputLength < 2 || priceInputLength < 1 || numberInputLength < 1) {
    errorMessage.forEach(function (err) {
      err.nextElementSibling.innerHTML = "لطفا مقادیر را به درستی وارد کنید!";
      err.nextElementSibling.style.display = "block";
      err.style.border = "1px solid #dc3545";
      err.setAttribute("isValid", "false");
    });
    // isValid = false;
  } else {
    errorMessage.forEach(function (err) {
      err.nextElementSibling.innerHTML = "";
      err.nextElementSibling.style.display = "none";
      err.style.border = "1px solid green";
      err.setAttribute("isValid", "true");
    });
    // isValid = true;
  }
}

function addToDataBase() {
  localStorage.setItem("products", JSON.stringify(products));
}

function validateInputs(e) {
  let inputLength = e.target.value.length;
  if (inputLength < 2) {
    e.target.nextElementSibling.style.display = "block";
    e.target.style.border = "1px solid #dc3545";
    e.target.nextElementSibling.innerHTML =
      "لطفا مقادیر را به درستی وارد کنید!";
    e.target.setAttribute("isValid", "false");
  } else {
    e.target.nextElementSibling.style.display = "none";
    e.target.style.border = "1px solid green";
    e.target.nextElementSibling.innerHTML = "";
    e.target.setAttribute("isValid", "true");
  }
  inputs.forEach(function (input) {
    if (input.getAttribute("isValid") !== "true") {
      isValid = false;
    } else {
      isValid = true;
    }
  });
}

function getDataFromDataBase() {
  let data = JSON.parse(localStorage.getItem("products"));
  if (data !== null) {
    products = data;
  } else {
    products = [];
  }
  addToDataBase(products);
}

function generateRandomId() {
  let firstNumber = String(Math.floor(Math.random() * 10));
  let secondNumber = String(Math.floor(Math.random() * 10));
  let thirdNumber = String(Math.floor(Math.random() * 10));
  let fourthNumber = String(Math.floor(Math.random() * 10));
  let fifthNumber = String(Math.floor(Math.random() * 10));
  let finalId = firstNumber
    .concat(secondNumber)
    .concat(thirdNumber)
    .concat(fourthNumber)
    .concat(fifthNumber);
  return finalId;
}
form.addEventListener("submit", addProducts);
nameInput.addEventListener("blur", validateInputs);
priceInput.addEventListener("blur", validateInputs);
numberInput.addEventListener("blur", validateInputs);
window.addEventListener("load", getDataFromDataBase);
