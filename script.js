const correctPass = "0101";
let input = "";

const lockScreen = document.getElementById("lockScreen");
const passScreen = document.getElementById("passScreen");
const messenger = document.getElementById("messenger");
const celebration = document.getElementById("celebration");
const dots = document.getElementById("dots");
const keypad = document.getElementById("keypad");

const bgMusic = document.getElementById("bgMusic");
const tetMusic = document.getElementById("tetMusic"); // NHẠC TẾT

/* ================= CLOCK ================= */
function updateTime() {
  let now = new Date();

  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  document.getElementById("clock").innerHTML = time;
  document.getElementById("statusTime").innerHTML = time;

  document.getElementById("date").innerHTML = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
setInterval(updateTime, 1000);
updateTime();

/* ================= SWIPE ================= */
let startY = 0;

lockScreen.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

lockScreen.addEventListener("touchend", (e) => {
  let endY = e.changedTouches[0].clientY;

  if (endY - startY < -120) {
    document.getElementById("faceScan").style.opacity = 1;

    setTimeout(() => {
      lockScreen.style.transform = "translateY(-100%)";
      passScreen.style.transform = "translateY(0)";
    }, 300);
  }
});

/* ================= PASSCODE ================= */
for (let i = 0; i < 4; i++) {
  let d = document.createElement("div");
  d.className = "dot";
  dots.appendChild(d);
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""];

numbers.forEach((num) => {
  let key = document.createElement("div");
  key.className = "key";

  if (num !== "") {
    key.innerText = num;

    key.addEventListener("click", () => {
      press(num);
    });
  } else {
    key.style.visibility = "hidden";
  }

  keypad.appendChild(key);
});

function press(num) {
  if (input.length < 4) {
    input += num;
    dots.children[input.length - 1].classList.add("filled");
  }

  if (input.length === 4) {
    setTimeout(checkPass, 300);
  }
}

function checkPass() {
  if (input === correctPass) {
    passScreen.style.transform = "translateY(-100%)";
    messenger.style.transform = "translateY(0)";
    startChat();
  } else {
    passScreen.style.animation = "shake 0.4s";
    setTimeout(() => {
      passScreen.style.animation = "";
    }, 400);

    input = "";
    for (let d of dots.children) {
      d.classList.remove("filled");
    }
  }
}

/* ================= CHAT ================= */
function startChat() {
  const messages = [
    "🎊 Chúc anh, chị và các bạn có 1 cái tết thật vui vẻ bên gia đình!",
    "👑 Cảm ơn nhé",
    "💰 Xuân sang cát tường, phúc lộc đầy nhà, bình an gõ cửa, thành công theo chân.",
    "🚀 2026 bùng nổ!",
  ];

  let i = 0;

  function send() {
    if (i >= messages.length) return;

    let bubble = document.createElement("div");
    bubble.className = "bubble " + (i % 2 === 0 ? "left" : "right");
    bubble.innerText = messages[i];

    document.getElementById("chatBox").appendChild(bubble);

    i++;
    setTimeout(send, 1000);
  }

  send();
}

/* ================= CELEBRATION + NHẠC TẾT ================= */

function launchCelebration() {
  messenger.style.transform = "translateY(-100%)";
  celebration.style.transform = "translateY(0)";

  if (bgMusic) bgMusic.pause();

  tetMusic.currentTime = 0;
  tetMusic.volume = 1;
  tetMusic.play();

  startFireworks();
}

/* ================= REAL FIREWORKS ================= */

function startFireworks() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const phone = document.querySelector(".phone");
  canvas.width = phone.clientWidth;
  canvas.height = phone.clientHeight;
  window.addEventListener("resize", () => {
    canvas.width = phone.clientWidth;
    canvas.height = phone.clientHeight;
  });

  let rockets = [];
  let particles = [];
  let normalMode = false; // sau khi hiện chữ sẽ bật chế độ thường

  /* ================= ROCKET ================= */
  class Rocket {
    constructor(isText = false) {
      this.x = isText ? canvas.width / 2 : Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = canvas.height / 2;
      this.speed = 6;
      this.exploded = false;
      this.isText = isText;
    }

    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY && !this.exploded) {
        if (this.isText) {
          explodeText("HAPPY NEW YEAR");
          setTimeout(() => {
            normalMode = true; // bật pháo thường
          }, 3000);
        } else {
          explodeNormal(this.x, this.y);
        }
        this.exploded = true;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  /* ================= PHÁO CHỮ ================= */
  function explodeText(text) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = "white";
    let fontSize = Math.min(canvas.width / 8, 80);
    tempCtx.font = `bold ${fontSize}px Arial`;

    tempCtx.textAlign = "center";
    tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = tempCtx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    ).data;

    for (let y = 0; y < canvas.height; y += 6) {
      for (let x = 0; x < canvas.width; x += 6) {
        const index = (y * canvas.width + x) * 4;
        if (imageData[index + 3] > 128) {
          particles.push(new Particle(x, y, true));
        }
      }
    }
  }

  /* ================= PHÁO THƯỜNG ================= */
  function explodeNormal(x, y) {
    const colors = [
      `hsl(${Math.random() * 360},100%,60%)`,
      `hsl(${Math.random() * 360},100%,50%)`,
      `hsl(${Math.random() * 360},100%,70%)`,
    ];

    for (let i = 0; i < 20; i++)
      particles.push(new Particle(x, y, false, 4, colors[0]));
    for (let i = 0; i < 15; i++)
      particles.push(new Particle(x, y, false, 3, colors[1]));
    for (let i = 0; i < 10; i++)
      particles.push(new Particle(x, y, false, 2, colors[2]));
  }

  /* ================= PARTICLE ================= */
  class Particle {
    constructor(x, y, isText = false, speed = 0, color = "") {
      this.x = isText ? canvas.width / 2 : x;
      this.y = isText ? canvas.height / 2 : y;
      this.targetX = x;
      this.targetY = y;
      this.isText = isText;
      this.speed = speed;
      this.color = color || `hsl(${Math.random() * 360},100%,60%)`;
      this.life = 150;
      this.angle = Math.random() * Math.PI * 2;
      this.gravity = 0.05;
    }

    update() {
      if (this.isText) {
        this.x += (this.targetX - this.x) * 0.07;
        this.y += (this.targetY - this.y) * 0.07;
      } else {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.97;
        this.y += this.gravity;
      }
      this.life--;
    }

    draw() {
      ctx.globalAlpha = this.life / 150;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 3, 3);
      ctx.globalAlpha = 1;
    }
  }

  /* ================= ANIMATE ================= */
  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nếu đã vào chế độ thường thì bắn liên tục
    if (normalMode && Math.random() < 0.05) {
      rockets.push(new Rocket(false));
    }

    rockets.forEach((r, i) => {
      r.update();
      r.draw();
      if (r.exploded) rockets.splice(i, 1);
    });

    particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
  }

  // Bắn pháo chữ đầu tiên
  rockets.push(new Rocket(true));

  animate();
}

const lockNotification = document.getElementById("lockNotification");
const notiTime = document.getElementById("notiTime");

// Giả lập tin nhắn đến sau 3 giây
setTimeout(() => {
  lockNotification.classList.add("show");

  // Cập nhật giờ thông báo
  const now = new Date();
  notiTime.innerText =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  // Rung nhẹ
  document.querySelector(".phone").style.animation = "shake 0.3s";
  setTimeout(() => {
    document.querySelector(".phone").style.animation = "";
  }, 300);
}, 300);

// Click thông báo -> mở passcode
document.addEventListener("DOMContentLoaded", () => {
  const lockScreen = document.getElementById("lockScreen");
  const passScreen = document.getElementById("passScreen");
  const lockNotification = document.getElementById("lockNotification");

  function openPass() {
    lockScreen.style.transform = "translateY(-100%)";
    passScreen.style.transform = "translateY(0)";
  }

  lockNotification.addEventListener("click", openPass);
  lockNotification.addEventListener("touchstart", openPass);
});
