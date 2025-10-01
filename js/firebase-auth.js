// ==========================
// firebase-auth.js
// ==========================

// Import potrzebnych funkcji z Firebase Auth
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
const body = document.querySelector(".preload-hidden");

let loadingAuth = true;
loginPage.style.display = "none";
measurementsPage.style.display = "none";
logoutBtn.style.display = "none";

// onAuthStateChanged reaguje za każdym razem, gdy zmienia się stan logowania (login, logout, odświeżenie strony).
onAuthStateChanged(auth, (user) => {
  loadingAuth = false;
  if (user) {
    loginPage.style.display = "none";
    measurementsPage.classList.remove("hidden");
    measurementsPage.style.display = "block";
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
  } else {
    loginPage.style.display = "flex";
    measurementsPage.classList.add("hidden");
    measurementsPage.style.display = "none";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
  }
});

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
