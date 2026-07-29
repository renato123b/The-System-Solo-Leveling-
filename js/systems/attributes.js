// js/systems/attributes.js

/**
 * Calcula os atributos iniciais do caçador com base no seu Índice de Massa Corporal (IMC).
 * @param {number} bmi - Índice de Massa Corporal
 * @returns {Object} { str, agi, vit, int }
 */
export function calculateBaseAttributes(bmi) {
    // Valores padrão
    const stats = { str: 10, agi: 10, vit: 10, int: 10 };

    if (bmi > 30) {
        // Perfil: Muralha (Muito peso/sobrepeso - necessita de alto vigor e força)
        stats.str = 14;
        stats.vit = 16;
        stats.agi = 7;
        stats.int = 10;
    } else if (bmi > 25) {
        // Perfil: Guerreiro (Leve sobrepeso - equilibrado com boa força muscular)
        stats.str = 12;
        stats.vit = 12;
        stats.agi = 10;
        stats.int = 10;
    } else if (bmi >= 18.5) {
        // Perfil: Assassino (Peso ideal - alta agilidade)
        stats.str = 10;
        stats.vit = 10;
        stats.agi = 15;
        stats.int = 10;
    } else {
        // Perfil: Mago (Abaixo do peso - alta inteligência/foco)
        stats.str = 8;
        stats.vit = 8;
        stats.agi = 12;
        stats.int = 16;
    }

    return stats;
}

/**
 * Retorna as descrições em português do Brasil sobre a utilidade de cada atributo no sistema.
 * @param {string} key - 'str', 'agi', 'vit' ou 'int'
 * @returns {string}
 */
export function getAttributeDescription(key) {
    const descriptions = {
        str: "FORÇA (STR): Aumenta o poder de impacto, a estabilidade e a força muscular pura.",
        agi: "AGILIDADE (AGI): Aumenta os reflexos, a velocidade de reação e a flexibilidade articular.",
        vit: "VIGOR (VIT): Melhora a capacidade cardio-respiratória, a resistência à fadiga e regeneração muscular.",
        int: "INTELECTO (INT): Aprimora o foco mental, a concentração profunda e a eficiência respiratória."
    };
    return descriptions[key] || "Atributo desconhecido.";
}
