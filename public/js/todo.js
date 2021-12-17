const form = document.querySelector("form");
const btnAdd = document.getElementById("add_todo");
const title = document.getElementById("todo_title");
const description = document.getElementById("todo_description");
const status = document.getElementById("change_todo");
// const logout = document.getElementById("user_logout");
// const divError = document.querySelector(".error-class");
// const errorMsg = document.querySelector(".error-message");
const changeStatus = document.querySelector(".change-status");

changeStatus.addEventListener("click", function () {
  const id = changeStatus.getAttribute("data-id");
  console.log(id);
  axios
    .patch(`http://localhost:3000/api/todo/${id}`, {
      status: 0,
    })
    .then((response) => console.log("CHANGED"))
    .catch((err) => console.log("WRONG"));
});

// console.log(divError);

console.log(title);
console.log(description);

form.addEventListener("submit", function (e) {
  axios
    .post("http://localhost:3000/api/todo", {
      title: title.value,
      description: description.value,
    })
    .then(function (response) {
      console.log(response);
      if (response.data.status === "success") {
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log("ERR:", error.response);
        // divError.classList.remove("hidden");
        // errorMsg.innerHTML = error.response.data.message;

        // setTimeout(function () {
        //   divError.classList.add("hidden");
        // }, 4000);
      }
    });
});

// logout.addEventListener("click", function () {
//   axios
//     .get("http://localhost:3000/api/user/logout")
//     .then(function (response) {
//       console.log("Logged Out");
//     })
//     .catch(function (error) {
//       if (error.response) {
//         // Request made and server responded
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       }
//     });
// });
