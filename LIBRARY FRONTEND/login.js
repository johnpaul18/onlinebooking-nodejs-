//const apiUrl = `http://127.0.0.1:8000`;

function login() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${apiUrl}/api/v1/users/login`, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onprogress = function () {
    document.querySelector(
      "#loginBtn"
    ).innerHTML = `<div class="spinner-border text-warning" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  };

  xhr.onload = function () {
    document.querySelector("#loginBtn").innerHTML = `Submit`;
    const data = JSON.parse(this.responseText);
    if (data.status === "fail") {
      document.querySelector("#loginFail").classList.remove("hide");
    } else if (data.data.protectectedUser.role === "admin") {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "./adminpdm/reservation.html";
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "homepage.html";
    }
  };

  xhr.send(
    JSON.stringify({
      email: document.querySelector("#loginEmail").value,
      password: document.querySelector("#loginPassword").value,
    })
  );
}
