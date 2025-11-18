# Mentormoose
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentor Moose - Demo Swipe App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <div class="role-select">
    <h2>Welcome to Mentor Moose</h2>
    <p>Select your role to begin:</p>
    <button onclick="start('mentor')">I am a Mentor</button>
    <button onclick="start('mentee')">I am a Mentee</button>
  </div>

  <div id="card-container" class="hidden"></div>

  <script src="app.js"></script>
</body>
</html>
e;
}

/* swipe cards */
#card-container {
  position: relative;
  width: 300px;
  height: 450px;
}

.card {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: white;
  padding: 20px;
  box-shadow: 0
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.role-select {
  text-align: center;
}

.role-select button {
  padding: 12px 20px;
  margin: 10px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
}

.hidden {
  display: none;
}

/* swipe cards */
#card-container {
  position: relative;
  width: 300px;
  height: 450px;
}

.card {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: white;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.2);
  position: absolute;
  transition: transform 0.2s ease-out;
}

.card img {
  width: 100%;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
}

.card h3 {
  margin-top: 15px;
}
// Fake data for demo
const mentors = [
  { name: "Sarah Johnson", role: "Business Mentor", img: "https://picsum.photos/300/250?1" },
  { name: "Kevin Lee", role: "Software Mentor", img: "https://picsum.photos/300/250?2" },
  { name: "Rita Gomez", role: "Design Mentor", img: "https://picsum.photos/300/250?3" }
];

const mentees = [
  { name: "Alex Rivera", role: "Business Student", img: "https://picsum.photos/300/250?4" },
  { name: "Amanda Chen", role: "Web Dev Student", img: "https://picsum.photos/300/250?5" },
  { name: "Jordan Smith", role: "UX Student", img: "https://picsum.photos/300/250?6" }
];

let chosenList = [];

function start(type) {
  document.querySelector(".role-select").classList.add("hidden");
  document.getElementById("card-container").classList.remove("hidden");

  chosenList = type === "mentor" ? mentees : mentors;
  loadCards();
}

function loadCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  chosenList.forEach((person, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.zIndex = chosenList.length - index;
    card.innerHTML = `
      <img src="${person.img}">
      <h3>${person.name}</h3>
      <p>${person.role}</p>
    `;
    addSwipe(card);
    container.appendChild(card);
  });
}

// Swipe logic
function addSwipe(card) {
  let startX = 0;
  let currentX = 0;

  card.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    document.onmousemove = (e) => {
      currentX = e.clientX - startX;
      card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;
    };
    document.onmouseup = () => release(card);
  });

  card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  card.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;
  });
  card.addEventListener("touchend", () => release(card));
}

function release(card) {
  document.onmousemove = null;
  document.onmouseup = null;

  if (Math.abs(currentX) > 120) {
    card.style.transition = "0.3s";
    card.style.transform = `translateX(${currentX > 0 ? 400 : -400}px) rotate(${currentX / 2}deg)`;
    setTimeout(() => card.remove(), 300);
  } else {
    card.style.transition = "0.3s";
    card.style.transform = "translateX(0px)";
  }
}
