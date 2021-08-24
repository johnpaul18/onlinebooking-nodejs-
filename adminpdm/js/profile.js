$(function () {
  $("#profName").html(user.data.protectectedUser.name);
  $("#avatar").attr(
    "src",
    `${apiUrl}/api/v1/users/images/${user.data.protectectedUser.avatar}`
  );
});
