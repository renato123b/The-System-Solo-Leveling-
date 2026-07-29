// js/systems/quests.js

const QUESTS_BY_CLASS = {
    "MURALHA (TANKER)": [
        { id: 1, name: "Flexões de Braços Inclinadas", target: "3 x 10-12 REPS", completed: false },
        { id: 2, name: "Agachamento com Apoio", target: "4 x 12 REPS", completed: false },
        { id: 3, name: "Step Jacks (Sem Impacto)", target: "3 x 45s", completed: false },
        { id: 4, name: "Prancha com Apoio de Joelhos", target: "3 x 30s", completed: false },
        { id: 5, name: "Burpees Caminhados", target: "3 x 8 REPS", completed: false }
    ],
    "GUERREIRO (FIGHTER)": [
        { id: 1, name: "Flexões de Braço Tradicionais", target: "3 x 12 REPS", completed: false },
        { id: 2, name: "Agachamento Livre", target: "4 x 15 REPS", completed: false },
        { id: 3, name: "Passadas Alternadas (Lunges)", target: "3 x 12 reps/lado", completed: false },
        { id: 4, name: "Prancha Abdominal Tradicional", target: "3 x 45s", completed: false },
        { id: 5, name: "Polichinelos Intensos", target: "3 x 60s", completed: false }
    ],
    "ASSASSINO (ASSASSIN)": [
        { id: 1, name: "Flexões Diamante ou Explosivas", target: "3 x 10 REPS", completed: false },
        { id: 2, name: "Agachamento com Salto (Jump Squat)", target: "4 x 12 REPS", completed: false },
        { id: 3, name: "Polichinelos Rápidos", target: "4 x 45s", completed: false },
        { id: 4, name: "Prancha Dinâmica (Tocar Ombros)", target: "3 x 45s", completed: false },
        { id: 5, name: "Burpees Completos", target: "3 x 10 REPS", completed: false }
    ],
    "MAGO (MAGE)": [
        { id: 1, name: "Prancha Abdominal Isométrica", target: "3 x 30s", completed: false },
        { id: 2, name: "Agachamento Estático na Parede", target: "3 x 40s", completed: false },
        { id: 3, name: "Alongamento Corporal Completo", target: "1 x 5 MINS", completed: false },
        { id: 4, name: "Elevação de Panturrilha", target: "3 x 20 REPS", completed: false },
        { id: 5, name: "Respiração Diafragmática Focada", target: "1 x 5 MINS", completed: false }
    ]
};

/**
 * Gera a lista de quests diárias com base na classe do caçador.
 * @param {string} className 
 * @returns {Array}
 */
export function generateQuestsForClass(className) {
    const defaultQuests = QUESTS_BY_CLASS[className] || QUESTS_BY_CLASS["GUERREIRO (FIGHTER)"];
    // Retorna clones dos objetos para evitar compartilhamento de referência
    return defaultQuests.map(q => ({ ...q }));
}

/**
 * Verifica se a data virou e aplica a lógica de reset diário ou ativação de penalidade.
 * Retorna true se houver alguma mudança de estado significativa.
 * @param {Object} state - O estado do sistema
 * @returns {Object} { questsReset: boolean, penaltyTriggered: boolean }
 */
export function checkDailyReset(state) {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Se não há um jogador configurado, não faz nada
    if (!state.player) {
        return { questsReset: false, penaltyTriggered: false };
    }

    // Se é o primeiro dia ou o dia é o mesmo, não há reset a fazer
    if (!state.quests || state.quests.date === todayStr) {
        return { questsReset: false, penaltyTriggered: false };
    }

    let penaltyTriggered = false;
    
    // Se a data virou, verifica se as quests anteriores foram cumpridas
    if (state.quests && state.quests.date !== todayStr) {
        const anyUncompleted = state.quests.list.some(q => !q.completed);
        
        // Se houver alguma quest não completada, ativa a penalidade (Survival Quest)
        if (anyUncompleted && !state.penaltyActive) {
            state.penaltyActive = true;
            penaltyTriggered = true;
        }
    }

    // Gera o novo lote de quests para o novo dia
    state.quests = {
        date: todayStr,
        list: generateQuestsForClass(state.player.className)
    };

    return {
        questsReset: true,
        penaltyTriggered
    };
}
