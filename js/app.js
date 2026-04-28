// Digital Clock
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    document.getElementById('digital-clock').textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// Task Interaction
let completedTasks = 0;
const totalTasks = 5;

function toggleTask(element) {
    const check = element.querySelector('.check-mark');
    const isCompleted = element.getAttribute('data-completed') === 'true';

    if (isCompleted) {
        element.setAttribute('data-completed', 'false');
        element.classList.remove('opacity-50', 'bg-systemCyan/10');
        check.classList.remove('scale-100');
        check.classList.add('scale-0');
        completedTasks--;
    } else {
        element.setAttribute('data-completed', 'true');
        element.classList.add('opacity-50', 'bg-systemCyan/10');
        check.classList.remove('scale-0');
        check.classList.add('scale-100');
        completedTasks++;
        
        // Trigger digital pixel effect simulation (visual only)
        createNotification('TREINO REGISTRADO: +5 XP');
    }

    updateProgress();
}

function updateProgress() {
    const percentage = (completedTasks / totalTasks) * 100;
    document.getElementById('daily-progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${Math.round(percentage)}%`;

    if (percentage === 100) {
        triggerLevelUp();
    }
}

function createNotification(msg) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-panel px-4 py-2 rounded-lg border-l-4 border-systemCyan animate-bounce text-sm font-orbitron text-systemCyan flex items-center space-x-2';
    toast.innerHTML = `<span class="animate-pulse">●</span> <span>${msg}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function triggerLevelUp() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-md';
    overlay.innerHTML = `
        <div class="text-center animate-pulse">
            <h1 class="font-orbitron text-6xl font-black text-white drop-shadow-[0_0_30px_#FFF] mb-4">LEVEL UP</h1>
            <p class="font-orbitron text-systemCyan tracking-[0.5em] text-xl">PARABÉNS, GUERREIRO!</p>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 1s';
        setTimeout(() => overlay.remove(), 1000);
    }, 2500);
}

// Onboarding Simulation
window.addEventListener('load', () => {
    createNotification('CONEXÃO ESTABELECIDA');
    setTimeout(() => createNotification('TREINO PERSONALIZADO GERADO'), 1500);
});

// Add 3D Hover Tilt Effect to main panels
document.querySelectorAll('.glass-panel').forEach(panel => {
    panel.addEventListener('mousemove', e => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 50;
        const rotateY = (centerX - x) / 50;
        
        panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    panel.addEventListener('mouseleave', () => {
        panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
});