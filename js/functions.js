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
    backgroundColor: "linear-gradient(to right,  #519b26, #81f63d)", // zielony gradient
  }).showToast();
};

export { messageGreen, messageRed };
