const messageRed = (text) => {
  Toastify({
    text: text,
    duration: 3000, // 3 sekundy
    gravity: "top", // top lub bottom
    position: "center", // left, center, right
    backgroundColor: "linear-gradient(to right, #f94144, #c1121f)",
  }).showToast();
};

const messageGreen = (text) => {
  Toastify({
    text: text,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: "linear-gradient(to right,  #468720ff, #5ca530)", // zielony gradient
  }).showToast();
};

const askOverwrite = async (fieldName, existingValue) => {
  const result = await Swal.fire({
    title: `Pole ${fieldName} ma już wartość ${existingValue}`,
    text: "Czy chcesz nadpisać?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Tak",
    cancelButtonText: "Nie",
    showClass: {
      popup: "swal2-show animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "swal2-hide animate__animated animate__fadeOutUp",
    },
    customClass: {
      popup: "swal-custom-popup",
      title: "swal-custom-title",
      icon: "swal-custom-icon",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
  });
  if (result.isConfirmed) {
    messageGreen(`Pole ${fieldName} zostało nadpisane`);
    return true;
  } else {
    messageRed(`Nie nadpisano pola ${fieldName}`);
    return false;
  }
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayFullDate = `${year}-${month}-${day}`;
  return todayFullDate;
};

const getValueFromArray = (key, data, unit) => {
  const value = key.split(".").reduce((a, b) => a?.[b], data);
  return value ? `${value} ${unit}` : "brak pomiaru";
};

const reverseDateFormat = (date) => {
  const newDate = date.split("-");
  return `${newDate[2]}-${newDate[1]}-${newDate[0]}`;
};
export {
  askOverwrite,
  messageGreen,
  messageRed,
  getValueFromArray,
  getTodayDate,
  reverseDateFormat,
};
