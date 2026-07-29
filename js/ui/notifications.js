// js/ui/notifications.js

/**
 * Cria e exibe uma notificação flutuante na tela (Toast).
 * @param {string} msg - A mensagem de texto a ser exibida
 * @param {string} type - O tipo do toast: 'info', 'success', 'xp', 'levelup', 'achievement', 'penalty'
 */
export function createNotification(msg, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    
    // Classes de base com glassmorphism
    toast.className = 'glass-panel px-4 py-3 rounded-lg border-l-4 text-sm font-orbitron flex items-center space-x-3 transition-all duration-500 transform translate-x-10 opacity-0 shadow-lg';
    
    // Customização visual de acordo com o tipo
    let borderClass = 'border-systemCyan text-systemCyan';
    let icon = '●';
    let iconClass = 'animate-pulse text-systemCyan';

    switch (type) {
        case 'success':
            borderClass = 'border-green-500 text-green-400';
            icon = '✓';
            iconClass = 'font-bold text-green-400';
            break;
        case 'xp':
            borderClass = 'border-systemBlue text-systemText';
            icon = '✦';
            iconClass = 'text-systemCyan animate-spin';
            break;
        case 'levelup':
            borderClass = 'border-yellow-400 text-yellow-300 font-bold';
            icon = '▲';
            iconClass = 'text-yellow-400 animate-bounce';
            toast.classList.add('shadow-[0_0_15px_rgba(250,204,21,0.4)]');
            break;
        case 'achievement':
            borderClass = 'border-purple-500 text-purple-300 font-bold';
            icon = '★';
            iconClass = 'text-purple-400 animate-pulse';
            toast.classList.add('shadow-[0_0_15px_rgba(168,85,247,0.4)]');
            break;
        case 'penalty':
            borderClass = 'border-red-600 text-red-400 font-black';
            icon = '⚠️';
            iconClass = 'text-red-500 animate-ping';
            toast.classList.add('shadow-[0_0_15px_rgba(220,38,38,0.5)]');
            break;
        case 'info':
        default:
            borderClass = 'border-systemCyan text-systemCyan';
            icon = '●';
            iconClass = 'animate-pulse text-systemCyan';
            break;
    }

    toast.classList.add(...borderClass.split(' '));
    toast.innerHTML = `<span class="${iconClass}">${icon}</span> <span class="tracking-wide">${msg}</span>`;
    
    container.appendChild(toast);

    // Efeito de entrada suave (slide + fade)
    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.classList.remove('translate-x-10', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);
    });

    // Remover após 4.5 segundos
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-20', 'opacity-0');
        
        // Remove do DOM após a animação de saída concluir
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}
