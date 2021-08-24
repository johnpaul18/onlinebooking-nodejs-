const user = JSON.parse(localStorage.getItem("user"));
//const apiUrl = `https://selibapi.herokuapp.com`;
const apiUrl = `https://secasestudy.herokuapp.com`;

var udataId = new Array();
const postTable = (posts) => {
  let dataSets = new Array();
  posts.forEach((data) => {
    udataId.push(data._id);
    console.log(data.category);
    const dataSet = new Array();
    dataSet[0] = data.title;
    dataSet[1] = data.category ? data.category : "Other";
    dataSet[2] = data.postedAt ? data.postedAt : "NA";
    dataSet[3] = `<button
    onclick="deletePostHandler(${udataId.indexOf(data._id)})"
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

  $("#postList").DataTable({
    bDestroy: true,
    data: dataSets,
    columns: [
      { title: "Title" },
      { title: "Catecoty" },
      { title: "Post date" },
      { title: "Delete" },
    ],
  });
};

const getPostsHandler = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, `${apiUrl}/api/v1/anouncement/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    console.log(data.data.announcements);
    postTable(data.data.announcements);
  };
  xhr.send(JSON.stringify());
};
window.onload = getPostsHandler();

const deletePostHandler = (id) => {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${apiUrl}/api/v1/anouncement/${udataId[id]}`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);
  xhr.send();
  getPostsHandler();
};

const createAnouncement = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`POST`, `${apiUrl}/api/v1/anouncement/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    console.log(data);
    demo.showNotification("top", "center", `Post success`);
  };

  var formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("category", document.getElementById("category").value);
  if (document.getElementById("postImg").files[0])
    formData.append("photo", document.getElementById("postImg").files[0]);
  formData.append("body", $("#summernote").summernote("code"));
  formData.append(
    "postedAt",
    `${new Date()
      .toLocaleDateString()
      .toString()
      .replaceAll("/", " ")} ${moment().format("hh:mm A")}`
  );

  console.log(document.getElementById("postImg").files[0]);

  xhr.send(formData);
};

function showall() {
  $("#addPostContainer").show();
  $("#postListContainer").show();
}

function showAddBook() {
  $("#addPostContainer").show();
  $("#postListContainer").hide();
}

function showBookList() {
  $("#addPostContainer").hide();
  $("#postListContainer").show();
}
