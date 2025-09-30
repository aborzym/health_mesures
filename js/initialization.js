const loginPage = document.getElementById("login-page");
const measurementsPage = document.getElementById("measurements-page");
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");

  // Tu będzie logika firebase
  console.log("Logowanie", email.value, password.value);

  loginPage.classList.add("hidden");
  measurementsPage.classList.remove("hidden");
});
