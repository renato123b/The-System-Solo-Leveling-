// js/systems/penalties.js
import { checkAchievements } from './achievements.js';

/**
 * Retorna os detalhes da Penalty Quest ativa.
 * @returns {Object}
 */
export function getPenaltyQuestDetails() {
    return {
        title: "PUNIÇÃO: SURVIVAL QUEST",
        description: "Falha na Daily Quest. O jogador foi transportado para a Zona de Penalidade. Sobreviva executando a punição física antes que o tempo se esgote.",
        requirement: "FAÇA 100 AGACHAMENTOS (SQUATS)"
    };
}

/**
 * Conclui a penalidade, retornando o jogador para o dashboard normal.
 * @param {Object} state - O estado completo do jogo
 * @returns {Array} Conquistas recém-desbloqueadas
 */
export function completePenalty(state) {
    if (state.penaltyActive) {
        state.penaltyActive = false;
        
        // Verifica conquistas desbloqueadas (Ex: Sobrevivente do Deserto)
        return checkAchievements(state, 'complete_penalty');
    }
    return [];
}
