//const apiUrl = `http://127.0.0.1:8000`;
const apiUrl = `https://selibapi.herokuapp.com`;
const user = JSON.parse(localStorage.getItem("user"));
$(function () {
  $("#navName").html(user.data.protectectedUser.name);
  $("#avatar").attr(
    "src",
    `${apiUrl}/api/v1/users/images/${user.data.protectectedUser.avatar}`
  );
});

var bdataId = new Array();
const booksTable = (books) => {
  let dataSets = new Array();
  books.forEach((data) => {
    bdataId.push(data._id);
    console.log(1);
    const dataSet = new Array();
    dataSet[0] = data.title;
    dataSet[1] = data.author[0];
    dataSet[2] = data.copyrightDate;
    dataSet[3] = data.availableCopies;
    dataSet[4] = `<button
    style="
      background-color: transparent;
      border: none;
      color: green;
    "
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
  </button>`;
    dataSet[5] = `<button
    onclick="deleteBookHandler(${bdataId.indexOf(data._id)})"
    style="
      background-color: transparent;
      border: none;
      color: red;
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      class="bi bi-bookmark-x"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708z"
      />
      <path
        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
      />
    </svg>
  </button>`;

    dataSets.push(dataSet);
  });

  console.log(dataSets);
  $("#bookList").DataTable({
    bDestroy: true,
    data: dataSets,
    columns: [
      { title: "Title" },
      { title: "Author" },
      { title: "Copyright Date" },
      { title: "Number of copies" },
      { title: "Edit" },
      { title: "Delete" },
    ],
  });
};

const getBooksHandler = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/books/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    const books = data.data.books;
    booksTable(books);
    console.log(books);
  };

  xhr.send(JSON.stringify());
};
window.onload = getBooksHandler();

const createBookHandler = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`POST`, `${apiUrl}/api/v1/books/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    demo.showNotification("top", "center", `New book created`);
  };
  var formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("author", document.getElementById("author").value);
  formData.append("subjects", "english");
  formData.append(
    "copyrightDate",
    document.getElementById("copyrightDate").value
  );
  formData.append(
    "numberOfCopies",
    document.getElementById("numberOfCopies").value
  );
  formData.append("isbn", "");
  formData.append("photo", document.getElementById("img").files[0]);

  xhr.send(formData);

  getBooksHandler();
};

const deleteBookHandler = (id) => {
  console.log(bdataId[id]);
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${apiUrl}/api/v1/books/${bdataId[id]}`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.send();
  getBooksHandler();
};

function showall() {
  $("#addbookContainer").show();
  $("#bookListContainer").show();
}

function showAddBook() {
  $("#addbookContainer").show();
  $("#bookListContainer").hide();
}

function showBookList() {
  $("#addbookContainer").hide();
  $("#bookListContainer").show();
}
