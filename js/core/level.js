// js/core/level.js
import { getXPNeededForLevel } from './xp.js';

/**
 * Verifica se o jogador tem XP suficiente para subir de nível.
 * @param {number} currentXP 
 * @param {number} currentLevel 
 * @returns {boolean}
 */
export function checkLevelUp(currentXP, currentLevel) {
    const xpNeeded = getXPNeededForLevel(currentLevel);
    return currentXP >= xpNeeded;
}

/**
 * Processa a subida de nível do jogador, distribuindo pontos de atributos e atualizando o nível/XP.
 * @param {Object} playerState - O estado do jogador a ser modificado.
 * @returns {Object} Um relatório sobre o que mudou: { leveledUp: boolean, levelsGained: number, attributePointsGained: number }
 */
export function processLevelUp(playerState) {
    let leveledUp = false;
    let levelsGained = 0;
    let attributePointsGained = 0;

    // Enquanto o XP atual for maior ou igual ao XP necessário para o nível atual, sobe de nível
    while (checkLevelUp(playerState.xp, playerState.level)) {
        const xpNeeded = getXPNeededForLevel(playerState.level);
        playerState.xp -= xpNeeded;
        playerState.level += 1;
        
        // Cada subida de nível concede 5 pontos de atributo para o jogador distribuir
        playerState.attributePoints += 5;
        attributePointsGained += 5;
        
        leveledUp = true;
        levelsGained += 1;
    }

    // Atualiza o XP necessário para o próximo nível no estado do jogador
    playerState.xpNext = getXPNeededForLevel(playerState.level);

    return {
        leveledUp,
        levelsGained,
        attributePointsGained
    };
}
