let menuBtn = document.querySelector(".sidebar-menu-btn");
let tbodyElement = document.querySelector("tbody");
let homeContentProducts = document.querySelector(".home-content-products");
let homeContent = document.querySelector("#home-content .container");
let searchBarInput = document.querySelector(".search-bar");
let body = document.body;
let productsArray = [];

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
  let products = JSON.parse(localStorage.getItem("products"));
  if (products === null) {
    productsArray = [];
  } else {
    productsArray = products;
  }
}

function addDataToDom() {
  productsArray.forEach(function (product) {
    let id = product.id;
    let name = product.name;
    let number = product.number;
    let condition = product.condition;
    let presell = product.presell;
    let price = product.price;
    if (condition === true) {
      condition = "موجود";
    } else {
      condition = "ناموجود";
    }

    if (presell === true) {
      presell = "پیش فروش";
    } else {
      presell = "در حال برگزاری";
    }
    let template = `
          <tr>
              <td>
                  <input type="checkbox" class="checkbox-table form-check-input">
              </td>
              <td id="id">${id}</td>
              <td id="name">
                <a href="file:///D:/Project/Admin_Panel/Product/index.html?id=${id}">${name}</a>
              </td>
              <td id="number">${number}</td>
              <td id="condition">${condition},${presell}</td>
              <td id="price">${price} تومان</td>
              <td>
                  <button type="button" class="btn btn-primary" id="edit-btn" onclick="editProduct(event)">ویرایش</button>
              </td>
              <td>
                  <button type="button" class="btn btn-danger" id="delete-btn" onclick="deleteProduct(event)">حذف</button>
              </td>
          </tr>
          `;
    tbodyElement.insertAdjacentHTML("beforeend", template);
  });
}

function editProduct(event) {
  let id =
    +event.target.parentElement.parentElement.firstChild.nextElementSibling
      .nextElementSibling.innerHTML;
  let products = JSON.parse(localStorage.getItem("products"));
  let productFromDataBase = products.find(function (product) {
    return product.id === id;
  });
  homeContentProducts.style.display = "none";
  let template = `
  <div class="home-content-edit">
                        <div class="back-btn">
                            <i class="fas fa-arrow-right" onclick="hideEditTemplate(event)"></i>
                        </div>
                        <form class="form" onsubmit="editProductToDataBase(event , ${id})">
                            <div class="col-6">
                                <div class="name input">
                                    <label class="input-title">نام محصول</label>
                                    <input type="text" isValid="false" placeholder="لطفا نام محصول را وارد کنید..." value="${productFromDataBase.name}">
                                    <span class="error-message text-danger"></span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="price input">
                                    <label class="input-title">قیمت محصول</label>
                                    <input type="text" isValid="false" placeholder="لطفا قیمت محصول را وارد کنید..." value="${productFromDataBase.price}">
                                    <span class="error-message text-danger"></span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="number input">
                                    <label class="input-title">تعداد محصول</label>
                                    <input type="text" isValid="false" placeholder="لطفا تعداد محصول را وارد کنید..." value="${productFromDataBase.number}">
                                    <span class="error-message text-danger"></span>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="bottom-form">
                                    <div class="condition">
                                        <label class="input-title">موجودی</label>
                                        <div class="radios">
                                            <div class="available">
                                                <label>
                                                    <span>موجود</span>
                                                    <input type="radio" value="avalibe" name="condition" checked>
                                                </label>
                                            </div>
                                            <div class="unavailable">
                                                <label>
                                                    <span>ناموجود</span>
                                                    <input type="radio" value="unavailable" name="condition">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="submit-btn">
                                        <input type="submit" value="ویرایش">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
  `;
  homeContent.insertAdjacentHTML("beforeend", template);
}

function editProductToDataBase(event, productId) {
  event.preventDefault();
  let products = JSON.parse(localStorage.getItem("products"));
  if (products !== null) {
    productsArray = products;
  } else {
    productsArray = [];
  }
  let form = event.target;
  let nameInput = form.querySelector(".name input").value;
  let priceInput = form.querySelector(".price input").value;
  let numberInput = form.querySelector(".number input").value;
  let productDataBase = products.find(function (product) {
    return product.id === productId;
  });
  productDataBase.name = nameInput;
  productDataBase.price = priceInput;
  productDataBase.number = numberInput;
  localStorage.setItem("products", JSON.stringify(products));
  homeContentProducts.style.display = "block";
  event.target.parentElement.style.display = "none";
}

function hideEditTemplate(event) {
  homeContentProducts.style.display = "block";
  event.target.parentElement.parentElement.style.display = "none";
}

function deleteProduct(event) {
  document.body.classList = "active-modal"

  // let id =
  //   +event.target.parentElement.parentElement.firstChild.nextElementSibling
  //     .nextElementSibling.innerHTML;
  // let products = JSON.parse(localStorage.getItem("products"));
  // if (products !== null) {
  //   productsArray = products;
  // } else {
  //   productsArray = [];
  // }
  // let indexOfDeleted = products.findIndex(function (product) {
  //   return product.id === id;
  // });
  // products.splice(indexOfDeleted, 1);
  // localStorage.setItem("products", JSON.stringify(productsArray));
}

function searchDataFromDataBase() {
  let dataFromDataBase = JSON.parse(localStorage.getItem("products"));
  let findDataFromDataBase = dataFromDataBase.filter(function(product){
    return searchBarInput.value === product.name
  })
  console.log(findDataFromDataBase)
}

window.addEventListener("load", getDataFromDataBase);
window.addEventListener("load", addDataToDom);
searchBarInput.addEventListener("keydown", searchDataFromDataBase);
