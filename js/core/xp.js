// js/core/xp.js

/**
 * Retorna a quantidade de XP necessária para o jogador passar do nível atual para o próximo.
 * Curva de XP: 100 * level
 * @param {number} level
 * @returns {number}
 */
export function getXPNeededForLevel(level) {
    if (level < 1) return 100;
    return level * 100;
}

/**
 * Retorna a quantidade de XP ganha com base na ação executada.
 * @param {string} actionType - 'quest_item' ou 'daily_quest_complete'
 * @returns {number}
 */
export function getXPAward(actionType) {
    switch (actionType) {
        case 'quest_item':
            return 10; // XP por cada exercício individual concluído
        case 'daily_quest_complete':
            return 50; // Bônus de XP ao completar todo o treino do dia
        default:
            return 0;
    }
}
