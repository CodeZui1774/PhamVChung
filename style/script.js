const fill = document.getElementById('fill');
const fillBtn = document.getElementById('fillBtn');
const giftBtn = document.getElementById('giftBtn');
const heart = document.getElementById('heart');
const heartContainer = document.getElementById('heartContainer');
const pop = document.getElementById('popbtn');
const tada = document.getElementById('tadabtn');

let level = 0;
let clickCount = 0;
let lastClickTime = Date.now();
let fallInterval;
let heartFull = false;
let holdInterval; // <== thêm để xử lý nhấn giữ

const emojis = ["😍", "❤️", "🥰", "❤️‍🩹", "❤️‍🔥", "💘", "💝", "💛", "💚", "🧡", "💌"];

function startFalling() {
    clearInterval(fallInterval);
    fallInterval = setInterval(() => {
        if (heartFull) return;
        const now = Date.now();
        if (now - lastClickTime > 700 && level > 0) {
            level = Math.max(0, level - 3);
            fill.style.height = level + '%';
        }
    }, 100);
}

function pumpHeart() {
    heart.classList.add('pump');
    setTimeout(() => heart.classList.remove('pump'), 200);
}

function createFloatingEmoji() {
    const emoji = document.createElement('span');
    emoji.classList.add('emoji');
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    document.body.appendChild(emoji);

    const x = fillBtn.offsetLeft + fillBtn.offsetWidth / 2 + (Math.random() * 100 - 50);
    const y = fillBtn.offsetTop + fillBtn.offsetHeight / 2;
    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;
    emoji.style.animationDuration = (1 + Math.random() * 0.5) + 's';
    emoji.style.fontSize = (24 + Math.random() * 10) + 'px';

    setTimeout(() => emoji.remove(), 1300);
}

function increaseHeartLevel() {
    if (heartFull) return;
    pop.currentTime = 0;
    pop.play();

    lastClickTime = Date.now();
    clickCount++;
    pumpHeart();
    createFloatingEmoji();

    if (clickCount >= 5) {
        clickCount = 0;
        if (level < 100) {
            level += 10;
            fill.style.height = level + '%';
        }

        if (level >= 100) {
            level = 100;
            heartFull = true;
            fill.style.height = '100%';
            heart.classList.add('full');
            clearInterval(fallInterval);

            const congrats = document.createElement('div');
            congrats.classList.add('congrats');
            tada.play();
            congrats.innerText = 'Congratulations';
            heartContainer.appendChild(congrats);

            setTimeout(() => {
                congrats.remove();
                fillBtn.style.display = 'none';
                giftBtn.style.display = 'inline-block';
            }, 2000);
        }
    }
}

fillBtn.addEventListener('click', increaseHeartLevel);

// 👉 Thêm tính năng NHẤN GIỮ
fillBtn.addEventListener('mousedown', () => {
    if (heartFull) return;
    holdInterval = setInterval(() => {
        increaseHeartLevel();
    }, 200); // mỗi 200ms tăng 1 "nhịp"
});

fillBtn.addEventListener('mouseup', () => {
    clearInterval(holdInterval);
});
fillBtn.addEventListener('mouseleave', () => {
    clearInterval(holdInterval);
});

// 👉 hỗ trợ cho thiết bị cảm ứng
fillBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (heartFull) return;
    holdInterval = setInterval(() => {
        increaseHeartLevel();
    }, 200);
});

fillBtn.addEventListener('touchend', () => {
    clearInterval(holdInterval);
});

giftBtn.addEventListener('click', () => {
    heart.classList.add('pump');
    pop.currentTime = 0;
    pop.play();
    giftBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        giftBtn.style.transform = 'scale(1)';
        window.location.href = 'style/gift.html';
    }, 300);
});

startFalling();
