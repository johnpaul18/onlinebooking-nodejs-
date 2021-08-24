const user = JSON.parse(localStorage.getItem("user"));

const createAnouncement = () => {
  var xhr = new XMLHttpRequest();
  xhr.open(`POST`, `http://127.0.0.1:8000/api/v1/anouncement/`, true);
  xhr.setRequestHeader("Authorization", "Bearer " + user.token);

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);
    // demo.showNotification("top", "center", `New book created`);
  };

  var formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("photo", document.getElementById("img").files[0]);
  formData.append("body", document.getElementById("body").value);

  xhr.send(formData);
};
