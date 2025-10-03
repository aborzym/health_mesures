document.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.getElementById("login-page");
  const measurementsPage = document.getElementById("measurement-page");
  const loginForm = document.getElementById("login-form");

  if (!loginForm) return; // dodatkowo zabezpieczenie

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");

    loginPage.classList.add("hidden");
    measurementsPage.classList.remove("hidden");
  });
});
