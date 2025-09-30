//========================
// Dostęp do FIRESTORE
//========================
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { app } from "./firebase.js";
import { auth } from "./firebase-auth.js";

const db = getFirestore(app); //getFirestore(app) — łączy projekt z Firestore.

const measurementDate = document.getElementById("measurement-date");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayFullDate = `${year}-${month}-${day}`;
measurementDate.value = todayFullDate;

//========================
// POBRANIE DANYCH
//========================

const glucoseFirst = document.getElementById("glucose_first");
const glucoseSecond = document.getElementById("glucose_second");
const pressureMorning = document.getElementById("pressure_first");
const pressureEvening = document.getElementById("pressure_second");
const weight = document.getElementById("weight");
const saveBtn = document.querySelector(".save-btn");

saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const measurement = {
    date: measurementDate.value,
    glucose: { first: "", second: "" },
    pressure: { morning: "", evening: "" },
    weight: "",
  };

  // Sprawdzenie, czy użytkownik coś wpisał
  const hasInput =
    glucoseFirst.value ||
    glucoseSecond.value ||
    pressureMorning.value ||
    pressureEvening.value ||
    weight.value;

  if (!hasInput) return; // jeśli nic nie wpisano, kończymy

  // Pobranie zapisanych danych
  const savedMeasurement = JSON.parse(
    localStorage.getItem(measurementDate.value)
  );

  const fields = [
    { name: "glucose.first", input: glucoseFirst, path: ["glucose", "first"] },
    {
      name: "glucose.second",
      input: glucoseSecond,
      path: ["glucose", "second"],
    },
    {
      name: "pressure.morning",
      input: pressureMorning,
      path: ["pressure", "morning"],
    },
    {
      name: "pressure.evening",
      input: pressureEvening,
      path: ["pressure", "evening"],
    },
    { name: "weight", input: weight, path: ["weight"] },
  ];

  for (const field of fields) {
    const inputValue = field.input.value.trim();

    // WALIDACJA: jeśli format niepoprawny → alert i przerwij funkcję
    if (inputValue && !validateField(inputValue, field.name.split(".")[0])) {
      alert(`Niepoprawny format pola ${field.name}`);
      return; // przerywa całe zapisywanie, formularz pozostaje
    }

    const existingValue =
      field.path.length === 2
        ? savedMeasurement?.[field.path[0]]?.[field.path[1]] ?? ""
        : savedMeasurement?.[field.path[0]] ?? "";

    if (confirmFieldOverwrite(field.name, inputValue, existingValue)) {
      if (field.path.length === 2) {
        measurement[field.path[0]][field.path[1]] = inputValue;
      } else {
        measurement[field.path[0]] = inputValue;
      }
    }
  }
  //TU BYŁ ZAPIS DO LOCAL STORAGE
  // // Wszystkie pola poprawne → zapis i reset
  // localStorage.setItem(measurement.date, JSON.stringify(measurement));

  // tworzymy dokument dla danego użytkownika i daty pomiaru
  // zakładam, że mamy auth.currentUser.uid do identyfikacji użytkownika

  //pobiera unikalne ID zalogowanego użytkownika.
  const userId = auth.currentUser.uid;

  //tworzy ścieżkę dokumentu w Firestore:
  // kolekcja users → dokument z ID użytkownika → podkolekcja measurements → dokument z datą pomiaru.
  const docRef = doc(db, "users", userId, "measurements", measurement.date);

  //sprawdzamy czy dokument już istnieje
  const docSnap = await getDoc(docRef);
  // docSnap.exists() — zwraca true, jeśli dokument istnieje.
  // docSnap.data() — daje dostęp do zapisanych wcześniej danych.

  if (docSnap.exists()) {
    const confirmOverwrite = confirm(
      `Pomiar z dnia ${measurement.date} już istnieje. Nadpisać?`
    );
    if (!confirmOverwrite) return; //przerywamy zapis
  }
  // zapisuje cały obiekt measurement w tym dokumencie. Jeśli dokument już istnieje, nadpisze go
  // await — czekamy aż zapis się zakończy, żeby nie robić nic przed jego zakończeniem.
  await setDoc(docRef, measurement);
  resetForm();
});

function resetForm() {
  glucoseFirst.value = "";
  glucoseSecond.value = "";
  pressureMorning.value = "";
  pressureEvening.value = "";
  weight.value = "";
}

function confirmFieldOverwrite(fieldName, inputValue, existingValue) {
  if (!inputValue) return false; // pusty lub same spacje → nie pytamy
  if (existingValue === "") return true; // brak zapisanej wartości → zapisujemy od razu
  return confirm(
    `Pole ${fieldName} ma już wartość ${existingValue}. Nadpisać?`
  );
}

function validateField(value, type) {
  let pattern;
  if (type === "glucose") {
    pattern = /^\d+$/;
  } else if (type === "pressure") {
    pattern = /^\d{2,3}\/\d{2,3}$/; // np. 120/80
  } else if (type === "weight") {
    pattern = /^\d{1,3}\.\d$/; // np. 75.5
  } else {
    return false;
  }

  return pattern.test(value);
}

//========================
// FUNKCJA POBRANIA DANYCH Z FIRESTORE
//========================

// Funkcja przyjmuje date (np. "2025-09-30") jako parametr.
// Tworzy ścieżkę dokumentu w Firestore: użytkownik → pomiary → data.
// Jeśli dokument istnieje → zwraca dane, jeśli nie → zwraca null.

async function getMeasurements(date) {
  const userId = auth.currentUser.uid;
  const docRef = doc(db, "users", userId, "measurements", date);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap(data()); // zwraca zapisany obiekt measurement
  } else {
    return null; //brak danych dla tej daty
  }
}
