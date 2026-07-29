// js/systems/classes.js

/**
 * Determina a classe de caçador com base em seus atributos dominantes.
 * @param {Object} attributes - { str, agi, vit, int }
 * @returns {string}
 */
export function determineClass(attributes) {
    const { str, agi, vit, int } = attributes;
    
    // Encontra o maior atributo
    const maxVal = Math.max(str, agi, vit, int);

    if (maxVal === vit) {
        return "MURALHA (TANKER)";
    }
    if (maxVal === str) {
        return "GUERREIRO (FIGHTER)";
    }
    if (maxVal === agi) {
        return "ASSASSINO (ASSASSIN)";
    }
    return "MAGO (MAGE)";
}

/**
 * Retorna uma descrição narrativa de estilo RPG para a classe.
 * @param {string} className 
 * @returns {string}
 */
export function getClassDescription(className) {
    switch (className) {
        case "MURALHA (TANKER)":
            return "Especialista em absorção de danos. Foco total em preservação de articulações e aumento de resistência aeróbica.";
        case "GUERREIRO (FIGHTER)":
            return "Combatente equilibrado que mescla força explosiva com excelente resistência cardiovascular.";
        case "ASSASSINO (ASSASSIN)":
            return "Extremamente ágil e rápido. Seus treinos focam em potência, agilidade e exercícios de alta intensidade (HIIT).";
        case "MAGO (MAGE)":
            return "Controlador de fluxo mental. Foca em flexibilidade, respiração coordenada e treinos mentais (foco e meditação).";
        default:
            return "Classe de Caçador do Sistema.";
    }
}
