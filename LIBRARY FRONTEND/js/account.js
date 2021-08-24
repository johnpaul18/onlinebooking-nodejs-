const apiUrl = `https://secasestudy.herokuapp.com`;
// const apiUrl = `https://selibapi.herokuapp.com`;

$(function () {
  $("#successMessage").hide();
});

const user = JSON.parse(localStorage.getItem("user"));
const socket = io(`${apiUrl}`);
socket.on("connection");

let currentMessage;

socket.on("message", (data) => {
  data = JSON.parse(data);
  if (data.id === currentMessage) reservationMessage(data.id, 0);
});
const sendMessage = (id) => {
  currentMessage = id;
  if (!document.querySelector("#messageInput").value) {
    return this;
  }
  var d = new Date();
  socket.emit(
    "message",
    JSON.stringify({
      id: currentMessage,
      name: user.data.protectectedUser.name,
      message: document.querySelector("#messageInput").value,
      messageDate: new Date(
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      ),
      avatar: user.data.protectectedUser.avatar,
      role: "user",
    })
  );
};

const accountContent = document.querySelector("#accountContent");
let section = "account";
function accountSettings() {
  $("#navToggleAccount").click();
  document.querySelector("#profileBtn").classList.add("bg-dark");
  document.querySelector("#pendingBtn").classList.add("bg-dark");
  document.querySelector("#borrowedBtn").classList.add("bg-dark");
  document.querySelector("#reservedBtn").classList.add("bg-dark");

  $("#profileBtn").prop("disabled", false);
  $("#pendingBtn").prop("disabled", false);
  $("#borrowedBtn").prop("disabled", false);
  $("#reservedBtn").prop("disabled", false);

  accountContent.innerHTML = ` `;
  switch (section) {
    case "account":
      $("#profileBtn").prop("disabled", true);
      console.log(user.data.protectectedUser.avatar);
      const name = user.data.protectectedUser.name;
      const email = user.data.protectectedUser.email;
      const address = user.data.protectectedUser.address;
      const course = user.data.protectectedUser.course;
      const studentNumber = user.data.protectectedUser.studentNumber;
      const mobileNumber = user.data.protectectedUser.mobileNumber;
      const avatar = user.data.protectectedUser.avatar;

      document.querySelector("#profileBtn").classList.remove("bg-dark");
      document.querySelector("#profileBtn").classList.add("bg-warning");
      const div = document.createElement("div");
      div.innerHTML = `
    <div class="container">
            <div class="row mb-5"><h4>ACCOUNT SETTINGS</h4></div>
            <div class="m-3">
            <img
              class="rounded-circle p-2 align-self-center"
              alt="100x100"
              id="avatar"
              height="120"
              src="${apiUrl}/api/v1/users/images/${user.data.protectectedUser.avatar}"
              data-holder-rendered="true"
            />
            </div>
            <div class="row m-1">
                <div class="col-sm-2">
                  <h6>PHOTO</h6>
                </div>
                <input type="file" class="form-control-file col-sm-9" style="max-width: 400px" id="avatarUpload">
                <div class="col-sm-1"><button onclick="changeAvatar()" type="button" class="btn btn-primary" style="min-width: 60px" id="avatarBtn">Save</button></div>
              </div>
            <div class="row">
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>NAME</h6>
                </div>
                <input type="text" disabled value="${name}" class="col-sm-9" style="max-width: 400px" id="nameSettings"/>

              </div>
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>EMAIL</h6>
                </div>
                <input type="text" disabled value="${email}" class="col-sm-9" style="max-width: 400px" id="emailSettings" />

              </div>
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>MOBILE NUMBER</h6>
                </div>
                <input type="text" disabled value="${mobileNumber}" class="col-sm-9" style="max-width: 400px" id="emailSettings" />

              </div>
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>COURSE</h6>
                </div>
                <input type="text" disabled value="${course}" class="col-sm-9" style="max-width: 400px" id="emailSettings" />

              </div>
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>STUDENT NUMBER</h6>
                </div>
                <input type="text" disabled value="${studentNumber}" class="col-sm-9" style="max-width: 400px" id="emailSettings" />

              </div>
              <div class="row m-1">
                <div class="col-sm-2">
                  <h6>ADDRESS</h6>
                </div>
                <input type="text" disabled value="${address}" class="col-sm-9" style="max-width: 400px" id="emailSettings" />

              </div>
            </div>
            <div class="row mt-5"><h4>Password Change</h4></div>
            <div class="row m-1">
                <div class="col-sm-2">
                  <h6>Current password</h6>
                </div>
                <input type="password" id="currentPassword" placeholder="*********" class="col-sm-9" style="max-width: 400px" />
            </div>
            <div class="row m-1">
                <div class="col-sm-2">
                  <h6>New password</h6>
                </div>
                <input type="password" id="password" placeholder="*********" class="col-sm-9" style="max-width: 400px" />
            </div>
            <div class="row m-1">
                <div class="col-sm-2">
                  <h6>Confirm password</h6>
                </div>
                <input type="password" id="passwordConfirm" placeholder="*********" class="col-sm-9" style="max-width: 400px" />
                <div class="col-sm-1"><button type="button" onclick="updatePassword()" class="btn btn-primary" style="min-width: 60px">Save</button></div>
            </div>
      </div>
    `;
      accountContent.appendChild(div);
      console.log("asdasdas");
      break;
    case "pending":
      $("#pendingBtn").prop("disabled", true);
      document.querySelector("#pendingBtn").classList.remove("bg-dark");
      document.querySelector("#pendingBtn").classList.add("bg-warning");
      XHR(section, section);
      break;
    case "reserved":
      $("#reservedBtn").prop("disabled", true);
      document.querySelector("#reservedBtn").classList.remove("bg-dark");
      document.querySelector("#reservedBtn").classList.add("bg-warning");
      XHR(section, section);
      break;
    case "borrowed":
      $("#borrowedBtn").prop("disabled", true);
      document.querySelector("#borrowedBtn").classList.remove("bg-dark");
      document.querySelector("#borrowedBtn").classList.add("bg-warning");
      XHR(section, section);
      break;
  }
}

window.onload = accountSettings();

const booksPage = () => {
  window.location.href = "homepage.html";
};

const signout = () => {
  window.location.href = "index.html";
  localStorage.clear();
};

const pending = () => {
  section = "pending";
  accountSettings();
};
const reserved = () => {
  section = "reserved";
  accountSettings();
};
const borrowed = () => {
  section = "borrowed";
  accountSettings();
};
const profile = () => {
  section = "account";
  accountSettings();
};

function XHR(reservationStatus, type) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `${apiUrl}/api/v1/reserve/${user.data.protectectedUser._id}&${reservationStatus}`,
    true
  );

  function setHeaders(headers) {
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
  setHeaders({
    Authorization: "Bearer " + user.token,
    "Content-Type": "application/json",
  });

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    renderBooks(data.pending, type);
  };

  xhr.send();
}

const renderBooks = (books, type) => {
  books.forEach((book, index) => {
    let sectionDate;
    if (type === "pending") {
      sectionDate = `Date of request: ${book.pendingAt.slice(0, 10)}`;
    } else if (type === "reserved") {
      sectionDate = `Pick up date: ${book.reservedAt.slice(0, 10)}`;
    } else {
      sectionDate = `Return date: ${book.borrowedAt.slice(0, 10)}`;
    }

    const div = document.createElement("div");
    div.className = "card p-1 m-2 ";
    div.style.maxWidth = "500px";

    div.innerHTML = `
    <div class="row g-0">
    <div class="col-md-4">
      <img
        src="${apiUrl}/api/v1/books/images/${book.bookImage}"
        alt="..."
        class="img-fluid"
        style="max-width: 143px"
      />
    </div>
    <div class="col-md-8 d-flex">
      <div class="card-body">
        <h5 class="card-title">${book.bookTitle}</h5>
        <small>${sectionDate}</small>
      </div>
      <div class="col align-self-end p-2"><button type="button" class="btn btn-success" onclick="reservationMessage(${JSON.stringify(
        book._id
      )
        .split('"')
        .join("&quot;")},1)">Messages</button>
    </div>
  </div>
    `;
    // accountContent.innerHTML = ` `;
    accountContent.append(div);
  });
};

function reservationMessage(id, first) {
  console.log(id);
  currentMessage = id;
  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/reserve/${id}&0`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    const messages = data.messages;

    let messageHtml = ``;

    messages.forEach((message) => {
      if (message.role != "user") {
        messageHtml += `<!-- Message. Default to the left -->
        <div class="direct-chat-msg">
          <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-left"
              >${message.name}</span
            >
            <span class="direct-chat-timestamp pull-right"
              >${message.messageDate}</span
            >
          </div>
          <!-- /.direct-chat-info -->
          <img
            class="direct-chat-img"
            src="${apiUrl}/api/v1/users/images/${message.avatar}"
            alt="Message User Image"
          /><!-- /.direct-chat-img -->
          <div class="direct-chat-text">
            ${message.message}
          </div>
          <!-- /.direct-chat-text -->
        </div>
        <!-- /.direct-chat-msg -->`;
      } else {
        messageHtml += `<!-- Message to the right -->
        <div class="direct-chat-msg right">
          <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-right"
              >${message.name}</span
            >
            <span class="direct-chat-timestamp pull-left"
              >${message.messageDate}</span
            >
          </div>
          <!-- /.direct-chat-info -->
          <img
            class="direct-chat-img"
            src="${apiUrl}/api/v1/users/images/${user.data.protectectedUser.avatar}"
            alt="Message User Image"
          /><!-- /.direct-chat-img -->
          <div class="direct-chat-text">${message.message}</div>
          <!-- /.direct-chat-text -->
        </div>
        <!-- /.direct-chat-msg -->`;
      }
    });

    document.querySelector(
      "#messageFooter"
    ).innerHTML = `<div class="input-group">
    <input
      id="messageInput"
      type="text"
      name="message"
      placeholder="Type Message ..."
      class="form-control m-1"
    />
    <span class="input-group-btn">
      <button onclick="sendMessage(${JSON.stringify(id)
        .split('"')
        .join("&quot;")})"  class="btn btn-warning btn-flat m-1">
        Send
      </button>
    </span>
  </div>`;
    document.querySelector("#messageBox").innerHTML = messageHtml;
    console.log(data.messages);

    if (first) {
      $("#messagesModal").modal("toggle");
      $("#messagesModal").modal("show");
      $("#messagesModal").modal("hide");
      window.setTimeout(function () {
        var elem = document.getElementById("messageBox");
        elem.scrollTop = elem.scrollHeight;
      }, 1000);
    }

    $("#messageBox").scrollTop($("#messageBox")[0].scrollHeight);
  };
  xhr.send();
}

// function sendMessage(id) {
//   if (!document.querySelector("#messageInput").value) {
//     return this;
//   }
//   var xhr = new XMLHttpRequest();
//   var d = new Date();
//   xhr.open(`PATCH`, `${apiUrl}/api/v1/reserve/${id}&0`, true);
//   xhr.setRequestHeader("Authorization", "Bearer " + user.token);
//   xhr.setRequestHeader("Accept", "application/json");
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.onload = function () {
//     console.log(this.responseText);
//   };
//   xhr.send(
//     JSON.stringify({
//       name: user.data.protectectedUser.name,
//       message: document.querySelector("#messageInput").value,
//       messageDate: new Date(
//         `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
//       ),
//       avatar: user.data.protectectedUser.avatar,
//       role: "user",
//     })
//   );
//   reservationMessage(id, 0);
// }

const updatePassword = () => {
  var xhr = new XMLHttpRequest();
  xhr.open("PATCH", `${apiUrl}/api/v1/users/updateMypassword`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    console.log(this.responseText);
    document.getElementById("currentPassword").value = ``;
    document.getElementById("password").value = ``;
    document.getElementById("passwordConfirm").value = ``;
  };

  xhr.send(
    JSON.stringify({
      id: user.data.protectectedUser._id,
      currentPassword: document.getElementById("currentPassword").value,
      password: document.getElementById("password").value,
      passwordConfirm: document.getElementById("passwordConfirm").value,
    })
  );
};

const changeAvatar = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(
    `PATCH`,
    `${apiUrl}/api/v1/users/updateAvatar/${user.data.protectectedUser._id}`,
    true
  );
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onprogress = function () {
    $("#avatarBtn")
      .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>`);
  };

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    if (data.avatar) {
      user.data.protectectedUser.avatar = data.avatar;
      localStorage.setItem("user", JSON.stringify(user));
    }
    console.log(data);
    $("#successMessage").html(`Profile picture successfully changed!`);
    $("#successMessage").show(500);
    setTimeout(function () {
      $("#successMessage").hide(1000);
    }, 3000);
    $("#avatarBtn").html(`Save`);
    accountSettings();
  };

  var formData = new FormData();
  formData.append("avatar", document.getElementById("avatarUpload").files[0]);
  xhr.send(formData);
};
