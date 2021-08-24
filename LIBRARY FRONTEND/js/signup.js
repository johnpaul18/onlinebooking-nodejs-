const apiUrl = `https://secasestudy.herokuapp.com`;
//const apiUrl = `https://selibapi.herokuapp.com`;

$(document).ready(function () {
  $("#success-alert").hide();
});

function showAlert() {
  $("#success-alert")
    .fadeTo(2000, 5000)
    .slideUp(5000, function () {
      $("#success-alert").slideUp(5000);
    });
}

function signUp() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${apiUrl}/api/v1/users/signup`, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onprogress = function () {
    document.querySelector(
      "#signupBtn"
    ).innerHTML = `<div class="spinner-border text-warning" role="status">
    <span class="sr-only">Loading...</span>
  </div>`;
  };

  xhr.onload = function () {
    const data = JSON.parse(this.responseText);

    if (data.status === "success") {
      showAlert();
    }
    document.querySelector("#signupBtn").innerHTML = `Submit`;
  };

  xhr.send(
    JSON.stringify({
      name: document.querySelector("#userName").value,
      email: document.querySelector("#email").value,
      address: document.querySelector("#address").value,
      mobileNumber: document.querySelector("#mobileNumber").value,
      idNumber: document.querySelector("#idNumber").value,
      course: document.querySelector("#course").value,
      password: document.querySelector("#password").value,
      passwordConfirm: document.querySelector("#confirmPassword").value,
    })
  );
}

// const data = {
//   status: "success",
//   token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYzQ5ZTIwZmNhYTg2MjU1NGZlM
//     TQ2MCIsImlhdCI6MTYyMzQ5ODI3MiwiZXhwIjoxNjMxMjc0MjcyfQ.dUjeP
//     6khov387XDU1R9H3tTxsjytOzkBwSX2DXLCv5o`,
//   data: {
//     user: {
//       role: "student",
//       _id: "60c49e20fcaa862554fe1460",
//       name: "test name",
//       email: "test_email@gmail.com",
//       password: "$2a$12$vv6baGvLy1O2H3DpXP0R5OFvSe7sehDL9eNQtzDYUkeNARkm3c/Pu",
//       __v: 0,
//     },
//   },
// };
