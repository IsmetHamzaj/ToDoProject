const form = document.querySelector("form");
const btnLogin = document.getElementById("user_login");
const email = document.getElementById("user_email");
const password = document.getElementById("user_password");
const logout = document.getElementById("user_logout");
const divError = document.querySelector(".error-class");
const errorMsg = document.querySelector(".error-message");

console.log(divError);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log(email.value);
  console.log(password.value);

  axios
    .post("http://localhost:3000/api/user/login", {
      email: email.value,
      password: password.value,
    })
    .then(function (response) {
      if (response.data.status === "success") {
        location.assign("/todo");
      }
    })
    .catch(function (error) {
      if (error.response) {
        divError.classList.remove("hidden");
        errorMsg.innerHTML = error.response.data.message;

        setTimeout(function () {
          divError.classList.add("hidden");
        }, 4000);
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
