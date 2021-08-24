//const apiUrl = `http://127.0.0.1:8000`;
const apiUrl = `https://selibapi.herokuapp.com`;

const user = JSON.parse(localStorage.getItem("user"));
var dataId = new Array();
var methods = ["PATCH", "DELETE"];
var typeOfRequest = ["reserved", "borrowed", "returned"];

let currIdIndex;
let currIdMethod;
let currIdType;

$(function () {
  console.log(user.data.protectectedUser.avatar);
  $("#topLoading").hide();
  $("#navName").html(user.data.protectectedUser.name);
  $("#avatar").attr(
    "src",
    `${apiUrl}/api/v1/users/images/${user.data.protectectedUser.avatar}`
  );
});

const reservations = (pending, dateTitle, tableId, type) => {
  let dataSets = new Array();
  pending.forEach((data) => {
    dataId.push(data._id);

    let dataDate;
    if (type === 1) {
      dataDate = data.reservedAt.slice(0, 10);
    } else if (type === 2) {
      dataDate = data.borrowedAt.slice(0, 10);
    } else {
      dataDate = data.pendingAt.slice(0, 10);
    }
    console.log(data.userName);
    const dataSet = new Array();
    dataSet[0] = `<p onclick="resevationMessage(${dataId.indexOf(
      data._id
    )},${1})">${data.userName}</p>`;
    dataSet[1] = data.idNumber;
    dataSet[2] = dataDate;
    dataSet[3] = data.bookTitle;
    dataSet[4] = `<button onclick="pickDate(${dataId.indexOf(
      data._id
    )},${"methods[0]"},${type})"
    style="
      background-color: transparent;
      border: none;
      color: green;
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      class="bi bi-bookmark-check"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
      />
      <path
        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
      />
    </svg>
  </button>`;
    dataSet[5] = `<button onclick="updateRequest(${dataId.indexOf(
      data._id
    )},${"methods[1]"})"
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
  $(tableId).DataTable({
    bDestroy: true,
    data: dataSets,
    columns: [
      { title: "Name" },
      { title: "ID Number" },
      { title: dateTitle },
      { title: "Book Title" },
      { title: "Accept" },
      { title: "Reject" },
    ],
  });
};

function pickDate(index, method, type) {
  currIdIndex = index;
  currIdMethod = method;
  currIdType = type;

  console.log(type);

  let title;
  if (type === 0) {
    title = "Set pick-up date";
  } else if (type === 1) {
    title = "Set return date";
  }

  $("#modalDateTitle").text(title);
  $("#adminModal").modal("toggle");
  $("#adminModal").modal("show");
}

function sendNow() {
  if (!$("#setDate").val() && currIdType != 2) {
    console.log("Please Endter date");
  } else {
    updateRequest(currIdIndex, currIdMethod, currIdType);
  }
}

function updateRequest(id, method, type) {
  console.log(method);
  if (method === "PATCH") {
  }

  const date = new Date($("#setDate").val());
  console.log(typeOfRequest[type]);
  var xhr = new XMLHttpRequest();
  xhr.open(method, `${apiUrl}/api/v1/reserve/${dataId[id]}`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  if (method === "PATCH") {
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.onprogress = function () {
    $("#topLoading").show();
  };
  xhr.onload = function () {
    console.log("DONE");
    $("#adminModal").modal("hide");
    $("#topLoading").hide();
  };

  let datas = {};
  if (typeOfRequest[type] === "reserved") {
    datas = {
      status: typeOfRequest[type],
      reservedAt: date,
    };
  } else if (typeOfRequest[type] === "borrowed") {
    datas = {
      status: typeOfRequest[type],
      borrowedAt: date,
    };
  } else if (typeOfRequest[type] === "returned") {
    datas = {
      status: typeOfRequest[type],
      returnAt: date,
    };
  }
  xhr.send(JSON.stringify(datas));
  getReservationsHandler();
  getReservationsHandler();
}

const getReservationsHandler = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/reserve/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.onprogress = function () {
    $("#topLoading").show();
  };
  xhr.onload = function () {
    $("#topLoading").hide();
    const data = JSON.parse(this.responseText);
    console.log(data.data.pendings);
    reservations(data.data.pendings, "Pending Date", "#pendingdatatable", 0);
    reservations(data.data.reserved, "Pick-up Date", "#reserveddatatable", 1);
    reservations(data.data.borrowed, "Return Date", "#borroweddatatable", 2);
  };

  xhr.send(JSON.stringify());
};
window.onload = getReservationsHandler();

function resevationMessage(idIndex, first) {
  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/reserve/${dataId[idIndex]}&0`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.onprogress = function () {
    $("#topLoading").show();
  };
  xhr.onload = function () {
    $("#topLoading").hide();
    const data = JSON.parse(this.responseText);
    const messages = data.messages;

    let messageHtml = ``;

    messages.forEach((message) => {
      if (message.role === "user") {
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
            src="${apiUrl}/api/v1/users/images/${message.avatar}"
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
      class="form-control"
    />
    <span class="input-group-btn">
      <button onclick="sendMessage(${idIndex})"  class="btn btn-warning btn-flat">
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
function sendMessage(id) {
  if (!document.querySelector("#messageInput").value) {
    return this;
  }
  var xhr = new XMLHttpRequest();
  var d = new Date();
  xhr.open(`PATCH`, `${apiUrl}/api/v1/reserve/${dataId[id]}&0`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onprogress = function () {
    $("#topLoading").show();
  };
  xhr.onload = function () {
    $("#topLoading").hide();
    console.log(this.responseText);
  };
  xhr.send(
    JSON.stringify({
      name: user.data.protectectedUser.name,
      message: document.querySelector("#messageInput").value,
      messageDate: new Date(
        `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      ),
      avatar: user.data.protectectedUser.avatar,
      role: "admin",
    })
  );
  resevationMessage(id, 0);
}
