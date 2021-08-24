const apiUrl = `https://secasestudy.herokuapp.com`;
//const apiUrl = `https://selibapi.herokuapp.com`;
$(function () {
  $("#successMessage").hide();
});

const user = JSON.parse(localStorage.getItem("user"));
let booksList = [];
let numberOfBooks = 0;
let startingPage = 1;
let currentPage = 1;
let maxPage = 1;
let search;
// onclick="createReservation(${index})"
const getBooksHandler = (page) => {
  currentPage = page;
  var xhr = new XMLHttpRequest();
  xhr.open(
    `GET`,
    `${apiUrl}/api/v1/books/?page=${page}${
      search ? `&lower_title=${search}` : ``
    }&limit=6`,
    true
  );
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    console.log(data);
    const books = data.data.books;
    maxPage = data.results / 6;
    console.log(maxPage);
    renderBooks(books);
    renderPageButtons(data.results);
  };

  xhr.send();
};
window.onload = getBooksHandler(1);
const renderBooks = (books) => {
  booksList = [];
  document.querySelector("#listOfBooks").innerHTML = ``;
  books.forEach((book, index) => {
    booksList.push({
      bookId: book._id,
      bookTitle: book.title,
      bookImage: book.img,
      bookCopies: book.availableCopies,
      bookAuthor: book.author[0],
    });

    const div = document.createElement("div");
    div.className = "card p-1 m-2 shadow";
    div.style.maxWidth = "450px";

    div.innerHTML = `
    <div class="row g-0">
    <div class="col-4">
      <img
        src="${apiUrl}/api/v1/books/images/${book.img}"
        alt="..."
        class="img-fluid"
      />
    </div>
    <div class="col-8 d-flex bg-light">
      <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">
          <small class="text-muted">by ${book.author[0]}</small>
        </p>
        <p class="card-text">
          <small class="text-muted">Available copies: ${book.availableCopies}</small>
        </p>
      </div>
      <div class="col align-self-end">
        <button type="button" class="btn btn-info text-light" data-toggle="modal" data-target="#bookModal" onclick="bookModalBody(${index})">
          Create reservation
        </button>
        </div>
    </div>
  </div>
    `;
    document.querySelector("#listOfBooks").append(div);
  });
};

const renderPageButtons = (results) => {
  document.querySelector("#paginateSection").innerHTML = ``;
  const div = document.createElement("div");
  const nav = `
  <nav aria-label="Page navigation">
          <ul class="pagination justify-content-md-center">
            ${
              currentPage > 1
                ? `<li class="page-item">
            <button class="page-link pageBtn" onclick="previousBtn()">Previous</button>
          </li>`
                : ""
            }
            <li class="page-item">
              <button class="page-link pageBtn ${
                startingPage === currentPage ? `bg-info text-white` : ``
              }" onclick="getBooksHandler(${startingPage})">${startingPage}</button>
            </li>
            <li class="page-item">
              <button class="page-link pageBtn ${
                startingPage + 1 === currentPage ? `bg-info text-white` : ``
              }" onclick="getBooksHandler(${startingPage + 1})">${
    startingPage + 1
  }</button>
            </li>
            <li class="page-item">
              <button class="page-link pageBtn ${
                startingPage + 2 === currentPage ? `bg-info text-white` : ``
              }" onclick="getBooksHandler(${startingPage + 2})">${
    startingPage + 2
  }</button>
            </li>
            ${
              maxPage > currentPage
                ? `<li class="page-item">
            <button class="page-link pageBtn" onclick="nextBtn()">Next</button>
          </li>`
                : ""
            }
          </ul>
        </nav>
  `;
  div.innerHTML = nav;
  document.querySelector("#paginateSection").append(div);
};
const nextBtn = () => {
  if (currentPage % 3 === 0 && currentPage != 1) {
    startingPage = currentPage + 1;
    getBooksHandler(startingPage);
  } else {
    getBooksHandler(++currentPage);
  }
};
const previousBtn = () => {
  if ((currentPage - 1) % 3 === 0) {
    startingPage = currentPage - 3;
    getBooksHandler(startingPage);
  } else {
    getBooksHandler(--currentPage);
  }
};

const createReservation = (bookIndex) => {
  var xhr = new XMLHttpRequest();
  xhr.open(`POST`, `${apiUrl}/api/v1/reserve`, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onload = function () {
    $("#bookModal").modal("hide");
    data = JSON.parse(this.responseText);
    console.log(data);
    if (data.status == "fail") {
      $("#successMessage").html(`Book already requested!`);
    } else {
      $("#successMessage").html(`Book reservation requested!`);
    }
    $("#successMessage").show(500);
    setTimeout(function () {
      $("#successMessage").hide(1000);
    }, 3000);
  };

  xhr.send(
    JSON.stringify({
      bookId: booksList[bookIndex].bookId,
      bookTitle: booksList[bookIndex].bookTitle,
      bookImage: booksList[bookIndex].bookImage,
      userName: user.data.protectectedUser.name,
      idNumber: user.data.protectectedUser.studentNumber,
      userId: user.data.protectectedUser._id,
      messages: {
        name: user.data.protectectedUser.name,
        message: document.getElementById("message-text").value,
        messageDate: Date.now(),
        avatar: user.data.protectectedUser.avatar,
        role: "user",
      },
      isRequested: `${booksList[bookIndex].bookTitle}${user.data.protectectedUser._id}`,
    })
  );

  // $("#bookModal").hide();
  $("#bookModal").hide();
  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
};

const account = () => {
  window.location.href = "account.html";
};

const searchBook = () => {
  const searchValue = document.getElementById("searchInput").value;
  if (searchValue) {
    search = searchValue.split(" ").join("").toLowerCase();
  } else {
    search = null;
  }
  if (null) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  }
  getBooksHandler(1);
};

const bookModalBody = (bookIndex) => {
  const div = document.createElement("div");
  const btnContainer = document.createElement("div");
  div.innerHTML = `
    <div class="row g-0">
    <div class="col-md-4">
      <img
        src="${apiUrl}/api/v1/books/images/${booksList[bookIndex].bookImage}"
        alt="..."
        style="width: 150px;
        height: auto"
        class="img-fluid"
      />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${booksList[bookIndex].bookTitle}</h5>
        <p class="card-text">
          <small class="text-muted">by ${booksList[bookIndex].bookAuthor}</small>
        </p>
        <div class="form-group">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
      </div>
    </div>
  </div>
    `;
  btnContainer.innerHTML = `<button type="button" class="btn btn-primary" onclick="createReservation(${bookIndex})">
  Send request
</button>`;
  document.getElementById("bookInfoContainer").innerHTML = ``;
  document.getElementById("bookInfoFooter").innerHTML = ``;
  document.getElementById("bookInfoContainer").appendChild(div);
  document.getElementById("bookInfoFooter").appendChild(btnContainer);
};

document.addEventListener(
  "keydown",
  (event) => {
    searchBook();
  },
  false
);
