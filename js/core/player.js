// js/core/player.js
import { calculateBaseAttributes } from '../systems/attributes.js';
import { determineRank } from '../systems/ranks.js';
import { determineClass } from '../systems/classes.js';
import { getXPNeededForLevel } from './xp.js';

/**
 * Cria um novo caçador com base em seu nome e dados biométricos.
 * @param {string} name 
 * @param {number} weight - em kg
 * @param {number} height - em metros (ex: 1.75)
 * @returns {Object}
 */
export function createPlayer(name, weight, height) {
    // Tratamento de altura em cm
    const h = height > 3 ? height / 100 : height;
    const bmi = weight / (h * h);
    
    // Atributos base calculados com base no IMC
    const baseAttrs = calculateBaseAttributes(bmi);
    
    // Determinação de Rank e Classe iniciais
    const className = determineClass(baseAttrs);
    const rankName = determineRank(baseAttrs);

    return {
        name: name.trim() || 'Desconhecido',
        weight: parseFloat(weight),
        height: parseFloat(h),
        bmi: parseFloat(bmi.toFixed(2)),
        level: 1,
        xp: 0,
        xpNext: getXPNeededForLevel(1),
        attributes: { ...baseAttrs },
        attributePoints: 0,
        className,
        rankName,
        createdDate: new Date().toISOString().split('T')[0]
    };
}

/**
 * Distribui um ponto de atributo livre para o atributo especificado.
 * @param {Object} playerState 
 * @param {string} attribute - 'str', 'agi', 'vit' ou 'int'
 * @returns {boolean} Se a distribuição foi realizada com sucesso
 */
export function allocateAttributePoint(playerState, attribute) {
    if (playerState.attributePoints > 0 && playerState.attributes.hasOwnProperty(attribute)) {
        playerState.attributes[attribute] += 1;
        playerState.attributePoints -= 1;
        
        // Após alterar atributos, o rank do caçador pode ser reavaliado
        playerState.rankName = determineRank(playerState.attributes);
        playerState.className = determineClass(playerState.attributes);
        
        return true;
    }
    return false;
}

/**
 * Atualiza os dados biométricos do jogador, o que pode alterar seu IMC e recalcular levemente os atributos base.
 * @param {Object} playerState 
 * @param {number} weight 
 * @param {number} height 
 */
export function updatePlayerBiometrics(playerState, weight, height) {
    const h = height > 3 ? height / 100 : height;
    playerState.weight = parseFloat(weight);
    playerState.height = parseFloat(h);
    playerState.bmi = parseFloat((weight / (h * h)).toFixed(2));
    
    // Nota: Os atributos em si não são resetados totalmente para não perder os pontos que o jogador distribuiu,
    // mas a classe pode ser reavaliada se o biotipo mudar drasticamente.
    playerState.className = determineClass(playerState.attributes);
}
