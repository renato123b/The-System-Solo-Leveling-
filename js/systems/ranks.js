// js/systems/ranks.js

/**
 * Determina o Rank do caçador com base na soma atual de seus atributos.
 * Permite que o jogador evolua de Rank à medida que sobe de nível e treina.
 * Ranks: E, D, C, B, A, S
 * @param {Object} attributes - { str, agi, vit, int }
 * @returns {string}
 */
export function determineRank(attributes) {
    const sum = attributes.str + attributes.agi + attributes.vit + attributes.int;

    if (sum < 50) {
        return "E";
    } else if (sum < 70) {
        return "D";
    } else if (sum < 90) {
        return "C";
    } else if (sum < 110) {
        return "B";
    } else if (sum < 130) {
        return "A";
    } else {
        return "S";
    }
}

/**
 * Retorna o título descritivo do Rank.
 * @param {string} rank - 'E', 'D', 'C', 'B', 'A' ou 'S'
 * @returns {string}
 */
export function getRankTitle(rank) {
    const titles = {
        "E": "RANK: E (AWAKENING)",
        "D": "RANK: D (HUNTER DE ELITE INFANTIL)",
        "C": "RANK: C (CAÇADOR INTERMEDIÁRIO)",
        "B": "RANK: B (GUILD VANGUARD)",
        "A": "RANK: A (HERÓI REGIONAL)",
        "S": "RANK: S (CAÇADOR NÍVEL NAÇÃO)"
    };
    return titles[rank] || "RANK: E (AWAKENING)";
}
