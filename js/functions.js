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

async function askOverwrite(fieldName, existingValue) {
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
}
export { messageGreen, messageRed, askOverwrite };
