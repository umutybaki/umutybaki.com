// Background Canvas Constellation Effect
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const connectionDistance = 150;
const particleCount = 100; // Adjust based on screen size for performance
const particleSpeed = 0.3;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const colorRGB = document.documentElement.getAttribute('data-theme') === 'dark' ? '248, 250, 252' : '15, 23, 42';
        ctx.fillStyle = `rgba(${colorRGB}, 0.4)`;
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => p.update());
    particles.forEach(p => p.draw());

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                // Opacity based on distance
                const opacity = 1 - (distance / connectionDistance);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const colorRGB = document.documentElement.getAttribute('data-theme') === 'dark' ? '248, 250, 252' : '15, 23, 42';
                ctx.strokeStyle = `rgba(${colorRGB}, ${opacity * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Interactivity / Scroll Effects
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 50; // trigger point

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

// Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('scroll', handleScrollReveal);

// Initialization
init();
animate();
// Trigger once on load
handleScrollReveal();

// Language Toggle Logic
const langToggle = document.getElementById('lang-toggle');
const htmlEl = document.documentElement;

if (langToggle) {
    langToggle.addEventListener('click', () => {
        if (htmlEl.getAttribute('lang') === 'en') {
            htmlEl.setAttribute('lang', 'tr');
        } else {
            htmlEl.setAttribute('lang', 'en');
        }

        // Re-trigger reveal animation to ensure nothing breaks on text change
        handleScrollReveal();
    });
}

// Accordion Logic
const accordions = document.querySelectorAll('.accordion');

accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            accordion.classList.toggle('is-open');
            // Re-trigger any scroll reveals just in case the layout significantly shifts
            setTimeout(handleScrollReveal, 450); 
        });
    }
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');

// Check for saved theme preference, otherwise use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
} else if (systemPrefersDark) {
    htmlEl.setAttribute('data-theme', 'dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
