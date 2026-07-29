// js/app.js
import { loadState, saveState } from './core/storage.js';
import { createPlayer, allocateAttributePoint, updatePlayerBiometrics } from './core/player.js';
import { processLevelUp } from './core/level.js';
import { getXPAward } from './core/xp.js';
import { checkDailyReset, generateQuestsForClass } from './systems/quests.js';
import { checkAchievements } from './systems/achievements.js';
import { completePenalty, getPenaltyQuestDetails } from './systems/penalties.js';
import { renderDashboard } from './ui/dashboard.js';
import { createNotification } from './ui/notifications.js';
import { init3DTilt, typewriterEffect, triggerLevelUpOverlay } from './ui/animations.js';

// Estado global do aplicativo
let state = {
    player: null,
    quests: null,
    achievements: [],
    penaltyActive: false
};

// Controle de atualização de biometria
let isUpdatingBiometrics = false;

// Inicialização do Relógio Digital
function initClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
        const clockEl = document.getElementById('digital-clock');
        if (clockEl) clockEl.textContent = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();
}

// Configura os ouvintes do formulário de Onboarding
function initOnboardingForm() {
    const form = document.getElementById('onboarding-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('input-name');
        const weightInput = document.getElementById('input-weight');
        const heightInput = document.getElementById('input-height');

        const name = nameInput.value;
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        if (isUpdatingBiometrics) {
            // Lógica de atualização de biometria
            updatePlayerBiometrics(state.player, weight, height);
            
            // Recalcula o progresso de quests baseado na nova classe se aplicável
            // Para não quebrar o dia atual, geramos novas quests apenas se o biotipo/classe mudar
            const oldClass = state.player.className;
            state.player.className = createPlayer(name, weight, height).className;
            
            if (oldClass !== state.player.className) {
                state.quests.list = generateQuestsForClass(state.player.className);
                createNotification(`CLASSE ATUALIZADA: ${state.player.className}`, 'info');
            }

            isUpdatingBiometrics = false;
            createNotification('BIOMETRIA ATUALIZADA COM SUCESSO', 'success');
        } else {
            // Criação de novo jogador
            state.player = createPlayer(name, weight, height);
            state.quests = {
                date: new Date().toISOString().split('T')[0],
                list: generateQuestsForClass(state.player.className)
            };
            
            // Verifica conquistas (O Despertar)
            const newlyUnlocked = checkAchievements(state, 'onboarding');
            saveState(state);

            // Mensagem de boas-vindas do despertar
            triggerWelcomeMessage();

            createNotification('CONEXÃO ESTABELECIDA COM O SISTEMA', 'success');
            createNotification(`JORNADA INICIADA COMO ${state.player.className}`, 'info');
            
            // Exibe Toasts para conquistas desbloqueadas
            newlyUnlocked.forEach(ach => {
                createNotification(`CONQUISTA DESBLOQUEADA: ${ach.title}`, 'achievement');
            });
        }

        saveState(state);
        render();
        form.reset();
    });
}

// Configura o botão de atualização de biometria
function initUpdateBiometricsBtn() {
    const btn = document.getElementById('btn-update-biometrics');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!state.player) return;

        const formPanel = document.getElementById('onboarding-form-panel');
        const isHidden = formPanel.classList.contains('hidden');

        if (isHidden) {
            // Preenche o formulário com os dados atuais do jogador
            document.getElementById('input-name').value = state.player.name;
            document.getElementById('input-name').disabled = true; // Não deixa mudar o nome na atualização
            document.getElementById('input-weight').value = state.player.weight;
            document.getElementById('input-height').value = state.player.height;
            
            // Altera botão de submit
            formPanel.querySelector('button[type="submit"]').textContent = 'Atualizar Biometria';
            formPanel.querySelector('h3').textContent = 'Atualizar Mapeamento';
            formPanel.querySelector('p').textContent = 'Ajuste seus dados para recalibrar o IMC e sua classe do Sistema.';

            formPanel.classList.remove('hidden');
            isUpdatingBiometrics = true;
            
            // Faz scroll suave até o painel do formulário
            formPanel.scrollIntoView({ behavior: 'smooth' });
        } else {
            formPanel.classList.add('hidden');
            isUpdatingBiometrics = false;
        }
    });
}

// Configura o botão de sobrevivência/penalidade
function initPenaltyBtn() {
    const btn = document.getElementById('btn-complete-penalty');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const newlyUnlocked = completePenalty(state);
        
        // Gera novos treinos para o dia de sobrevivência
        state.quests = {
            date: new Date().toISOString().split('T')[0],
            list: generateQuestsForClass(state.player.className)
        };

        saveState(state);
        createNotification('PENALIDADE SUPERADA. RETORNANDO AO SISTEMA.', 'success');
        
        newlyUnlocked.forEach(ach => {
            createNotification(`CONQUISTA DESBLOQUEADA: ${ach.title}`, 'achievement');
        });

        render();
        triggerWelcomeMessage();
    });
}

// Lógica de cliques em tarefas da Daily Quest
function handleToggleQuest(questId) {
    if (state.penaltyActive) {
        createNotification('SISTEMA BLOQUEADO: COMPLETE A PENALIDADE PRIMEIRO', 'penalty');
        return;
    }

    const quest = state.quests.list.find(q => q.id === questId);
    if (!quest) return;

    quest.completed = !quest.completed;

    if (quest.completed) {
        // Ganha XP individual
        const xpGain = getXPAward('quest_item');
        state.player.xp += xpGain;
        createNotification(`TREINO REGISTRADO: +${xpGain} XP`, 'xp');

        // Verifica conquista de primeiro passo
        const newlyUnlocked = checkAchievements(state, 'complete_exercise');
        newlyUnlocked.forEach(ach => {
            createNotification(`CONQUISTA DESBLOQUEADA: ${ach.title}`, 'achievement');
        });

        // Verifica se completou todas as quests
        const allCompleted = state.quests.list.every(q => q.completed);
        if (allCompleted) {
            const bonusXP = getXPAward('daily_quest_complete');
            state.player.xp += bonusXP;
            createNotification(`DAILY QUEST COMPLETA! +${bonusXP} XP BÔNUS`, 'success');
        }
    } else {
        // Reduz o XP correspondente caso desmarque a quest
        const xpLoss = getXPAward('quest_item');
        state.player.xp = Math.max(0, state.player.xp - xpLoss);
        createNotification(`TREINO REMOVIDO: -${xpLoss} XP`, 'info');
        
        // Se a Daily Quest estava completa e agora não está, remove o bônus
        const wasAllCompleted = state.quests.list.every((q, idx) => q.id === questId ? !q.completed : q.completed);
        if (wasAllCompleted) {
            const bonusXP = getXPAward('daily_quest_complete');
            state.player.xp = Math.max(0, state.player.xp - bonusXP);
        }
    }

    // Verifica e processa Level Up
    const levelReport = processLevelUp(state.player);
    if (levelReport.leveledUp) {
        createNotification(`LEVEL UP ALCANÇADO: NÍVEL ${state.player.level}!`, 'levelup');
        triggerLevelUpOverlay(state.player.level);
        
        const newlyUnlocked = checkAchievements(state, 'level_up');
        newlyUnlocked.forEach(ach => {
            createNotification(`CONQUISTA DESBLOQUEADA: ${ach.title}`, 'achievement');
        });
    }

    saveState(state);
    render();
}

// Lógica de distribuição de pontos de atributos
function handleAllocatePoint(attributeKey) {
    if (allocateAttributePoint(state.player, attributeKey)) {
        createNotification(`ATRIBUTO AUMENTADO COM SUCESSO`, 'success');
        
        // Verifica conquistas relacionadas a pontos (Iluminado) ou Rank S (Supremo)
        const newlyUnlocked = checkAchievements(state, 'allocate_point');
        newlyUnlocked.forEach(ach => {
            createNotification(`CONQUISTA DESBLOQUEADA: ${ach.title}`, 'achievement');
        });

        saveState(state);
        render();
    }
}

// Dispara o texto dinâmico de boas-vindas do sistema
function triggerWelcomeMessage() {
    let msg = "";
    if (!state.player) {
        msg = "[ALERTA: Caçador não registrado. Por favor, insira seus dados biométricos para inicializar a conexão do Sistema com seu corpo.]";
    } else if (state.penaltyActive) {
        const details = getPenaltyQuestDetails();
        msg = `[ALERTA CRÍTICO: FALHA DE CONEXÃO. Você ativou o protocolo de punição. Destino atual: Zona de Penalidade. Diretriz: ${details.requirement}.]`;
    } else {
        msg = `[Saudações, Caçador ${state.player.name}. O Sistema está estabilizado. Seus status foram carregados com sucesso no Rank ${state.player.rankName}. Prossiga para o treino diário de ${state.player.className} e expanda seus limites!]`;
    }
    typewriterEffect('typewriter', msg, 20);
}

// Renderiza a interface do Dashboard
function render() {
    renderDashboard(state, handleToggleQuest, handleAllocatePoint);
}

// Função de Inicialização Geral
function init() {
    initClock();
    
    // Carrega o estado salvo ou define o padrão
    const saved = loadState();
    if (saved) {
        state = saved;
    }

    // Executa a verificação de reset diário / penalidade
    const resetReport = checkDailyReset(state);
    
    if (resetReport.questsReset) {
        if (resetReport.penaltyTriggered) {
            createNotification('AVISO DO SISTEMA: VOCÊ FALHOU EM COMPLETAR O TREINO A TEMPO!', 'penalty');
        } else {
            createNotification('NOVO DIA RECONHECIDO. TREINO DIÁRIO RECALIBRADO.', 'success');
        }
        saveState(state);
    }

    // Inicializa os formulários e botões
    initOnboardingForm();
    initUpdateBiometricsBtn();
    initPenaltyBtn();

    // Renderiza a tela inicial
    render();

    // Dispara a mensagem dinâmica
    triggerWelcomeMessage();

    // Log de conexão no console
    console.log('Solo Leveling System: Conexão Estabelecida com Sucesso.');
}

// Inicializa o sistema ao carregar a página
window.addEventListener('load', init);