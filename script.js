// Initialize lucide icons
lucide.createIcons();

// --- Interactive Canvas Background Script ---
const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

const mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 100) * (canvas.width / 100)
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(129, 140, 248, 0.5)';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#818cf8';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height / 100) * (canvas.width / 100);
    init();
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();

// --- Intersection Observer for reveal animations ---
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

// --- Game Card 3D Tilt + Spotlight Effect ---
const gameCards = document.querySelectorAll('.game-card');
gameCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        const { width, height } = rect;
        const rotateX = (y / height - 0.5) * -15; 
        const rotateY = (x / width - 0.5) * 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// --- Modal & Toast Logic ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast';
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { container.removeChild(toast); }, 500); }, 3000);
}
const privateModeBtn = document.getElementById('private-mode-btn');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');
const loginFormContainer = document.getElementById('login-form-container');
const errorMessage = document.getElementById('error-message');
const modalBackdrop = document.querySelector('.modal-backdrop');

const openModal = () => {
    loginModal.classList.remove('hidden');
    setTimeout(() => {
        loginFormContainer.classList.remove('scale-95', 'opacity-0');
        loginFormContainer.classList.add('scale-100', 'opacity-100');
    }, 10);
};
const closeModal = () => {
    loginFormContainer.classList.add('scale-95', 'opacity-0');
    loginFormContainer.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        loginModal.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loginForm.reset();
    }, 300);
};
privateModeBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'just' && password === 'fire') {
        showToast('Login Successful! Redirecting...');
        closeModal();
    } else {
        errorMessage.classList.remove('hidden');
        loginFormContainer.classList.add('animate-shake');
        setTimeout(() => {
          loginFormContainer.classList.remove('animate-shake');
        }, 500)
    }
});
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.5s ease-in-out; }
`;
document.head.appendChild(style);
