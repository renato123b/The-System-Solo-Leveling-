// js/ui/animations.js

/**
 * Adiciona o efeito de inclinação 3D aos painéis glass-panel.
 */
export function init3DTilt() {
    document.querySelectorAll('.glass-panel').forEach(panel => {
        // Remove ouvintes antigos se houverem
        panel.removeEventListener('mousemove', handleMouseMove);
        panel.removeEventListener('mouseleave', handleMouseLeave);

        panel.addEventListener('mousemove', handleMouseMove);
        panel.addEventListener('mouseleave', handleMouseLeave);
    });
}

function handleMouseMove(e) {
    const panel = e.currentTarget;
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleMouseLeave(e) {
    const panel = e.currentTarget;
    panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
}

/**
 * Efeito typewriter de digitação de texto.
 * @param {string} elementId - ID do elemento HTML
 * @param {string} text - Texto a digitar
 * @param {number} speed - Intervalo de tempo entre caracteres (ms)
 * @returns {Promise} Resolvida quando a digitação termina
 */
export function typewriterEffect(elementId, text, speed = 30) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) {
            resolve();
            return;
        }

        element.textContent = "";
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }

        type();
    });
}

/**
 * Cria uma sobreposição holográfica especial para comemorar um Level Up.
 * @param {number} newLevel 
 */
export function triggerLevelUpOverlay(newLevel) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md opacity-0 transition-opacity duration-500';
    overlay.innerHTML = `
        <div class="text-center transform scale-90 transition-transform duration-500">
            <h1 class="font-orbitron text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] mb-2 tracking-wider animate-pulse">LEVEL UP</h1>
            <p class="font-orbitron text-yellow-400 tracking-[0.4em] text-2xl uppercase">Limite de Poder Expandido</p>
            <p class="font-mono text-gray-400 text-sm mt-4">Nível Atual: <span class="text-white text-lg font-bold font-orbitron">${newLevel}</span></p>
            <p class="text-[10px] text-systemCyan/60 font-mono mt-8 uppercase tracking-[0.2em] animate-pulse">Pressione qualquer tecla ou clique para continuar</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Força layout antes de iniciar transições
    requestAnimationFrame(() => {
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
            overlay.querySelector('div').classList.remove('scale-90');
            overlay.querySelector('div').classList.add('scale-100');
        }, 10);
    });

    const closeOverlay = () => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.remove(), 500);
        document.removeEventListener('keydown', closeOverlay);
        overlay.removeEventListener('click', closeOverlay);
    };

    // Permite fechar clicando ou pressionando teclas após 1.5s (para dar tempo de ver o efeito)
    setTimeout(() => {
        document.addEventListener('keydown', closeOverlay);
        overlay.addEventListener('click', closeOverlay);
    }, 1500);
}
