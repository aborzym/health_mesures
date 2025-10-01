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

document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // DATA W INPUT
  // ========================
  const measurementDate = document.getElementById("measurement-date");
  if (measurementDate) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayFullDate = `${year}-${month}-${day}`;
    measurementDate.value = todayFullDate;
  }

  // ========================
  // POBRANIE DANYCH
  // ========================
  const glucoseFirst = document.getElementById("glucose_first");
  const glucoseSecond = document.getElementById("glucose_second");
  const pressureMorning = document.getElementById("pressure_first");
  const pressureEvening = document.getElementById("pressure_second");
  const weight = document.getElementById("weight");
  const saveBtn = document.querySelector(".save-btn");

  if (!saveBtn) return; // jeśli formularza nie ma, nic nie robimy

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!auth.currentUser) return; // upewniamy się, że użytkownik jest zalogowany
    const userId = auth.currentUser.uid;
    const docRef = doc(
      db,
      "users",
      userId,
      "measurements",
      measurementDate.value
    );

    // Pobranie istniejącego dokumentu
    const docSnap = await getDoc(docRef);
    const existingMeasurement = docSnap.exists()
      ? docSnap.data()
      : {
          date: measurementDate.value,
          glucose: { first: "", second: "" },
          pressure: { morning: "", evening: "" },
          weight: "",
        };

    const fields = [
      {
        name: "glucose.first",
        input: glucoseFirst,
        path: ["glucose", "first"],
      },
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
      if (!inputValue) continue; // puste pola pomijamy

      // WALIDACJA
      if (!validateField(inputValue, field.name.split(".")[0])) {
        alert(`Niepoprawny format pola ${field.name}`);
        return;
      }

      const existingValue =
        field.path.length === 2
          ? existingMeasurement?.[field.path[0]]?.[field.path[1]] ?? ""
          : existingMeasurement?.[field.path[0]] ?? "";

      // Pytamy tylko, jeśli istnieje wartość i próbujemy nadpisać
      const shouldOverwrite =
        existingValue && existingValue !== inputValue
          ? confirm(
              `Pole ${field.name} ma już wartość ${existingValue}. Nadpisać?`
            )
          : true;

      if (shouldOverwrite) {
        if (field.path.length === 2) {
          existingMeasurement[field.path[0]][field.path[1]] = inputValue;
        } else {
          existingMeasurement[field.path[0]] = inputValue;
        }
      }
    }

    // Zapis do Firestore
    await setDoc(docRef, existingMeasurement);
    resetForm();
  });

  function resetForm() {
    glucoseFirst.value = "";
    glucoseSecond.value = "";
    pressureMorning.value = "";
    pressureEvening.value = "";
    weight.value = "";

    // przywracamy dzisiejszą datę w polu daty
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    measurementDate.value = `${year}-${month}-${day}`;
  }

  function confirmFieldOverwrite(fieldName, inputValue, existingValue) {
    if (!inputValue) return false;
    if (existingValue === "") return true;
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
  async function getMeasurements(date) {
    const userId = auth.currentUser.uid;
    const docRef = doc(db, "users", userId, "measurements", date);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // poprawka: data() a nie data()
    } else {
      return null;
    }
  }
});
