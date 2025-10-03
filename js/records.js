import { app } from "./firebase.js";
import { auth } from "./firebase-auth.js";
import {
  messageRed,
  getTodayDate,
  getValueFromArray,
  reverseDateFormat,
} from "./functions.js";

import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { recordsTemplate } from "./recordsData.js";
const db = getFirestore(app); // połączenie z firestore
const recordsHeader = document.getElementById("records-header");
const recordsContainer = document.querySelector(".records-container");
const recordList = document.getElementById("records-list");
const today = getTodayDate();
const dateInput = document.getElementById("measurement-date");
let currentUser;
//========================
// POBRANIE DZISIEJSZEGO DOKUMENTU DLA STARTU STRONY
//========================
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    fetchAndRenderRecords(today);
  } else window.location.href = "index.html";
});

//========================
// POBRANIE DATY
//========================
dateInput.addEventListener("input", async (e) => {
  const selectedDate = e.target.value;
  console.log("selected date: " + selectedDate);
  if (currentUser) fetchAndRenderRecords(selectedDate);
  if (selectedDate !== today) {
    recordsHeader.innerText = `Pomiary z dnia ${reverseDateFormat(
      selectedDate
    )}`;
  } else recordsHeader.innerText = "Dzisiejsze zapisane pomiary";
});

//========================
// Funkcja renderowania  zapisów
//========================
function renderRecordsForDate(data, date) {
  recordList.innerHTML = "";
  recordsContainer.classList.remove("hidden");
  recordsTemplate.forEach((item) => {
    const value = getValueFromArray(item.key, data, item.unit);
    const p = document.createElement("p");
    const span = document.createElement("span");
    p.classList.add("record-label");
    p.innerText = `${item.label} :`;
    span.classList.add("record-value");
    span.innerText = value;
    p.appendChild(span);
    recordList.appendChild(p);
  });
}

async function fetchAndRenderRecords(date) {
  // Jeśli użytkownik jest zalogowany, pobieramy jego UID używamy usera z globalnej zmiennej
  const userId = currentUser.uid;
  // Tworzymy referencję do dokumentu w Firestore
  // Struktura: kolekcja "users" → dokument userId → kolekcja "measurements" → dokument z wybraną datą
  const docRef = doc(db, "users", userId, "measurements", date);
  try {
    // Pobieramy dokument z Firestore
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Jeśli dokument istnieje → wywołujemy funkcję renderującą pomiary
      // Tutaj mozna przekazać docSnap.data() jako dane
      renderRecordsForDate(docSnap.data(), date);
    } else {
      // Jeśli dokument nie istnieje → ukrywamy kontener z zapisanymi pomiarami
      recordsContainer.classList.add("hidden");
    }
  } catch (error) {
    // Jeśli coś pójdzie nie tak z pobraniem dokumentu, logujemy błąd
    console.error("Błąd przy pobieraniu dokumentu:", error);
    messageRed("Wystąpił błąd przy pobieraniu dokumentu - spróbuj jeszcze raz");
  }
}
