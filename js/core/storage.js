// js/core/storage.js

const STORAGE_KEY = 'solo_leveling_system_state';

/**
 * Salva o estado completo do sistema no localStorage.
 * @param {Object} state
 */
export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Erro ao salvar estado no localStorage:', e);
    }
}

/**
 * Carrega o estado do sistema do localStorage.
 * @returns {Object|null}
 */
export function loadState() {
    try {
        const stateStr = localStorage.getItem(STORAGE_KEY);
        return stateStr ? JSON.parse(stateStr) : null;
    } catch (e) {
        console.error('Erro ao ler estado do localStorage:', e);
        return null;
    }
}

/**
 * Limpa todos os dados do localStorage relativos ao sistema.
 */
export function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Erro ao limpar estado do localStorage:', e);
    }
}
