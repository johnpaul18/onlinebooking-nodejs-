//const apiUrl = `http://127.0.0.1:8000`;
let currentCategory = `Anouncement`;
function reRenderPosts(cat) {
  $("#postContainer").html(" ");
  $(".announcement-spinner").show();
  currentCategory = cat;
  loadPost();
}

function loadPost() {
  console.log("12312312312312312");
  xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/anouncement`, true);

  xhr.onload = function () {
    $(".announcement-spinner").hide();
    const data = JSON.parse(this.responseText);
    renderPost(data.data.announcements.reverse());
  };
  xhr.send();
}
window.onload = loadPost();

function renderPost(posts) {
  const navLinks = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("navbarSupportedContent15");
  const bsCollapse = new bootstrap.Collapse(menuToggle);
  navLinks.forEach((l) => {
    l.addEventListener("click", () => {
      bsCollapse.toggle();
    });
  });

  let category;
  // if (currentCategory === "Random")
  //   category = posts.filter((obj) => {
  //     return obj.category === undefined;
  //   });
  // else
  category = posts.filter((obj) => {
    return obj.category === currentCategory;
  });

  let categoryLink = ``;
  const categories = posts.map((post) => {
    // if (post.category)
    return post.category;
    // else return "Random";
  });
  let uniqueCategories = [];
  $.each(categories, function (i, el) {
    if ($.inArray(el, uniqueCategories) === -1) uniqueCategories.push(el);
  });
  uniqueCategories.forEach(function (el) {
    categoryLink += `
    <li><button type="button" class="btn btn-outline-warning shadow-sm bold" style="width: 100%"  onclick="reRenderPosts(${JSON.stringify(
      el
    )
      .split('"')
      .join("&quot;")})" class="post-link">${el}</button></li>
    `;
  });

  console.log(uniqueCategories);

  let postsHtml = ``;
  let postsLink = ``;
  postsLink += `
    <li><a href="#navbar" class="post-link font-weight-bold">Home</a></li>
    <li><a href="#contact" class="post-link font-weight-bold">Contact</a></li><br/>`;
  category.forEach((post) => {
    console.log(post);
    postsHtml += `
    <div id="${
      post._id
    }" class="col-md-12 p-5 mb-5 rounded border-left border-2 border-warning">
	  <h2>${post.title}</h2>
	  <p style="font-size: .625em">Posted at <span>${post.postedAt}</span></p>
    ${
      post.image
        ? `<div style="
    max-width: 100%;
    height: auto;" class="mb-2">
    <img src="${apiUrl}/api/v1/anouncement/images/${post.image}" height="100%" width="100%">
    </div>`
        : ""
    }
                ${post.body}
    </div>
    `;

    postsLink += `
    <li><a href="#${post._id}" class="post-link">${post.title}</a></li>
    `;
  });

  console.log(categories);
  console.log(postsHtml);
  $("#postContainer").html(postsHtml);
  $("#postLinks").html(postsLink);
  $("#postCategories").html(categoryLink);
  $("#nav-categories").html(categoryLink);
}
