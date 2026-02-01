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
                playAudio(); // Optional, avoiding actual audio file dependency for now
            }, 600);
        });
    }

    // --- Theme Toggle (Extra) ---
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (icon.classList.contains('fa-moon')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // --- Initial Confetti Burst for fun ---
    // setTimeout(startConfetti, 1000); 
});

// --- Confetti Engine ---
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return; const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#FF9A9E', '#FECFEF', '#A18CD1', '#FBC2EB', '#FFF'];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
