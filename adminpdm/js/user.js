const apiUrl = `https://secasestudy.herokuapp.com`;
//const apiUrl = `https://selibapi.herokuapp.com`;

const user = JSON.parse(localStorage.getItem("user"));

var udataId = new Array();
const usersTable = (users) => {
  let dataSets = new Array();
  users.forEach((data) => {
    udataId.push(data._id);
    console.log(1);
    const dataSet = new Array();
    dataSet[0] = data.name;
    dataSet[1] = data.address;
    dataSet[2] = data.studentNumber;
    dataSet[3] = data.email;
    dataSet[4] = data.course;
    dataSet[5] = data.mobileNumber;
    dataSet[6] = `<button
    onclick="deleteBookHandler(${udataId.indexOf(data._id)})"
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
  $("#userList").DataTable({
    bDestroy: true,
    data: dataSets,
    columns: [
      { title: "Name" },
      { title: "Address" },
      { title: "Student number" },
      { title: "Email" },
      { title: "Course" },
      { title: "Mobile number" },
      { title: "Delete" },
    ],
  });
};

const getUsersHandler = () => {
  console.log("wow");
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/users`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    usersTable(data.data.users);
    console.log(data);
  };

  xhr.send(JSON.stringify());
};
window.onload = getUsersHandler();

const deleteBookHandler = (id) => {
  console.log(bdataId[id]);
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${apiUrl}/api/v1/books/${bdataId[id]}`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.send();
  getBooksHandler();
};

const createUser = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`POST`, `${apiUrl}/api/v1/users`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    getUsersHandler();
    demo.showNotification("top", "center", `New user created`);
  };

  xhr.send(
    JSON.stringify({
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      studentNumber: document.getElementById("studentNumber").value,
      course: document.getElementById("course").value,
      email: document.getElementById("email").value,
      mobileNumber: document.getElementById("mobileNumber").value,
      password: document.getElementById("password").value,
      passwordConfirm: document.getElementById("password").value,
    })
  );
};

function showall() {
  $("#addUserContainer").show();
  $("#userListContainer").show();
}

function showAddBook() {
  $("#addUserContainer").show();
  $("#userListContainer").hide();
}

function showBookList() {
  $("#addUserContainer").hide();
  $("#userListContainer").show();
}
