// ==========================
// firebase-auth.js
// ==========================

// Import potrzebnych funkcji z Firebase Auth
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Import zainicjalizowanego Firebase App
import { app } from "./firebase.js";

// Uzyskaj instancję auth
const auth = getAuth(app);

// Elementy DOM
const loginPage = document.getElementById("login-page");
const measurementsPage = document.getElementById("measurement-page");
const loginForm = document.getElementById("login-form");
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");

// ==========================
// Logowanie
// ==========================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Podaj email i hasło!");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Zalogowano:", userCredential.user.email);

    // Pokazujemy stronę pomiarów
    loginPage.classList.add("hidden");
    measurementsPage.classList.remove("hidden");

    // Włącz przycisk logout
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
  } catch (error) {
    console.error("Błąd logowania:", error);
    alert("Nie udało się zalogować: " + error.message);
  }
});

// ==========================
// Wylogowanie
// ==========================
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Wylogowano");

    // Pokazujemy login-page, ukrywamy measurements-page
    loginPage.classList.remove("hidden");
    measurementsPage.classList.add("hidden");

    // Reset przycisków
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";

    // Opcjonalnie: wyczyść pola loginu
    emailInput.value = "";
    passwordInput.value = "";
  } catch (error) {
    console.error("Błąd wylogowania:", error);
    alert("Nie udało się wylogować: " + error.message);
  }
});

// ==========================
// Eksport auth (jeżeli będziesz potrzebował w innych modułach)
// ==========================
export { auth };
