import { app } from "./firebase.js";
import { auth } from "./firebase-auth.js";
import {
  deleteMeasurement,
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
export const db = getFirestore(app); // połączenie z firestore
const recordsHeader = document.getElementById("records-header");
const recordsContainer = document.querySelector(".records-container");
const recordList = document.getElementById("records-list");
const today = getTodayDate();
const dateInput = document.getElementById("measurement-date");
let currentUser;
//========================
// POBRANIE DZISIEJSZEGO DOKUMENTU DLA STARTU STRONY
//========================
const loader = document.getElementById("loader");

onAuthStateChanged(auth, (user) => {
  document.body.classList.remove("preloading");
  loader.classList.add("hidden");

  if (user) {
    currentUser = user;
    fetchAndRenderRecords(today);
  } else {
    window.location.href = "index.html";
  }
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
    // =====> Dodaj ikonę kosza tylko jeśli jest pomiar
    if (value !== "brak pomiaru") {
      const deleteBtn = document.createElement("span");
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
  <g id="trash">
    <path d="M20.5 4h-3.64l-.69-2.06a1.37 1.37 0 0 0-1.3-.94h-4.74a1.37 1.37 0 0 0-1.3.94L8.14 4H4.5a.5.5 0 0 0 0 1h.34l1 17.59A1.45 1.45 0 0 0 7.2 24h10.6a1.45 1.45 0 0 0 1.41-1.41L20.16 5h.34a.5.5 0 0 0 0-1zM9.77 2.26a.38.38 0 0 1 .36-.26h4.74a.38.38 0 0 1 .36.26L15.81 4H9.19zm8.44 20.27a.45.45 0 0 1-.41.47H7.2a.45.45 0 0 1-.41-.47L5.84 5h13.32z"/>
    <path d="M9.5 10a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5zM12.5 9a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5zM15.5 10a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5z"/>
  </g>
</svg>`;
      deleteBtn.classList.add("record-delete");
      deleteBtn.addEventListener("click", () => {
        //logika kasowania
        deleteMeasurement(date, item.key);
      });
      p.appendChild(deleteBtn);
    }
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
