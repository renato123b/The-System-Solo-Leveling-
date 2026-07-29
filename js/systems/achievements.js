// js/systems/achievements.js

const ALL_ACHIEVEMENTS = [
    { id: 'DESPERTAR', title: 'O Despertar', description: 'Criou seu perfil de caçador no Sistema.' },
    { id: 'PRIMEIRO_PASSO', title: 'Primeiro Passo', description: 'Completou seu primeiro exercício diário.' },
    { id: 'MAESTRIA', title: 'Caminho do Poder', description: 'Subiu de nível no Sistema pela primeira vez.' },
    { id: 'SOBREVIVENTE', title: 'Sobrevivente do Deserto', description: 'Completou uma Penalty Quest com sucesso.' },
    { id: 'ILUMINADO', title: 'Evolução Consciente', description: 'Distribuiu seu primeiro ponto de atributo livre.' },
    { id: 'SUPREMO', title: 'Hunter Rank S', description: 'Alcançou a classificação máxima de poder: Rank S.' }
];

/**
 * Retorna a lista de todas as conquistas do sistema.
 * @returns {Array}
 */
export function getAllAchievements() {
    return ALL_ACHIEVEMENTS;
}

/**
 * Verifica e desbloqueia conquistas com base no estado do jogo e evento gerado.
 * @param {Object} state - O estado completo do jogo
 * @param {string} eventType - Tipo do evento: 'onboarding', 'complete_exercise', 'level_up', 'complete_penalty', 'allocate_point', 'rank_s'
 * @returns {Array} Array com as conquistas recém-desbloqueadas (para exibição de Toasts)
 */
export function checkAchievements(state, eventType) {
    if (!state.achievements) {
        state.achievements = [];
    }

    const newlyUnlocked = [];

    const unlock = (id) => {
        // Se a conquista já foi desbloqueada antes, ignora
        if (state.achievements.some(a => a.id === id)) return;

        const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
            const unlockData = {
                ...ach,
                unlockedAt: new Date().toISOString()
            };
            state.achievements.push(unlockData);
            newlyUnlocked.push(unlockData);
        }
    };

    // Lógica condicional de acordo com o evento
    switch (eventType) {
        case 'onboarding':
            unlock('DESPERTAR');
            break;
            
        case 'complete_exercise':
            unlock('PRIMEIRO_PASSO');
            break;

        case 'level_up':
            if (state.player && state.player.level >= 2) {
                unlock('MAESTRIA');
            }
            break;

        case 'complete_penalty':
            unlock('SOBREVIVENTE');
            break;

        case 'allocate_point':
            unlock('ILUMINADO');
            break;
    }

    // Verificação de Rank S (pode ocorrer a qualquer alteração de atributos ou level up)
    if (state.player && state.player.rankName === 'S') {
        unlock('SUPREMO');
    }

    return newlyUnlocked;
}
