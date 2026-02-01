document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    window.navTo = function (targetId) {
        // Find corresponding nav item
        const targetNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (targetNav) activateNav(targetNav);

        // Switch page
        pages.forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active');
    };

    function activateNav(activeItem) {
        navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            activateNav(item);
            window.navTo(target);
        });
    });

    // --- Garden Logic ---
    const gardenContainer = document.getElementById('garden-container');
    const gardenHint = document.querySelector('.garden-hint');

    if (gardenContainer) {
        gardenContainer.addEventListener('click', (e) => {
            // Hide hint on first click
            if (gardenHint.style.opacity !== '0') {
                gardenHint.style.opacity = '0';
            }

            createRose(e.clientX, e.clientY);
        });

        // Touch support for mobile (to prevent double firing if both exist, usually click covers it but touchstart is faster)
        // Simple click is enough for now as it maps to tap.
    }

    function createRose(x, y) {
        const rose = document.createElement('div');
        rose.classList.add('rose');

        // Random slight rotation for variety
        const randomRotation = Math.random() * 360;
        rose.style.setProperty('--r', `${randomRotation}deg`);

        // Position centering
        rose.style.left = `${x}px`;
        rose.style.top = `${y}px`;

        gardenContainer.appendChild(rose);

        // Optional: Play soft vibration if supported
        if (navigator.vibrate) navigator.vibrate(5);

        // Limit number of roses to keep performance high
        if (gardenContainer.children.length > 50) {
            // Remove the second child (first is likely the hint or old rose)
            // Strategy: Remove the oldest rose. 
            // Child 0 is hint? Check class.
            const roses = gardenContainer.querySelectorAll('.rose');
            if (roses.length > 50) {
                roses[0].remove();
            }
        }
    }


    // --- Gift Box Interaction ---
    const giftBox = document.getElementById('gift-box');
    const messageContainer = document.getElementById('message-container');
    let isOpened = false;

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            if (isOpened) return;
            isOpened = true;

            // Animate Box
            giftBox.classList.add('open');

            // Show Message after delay
            setTimeout(() => {
                messageContainer.classList.remove('hidden');
                startConfetti();
            }, 600);
        });
    }
});

// --- Confetti Engine ---
function startConfetti() {
    launchConfetti(200);
}

function playConfettiShort() {
    launchConfetti(50);
}

function launchConfetti(amount) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#FF1E1E', '#FFFFFF', '#FF0000', '#333333']; // Red, White, Dark

    for (let i = 0; i < amount; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activePieces = 0;

        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 2;

            if (p.y < canvas.height) activePieces++;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (activePieces > 0) requestAnimationFrame(animate);
    }

    animate();
}
