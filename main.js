var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productDescriptionInput = document.getElementById("productDescription");
var productImageInput = document.getElementById("productImage");
var productSearchInput = document.getElementById("searchInput");
var btnAdd = document.getElementById("btnAdd");
var btnUpdate = document.getElementById("btnUpdate");
// هذه المتغيرات تُخزن المراجع لعناصر الإدخال (input) من الصفحة HTML. اي بمسك ال id

var currnetIndex = 0;
//  لتخزين موقع المنتج عند التعديل.

var productList = [];

if (localStorage.getItem("productContianer") !== null) {
  productList = JSON.parse(localStorage.getItem("productContianer"));
}
displayData();
// لو فيه بيانات مخزنة في المتصفح، يتم تحميلها داخل productList، ثم عرضها في الصفحة.

function addProduct() {
  if (
    validationInput(productNameInput, "msgName") &&
    validationInput(productPriceInput, "msgPrice") &&
    validationInput(productCategoryInput, "msgCategory") &&
    validationInput(productDescriptionInput, "msgDescription") &&
    validationInput(productImageInput, "msgImage")
  ) {
    var product = {
      name: productNameInput.value.trim(),
      price: productPriceInput.value,
      category: productCategoryInput.value.trim(),
      description: productDescriptionInput.value.trim(),
      image: productImageInput.files[0]
        ? `img/${productImageInput.files[0]?.name}`
        : "img/images.jfif",
    };

    productList.push(product);
    localStorage.setItem("productContianer", JSON.stringify(productList));
    displayData();
    console.log(productList);
    clearForm();
  }
}

function displayData() {
  var cartona = "";
  for (let i = 0; i < productList.length; i++) {
    cartona += createCols(i);
  }
  document.getElementById("rowData").innerHTML = cartona;
}
// ينشئ العناصر HTML الخاصة بالمنتجات ويعرضها في الصفحة.

function searchData() {
  var term = productSearchInput.value.trim();
  var cartona = "";
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(term.toLowerCase())) {
      cartona += createCols(i);
    }
    document.getElementById("rowData").innerHTML = cartona;
  }
}
// يعرض المنتجات التي تحتوي أسماؤها على الكلمة التي كتبها المستخدم.

function createCols(i) {
  var regex = new RegExp(productSearchInput.value, "gi");
  return `    
    <div class="col-md-3">
    <div>
    <div class="card">
    <img height="300px" src="${productList[i].image}" alt="Title" />
    <div class="card-body">
    <span class="bg-primary rounded-3 py-1 px-2 text-white"
    >ID: ${i + 1}</span
    >
    <h3 class="card-title"> ${productList[i].name.replace(
      regex,
      (match) => `<span class="bg-info">${match}</span>`
    )}</h3>
    <p class="card-text">${productList[i].price}</p>
    <p class="card-text">${productList[i].category}</p>
                  <p class="card-text">${productList[i].description}</p>
                </div>
                <div class="card-footer text-center">
                <button onclick="deleteItem(${i})" class="btn btn-danger btn-sm">Delete</button>
                <button onclick="setUpdateInfo(${i})" class="btn btn-warning btn-sm text-white">UpDate</button>
                </div>
                </div>
                </div>
                </div>`;
}

function clearForm() {
  (productNameInput.value = null),
    (productPriceInput.value = null),
    (productCategoryInput.value = null),
    (productDescriptionInput.value = null),
    (productImageInput.value = null);
}
//   // تفرغ كل الحقول بعد الإضافة أو التعديل

function deleteItem(index) {
  productList.splice(index, 1);
  localStorage.setItem("productContianer", JSON.stringify(productList));
  displayData();
}
// يحذف المنتج من القائمة ويحدث التخزين والعرض.
function setUpdateInfo(index) {
  currnetIndex = index;

  productNameInput.value = productList[index].name;
  productPriceInput.value = productList[index].price;
  productCategoryInput.value = productList[index].category;
  productDescriptionInput.value = productList[index].description;

  btnAdd.classList.add("d-none");
  btnUpdate.classList.remove("d-none");
}
// يملأ الفورم بقيم المنتج المطلوب تعديله ويخفي زر "Add" ويظهر "Update".

function updateProduct() {
  var product = {
    name: productNameInput.value.trim(),
    price: productPriceInput.value,
    category: productCategoryInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    image: productImageInput.files[0]
      ? `img/${productImageInput.files[0]?.name}`
      : "img/images.jfif",
  };
  productList.splice(currnetIndex, 1, product);

  displayData();
  clearForm();
  localStorage.setItem("productContianer", JSON.stringify(productList));
  btnAdd.classList.remove("d-none");
  btnUpdate.classList.add("d-none");
}

function validationInput(element, msgId) {
  var regex = {
    productName: /^[a-zA-Z][a-zA-Z0-9]{2,19}$/,
    productPrice: /^\d{1,10}(\.\d{1,2})?$/,
    productCategory: /^(tv|mobile|screens|electronic)$/i,
    productDescription: /^.{3,}$/m,
    productImage: /^.{1,}\.(jpg|png|avif|jpeg|svg)$/,
    // اهم حاجه اسمهم زي اسم ال id بتاع كل input
  };
  var text = element.value;
  var msgId = document.getElementById("msgId");

  if (regex[element.id].test(text)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    msgId.classList.add("d-none");
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    msgId.classList.remove("d-none");
    return false;
  }
}

// function validationName() {
//   var regex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;
//   var text = productNameInput.value;
//   var msgName = document.getElementById("msgName");

//   if (regex.test(text)) {
//     productNameInput.classList.add("is-valid");
//     productNameInput.classList.remove("is-invalid");
//     msgName.classList.add("d-none");
//     return true;
//   } else {
//     productNameInput.classList.add("is-invalid");
//     productNameInput.classList.remove("is-valid");
//     msgName.classList.remove("d-none");
//     return false;
//   }
// }

// function validationPrice() {
//   var regex = /^\d{1,10}(\.\d{1,2})?$/;
//   var text = productPriceInput.value;
//   var msgPrice = document.getElementById("msgPrice");

//   if (regex.test(text)) {
//     productPriceInput.classList.add("is-valid");
//     productPriceInput.classList.remove("is-invalid");
//     msgPrice.classList.add("d-none");
//     return true;
//   } else {
//     productPriceInput.classList.add("is-invalid");
//     productPriceInput.classList.remove("is-valid");
//     msgPrice.classList.remove("d-none");
//     return false;
//   }
// }

// function validationCategory() {
//   var regex = /^(tv|mobile|screens|electronic)$/i;
//   var text = productCategoryInput.value;
//   var msgCategory = document.getElementById("msgCategory");

//   if (regex.test(text)) {
//     productCategoryInput.classList.add("is-valid");
//     productCategoryInput.classList.remove("is-invalid");
//     msgCategory.classList.add("d-none");
//     return true;
//   } else {
//     productCategoryInput.classList.add("is-invalid");
//     productCategoryInput.classList.remove("is-valid");
//     msgCategory.classList.remove("d-none");
//     return false;
//   }
// }

// function validationDescription() {
//   var regex = /^.{3,}$/m;
//   var text = productDescriptionInput.value;
//   var msgDescription = document.getElementById("msgDescription");

//   if (regex.test(text)) {
//     productDescriptionInput.classList.add("is-valid");
//     productDescriptionInput.classList.remove("is-invalid");
//     msgDescription.classList.add("d-none");
//     return true;
//   } else {
//     productDescriptionInput.classList.add("is-invalid");
//     productDescriptionInput.classList.remove("is-valid");
//     msgDescription.classList.remove("d-none");
//     return false;
//   }
// }

// function validationImage() {
//   var regex = /^.{1,}\.(jpg|png|avif|jpeg|svg)$/;
//   var text = productImageInput.value;
//   var msgImage = document.getElementById("msgImage");

//   if (regex.test(text)) {
//     productImageInput.classList.add("is-valid");
//     productImageInput.classList.remove("is-invalid");
//     msgImage.classList.add("d-none");
//     return true;
//   } else {
//     productImageInput.classList.add("is-invalid");
//     productImageInput.classList.remove("is-valid");
//     msgImage.classList.remove("d-none");
//     return false;
//   }
// }
