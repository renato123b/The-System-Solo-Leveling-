// js/ui/dashboard.js
import { getAllAchievements } from '../systems/achievements.js';
import { getRankTitle } from '../systems/ranks.js';
import { getClassDescription } from '../systems/classes.js';
import { init3DTilt } from './animations.js';

/**
 * Atualiza todos os elementos visuais do Dashboard com base no estado atual do jogo.
 * @param {Object} state - O estado do sistema
 * @param {Function} onToggleQuest - Evento disparado ao clicar em um exercício
 * @param {Function} onAllocatePoint - Evento disparado ao distribuir atributos
 */
export function renderDashboard(state, onToggleQuest, onAllocatePoint) {
    if (!state.player) {
        // Exibe o painel de onboarding se não houver caçador cadastrado
        document.getElementById('onboarding-form-panel').classList.remove('hidden');
        document.getElementById('onboarding-welcome-panel').classList.add('hidden');
        
        // Zera os valores visuais e desabilita interações
        document.getElementById('player-name-header').textContent = 'BLOQUEADO';
        document.getElementById('player-rank-header').textContent = 'RANK: ? (AWAKENING)';
        document.getElementById('player-level-header').textContent = '--';
        document.getElementById('bmi-value').textContent = '--';
        document.getElementById('bmi-class').textContent = 'Mapeando...';
        document.getElementById('bmi-progress').style.width = '0%';
        document.getElementById('journey-status').textContent = 'Aguardando Despertar';
        document.getElementById('silhouette-label').textContent = 'WIREFRAME_000: AGUARDANDO';
        
        renderEmptyQuests();
        renderAchievements([]);
        togglePenaltyOverlay(false);
        init3DTilt();
        return;
    }

    // Oculta o onboarding se o player já existe
    document.getElementById('onboarding-form-panel').classList.add('hidden');
    document.getElementById('onboarding-welcome-panel').classList.remove('hidden');

    const player = state.player;

    // Atualiza cabeçalho
    document.getElementById('player-name-header').textContent = player.name;
    document.getElementById('player-level-header').textContent = player.level.toString().padStart(2, '0');
    document.getElementById('player-rank-header').textContent = getRankTitle(player.rankName);

    // Atualiza o IMC
    document.getElementById('bmi-value').textContent = player.bmi.toFixed(2);
    
    // Configura a classificação do IMC e status da jornada
    let bmiClassText = '';
    let journeyStatusText = '';
    let bmiPercent = 50; // valor padrão para representação na barra de progresso
    let wireframeLabel = 'WIREFRAME_002: GUERREIRO';

    if (player.bmi > 30) {
        bmiClassText = 'Muralha em Construção';
        journeyStatusText = 'Guerreiro de Armadura Pesada';
        bmiPercent = 85;
        wireframeLabel = 'WIREFRAME_001: MURALHA';
    } else if (player.bmi > 25) {
        bmiClassText = 'Guerreiro da Vanguarda';
        journeyStatusText = 'Combatente de Linha de Frente';
        bmiPercent = 65;
        wireframeLabel = 'WIREFRAME_002: GUERREIRO';
    } else if (player.bmi >= 18.5) {
        bmiClassText = 'Sombra Silenciosa';
        journeyStatusText = 'Assassino Ágil e Furtivo';
        bmiPercent = 45;
        wireframeLabel = 'WIREFRAME_003: ASSASSINO';
    } else {
        bmiClassText = 'Conjurador Mental';
        journeyStatusText = 'Mapeador de Mana Corpóreo';
        bmiPercent = 25;
        wireframeLabel = 'WIREFRAME_004: MAGO';
    }

    document.getElementById('bmi-class').textContent = bmiClassText;
    document.getElementById('bmi-progress').style.width = `${bmiPercent}%`;
    document.getElementById('journey-status').textContent = journeyStatusText;
    document.getElementById('evolution-potential').textContent = `Foco: ${player.className}`;
    document.getElementById('silhouette-label').textContent = wireframeLabel;

    // Atualiza o painel lateral do Wireframe 3D com dados biométricos dinâmicos
    document.getElementById('silhouette-details').innerHTML = `
        DATA_STREAM_AUTH: OK<br>
        BIO_SYNC: 99.4%<br>
        LIMITER_STATUS: ACTIVE<br>
        PESO: ${player.weight} kg<br>
        ALTURA: ${player.height} m
    `;

    // Atualiza atributos e pontos livres
    renderAttributes(player, onAllocatePoint);

    // Renderiza a lista de Quests
    if (state.quests) {
        renderQuests(state.quests.list, onToggleQuest);
    }

    // Renderiza as conquistas
    renderAchievements(state.achievements || []);

    // Exibe ou oculta a tela de Punição
    togglePenaltyOverlay(state.penaltyActive);

    // Reinicia efeito 3D Tilt nos novos painéis gerados
    init3DTilt();
}

/**
 * Renderiza os atributos e controla a exibição dos botões de incremento (+).
 * @param {Object} player 
 * @param {Function} onAllocatePoint 
 */
function renderAttributes(player, onAllocatePoint) {
    const attrs = player.attributes;
    
    // Atualiza valores de texto
    document.getElementById('stat-str').textContent = attrs.str.toString().padStart(2, '0');
    document.getElementById('stat-agi').textContent = attrs.agi.toString().padStart(2, '0');
    document.getElementById('stat-vit').textContent = attrs.vit.toString().padStart(2, '0');
    document.getElementById('stat-int').textContent = attrs.int.toString().padStart(2, '0');

    // Atualiza barras de progresso (limita a representação a uma base de 30 pontos para visualização)
    document.getElementById('stat-progress-str').style.width = `${Math.min((attrs.str / 30) * 100, 100)}%`;
    document.getElementById('stat-progress-agi').style.width = `${Math.min((attrs.agi / 30) * 100, 100)}%`;
    document.getElementById('stat-progress-vit').style.width = `${Math.min((attrs.vit / 30) * 100, 100)}%`;
    document.getElementById('stat-progress-int').style.width = `${Math.min((attrs.int / 30) * 100, 100)}%`;

    // Controla o container de pontos disponíveis
    const pointsContainer = document.getElementById('attribute-points-container');
    const pointsVal = document.getElementById('attribute-points-value');

    const buttons = {
        str: document.getElementById('btn-add-str'),
        agi: document.getElementById('btn-add-agi'),
        vit: document.getElementById('btn-add-vit'),
        int: document.getElementById('btn-add-int')
    };

    if (player.attributePoints > 0) {
        pointsContainer.classList.remove('hidden');
        pointsContainer.classList.add('flex');
        pointsVal.textContent = player.attributePoints;

        // Exibe os botões "+" e associa os eventos de clique
        Object.keys(buttons).forEach(attrKey => {
            const btn = buttons[attrKey];
            btn.classList.remove('hidden');
            // Remove listeners antigos redefinindo o clone
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita re-tilt do clique
                onAllocatePoint(attrKey);
            });
        });
    } else {
        pointsContainer.classList.add('hidden');
        pointsContainer.classList.remove('flex');
        
        // Oculta os botões "+"
        Object.values(buttons).forEach(btn => {
            if (btn) btn.classList.add('hidden');
        });
    }
}

/**
 * Renderiza as quests na div #daily-quests-container.
 * @param {Array} list 
 * @param {Function} onToggleQuest 
 */
function renderQuests(list, onToggleQuest) {
    const container = document.getElementById('daily-quests-container');
    if (!container) return;

    container.innerHTML = '';
    let completedCount = 0;

    list.forEach(quest => {
        if (quest.completed) completedCount++;

        const item = document.createElement('div');
        
        // Estilo condicional de acordo com a conclusão da quest
        if (quest.completed) {
            item.className = 'flex items-center space-x-3 p-3 bg-systemCyan/10 border border-systemCyan/40 rounded-lg opacity-50 cursor-pointer transition-all hover:bg-systemCyan/5';
        } else {
            item.className = 'flex items-center space-x-3 p-3 bg-systemDark/40 border border-systemCyan/20 hover:border-systemCyan/50 transition-colors cursor-pointer group';
        }

        // Checkbox e marcação SVG
        const scaleClass = quest.completed ? 'scale-100' : 'scale-0';
        
        item.innerHTML = `
            <div class="w-6 h-6 border-2 border-systemCyan rounded flex items-center justify-center transition-all group-hover:shadow-[0_0_8px_#00FFFF]">
                <svg class="w-4 h-4 text-systemCyan transition-transform duration-300 check-mark ${scaleClass}" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div class="flex-1">
                <div class="text-sm font-bold text-gray-200 ${quest.completed ? 'line-through' : ''}">${quest.name}</div>
                <div class="text-[10px] text-systemCyan font-mono">${quest.target}</div>
            </div>
        `;

        item.addEventListener('click', () => {
            onToggleQuest(quest.id);
        });

        container.appendChild(item);
    });

    // Atualiza a barra de progresso geral
    const total = list.length || 1;
    const percentage = (completedCount / total) * 100;
    
    document.getElementById('daily-progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${Math.round(percentage)}%`;
}

/**
 * Exibe quests vazias (quando deslogado)
 */
function renderEmptyQuests() {
    const container = document.getElementById('daily-quests-container');
    if (!container) return;

    container.innerHTML = `
        <p class="text-xs text-gray-500 italic text-center py-4">Aguardando despertar do caçador para calibrar treinos...</p>
    `;
    document.getElementById('daily-progress-bar').style.width = `0%`;
    document.getElementById('progress-text').textContent = `0%`;
}

/**
 * Renderiza a lista de Conquistas (Achievements)
 * @param {Array} achievementsList 
 */
function renderAchievements(achievementsList) {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    const all = getAllAchievements();
    container.innerHTML = '';

    all.forEach(ach => {
        const isUnlocked = achievementsList.some(a => a.id === ach.id);
        const card = document.createElement('div');

        if (isUnlocked) {
            card.className = 'p-3 rounded-lg border border-purple-500/40 bg-purple-950/20 text-center flex flex-col items-center justify-center space-y-1 transition-all duration-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] group cursor-default';
            card.innerHTML = `
                <span class="text-purple-400 font-bold text-base group-hover:scale-110 transition-transform">★</span>
                <span class="text-[10px] font-orbitron text-white font-bold leading-tight block">${ach.title}</span>
                <span class="text-[8px] text-purple-300 leading-tight block opacity-80 mt-1">${ach.description}</span>
            `;
        } else {
            card.className = 'p-3 rounded-lg border border-white/5 bg-systemDark/20 text-center flex flex-col items-center justify-center space-y-1 opacity-30 grayscale cursor-not-allowed';
            card.innerHTML = `
                <span class="text-gray-500 font-bold text-base">☆</span>
                <span class="text-[10px] font-orbitron text-gray-400 font-bold leading-tight block">${ach.title}</span>
                <span class="text-[8px] text-gray-500 leading-tight block mt-1">${ach.description}</span>
            `;
        }

        container.appendChild(card);
    });
}

/**
 * Alterna a exibição do overlay de Penalidade.
 * @param {boolean} active 
 */
function togglePenaltyOverlay(active) {
    const overlay = document.getElementById('penalty-overlay');
    if (!overlay) return;
    
    if (active) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}
