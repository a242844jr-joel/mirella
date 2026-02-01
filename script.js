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

    // --- Quiz Logic ---
    const questions = [
        {
            q: "¿Cuál es mi color favorito?",
            options: ["Azul", "Rojo", "Verde", "Negro"],
            correct: 1 // Index of correct answer
        },
        {
            q: "¿Qué comida no puedo resistir?",
            options: ["Pizza", "Sushi", "Hamburguesa", "Tacos"],
            correct: 0
        },
        {
            q: "¿Dónde nos conocimos?",
            options: ["En el colegio", "En una fiesta", "Por internet", "En el trabajo"],
            correct: 0
        },
        {
            q: "¿Cuál es mi mayor sueño?",
            options: ["Viajar por el mundo", "Ser millonario", "Tener un perro", "Ser feliz contigo"],
            correct: 3
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let isAnswering = false;

    const quizCard = document.getElementById('quiz-card');
    const questionText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const quizScore = document.getElementById('quiz-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const finalMessage = document.getElementById('final-message');

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showScore();
            return;
        }

        const currentQ = questions[currentQuestionIndex];
        questionText.textContent = currentQ.q;
        optionsGrid.innerHTML = '';

        currentQ.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(index, btn);
            optionsGrid.appendChild(btn);
        });
    }

    function handleAnswer(selectedIndex, btnElement) {
        if (isAnswering) return;
        isAnswering = true;

        const correctIndex = questions[currentQuestionIndex].correct;

        if (selectedIndex === correctIndex) {
            btnElement.classList.add('correct');
            score++;
            playConfettiShort();
        } else {
            btnElement.classList.add('wrong');
            // Highlight correct one
            optionsGrid.children[correctIndex].classList.add('correct');
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
            isAnswering = false;
        }, 1200);
    }

    function showScore() {
        quizCard.style.display = 'none';
        quizScore.style.display = 'block';
        finalScoreDisplay.textContent = `${score}/${questions.length}`;

        if (score === questions.length) {
            finalMessage.textContent = "¡Increíble! Me conoces mejor que nadie. 💖";
            startConfetti();
        } else if (score >= questions.length / 2) {
            finalMessage.textContent = "¡Nada mal! Pero aún tienes secretos por descubrir. 😉";
        } else {
            finalMessage.textContent = "¿Seguro que somos amigos? ¡Es broma! Inténtalo de nuevo. 😂";
        }
    }

    window.restartQuiz = function () {
        currentQuestionIndex = 0;
        score = 0;
        quizCard.style.display = 'block';
        quizScore.style.display = 'none';
        loadQuestion();
    };

    // Initialize Quiz if elements exist
    if (questionText) loadQuestion();


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
