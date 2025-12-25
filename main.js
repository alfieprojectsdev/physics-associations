// Main.js - UI Controller for Physics Associations

let game = null;
let selectedWordCard = null;

const elements = {
    level: null,
    score: null,
    movesRemaining: null,
    foundationsArea: null,
    gameBoard: null,
    wasteSlot: null,
    stockCount: null,
    drawBtn: null,
    hintBtn: null,
    menuBtn: null,
    modal: null,
    modalOverlay: null,
    modalTitle: null,
    modalBody: null,
    modalClose: null,
    categorySelector: null,
    categoryOptions: null,
    cancelSort: null
};

document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    startNewGame();
});

function initializeElements() {
    elements.level = document.getElementById('level');
    elements.score = document.getElementById('score');
    elements.movesRemaining = document.getElementById('moves-remaining');
    elements.foundationsArea = document.querySelector('.foundations-scroll');
    elements.gameBoard = document.getElementById('game-board');
    elements.wasteSlot = document.getElementById('waste-slot');
    elements.stockCount = document.getElementById('stock-count');
    elements.drawBtn = document.getElementById('draw-btn');
    elements.hintBtn = document.getElementById('hint-btn');
    elements.menuBtn = document.getElementById('menu-btn');
    elements.modal = document.getElementById('modal');
    elements.modalOverlay = document.getElementById('modal-overlay');
    elements.modalTitle = document.getElementById('modal-title');
    elements.modalBody = document.getElementById('modal-body');
    elements.modalClose = document.getElementById('modal-close');
    elements.categorySelector = document.getElementById('category-selector');
    elements.categoryOptions = document.getElementById('category-options');
    elements.cancelSort = document.getElementById('cancel-sort');
}

function setupEventListeners() {
    elements.drawBtn.addEventListener('click', handleDrawCard);
    elements.hintBtn.addEventListener('click', handleShowHint);
    elements.menuBtn.addEventListener('click', handleShowMenu);
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    elements.cancelSort.addEventListener('click', hideCategorySelector);
}

function startNewGame(level = 1) {
    game = new PhysicsAssociations();
    game.initLevel(level);
    renderGame();
}

function renderGame() {
    const state = game.getGameState();
    
    // Update header
    elements.level.textContent = state.level;
    elements.score.textContent = state.score;
    elements.movesRemaining.textContent = state.movesRemaining;
    elements.stockCount.textContent = state.stockCount;
    
    // Update moves color based on urgency
    if (state.movesRemaining <= 5) {
        elements.movesRemaining.style.color = 'var(--danger)';
    } else if (state.movesRemaining <= 10) {
        elements.movesRemaining.style.color = 'var(--warning)';
    } else {
        elements.movesRemaining.style.color = 'var(--primary)';
    }
    
    renderFoundations(state.foundations, state.placedCategories);
    renderTableau(state.tableau, state.playableCards);
    renderWaste(state.waste);
    
    elements.drawBtn.disabled = state.stockCount === 0;
    
    // Check game end
    if (state.gameState === 'won') {
        showGameOverModal(true, state);
    } else if (state.gameState === 'lost') {
        showGameOverModal(false, state);
    }
}

function renderFoundations(foundations, placedCategories) {
    elements.foundationsArea.innerHTML = '';
    
    if (placedCategories.length === 0) {
        elements.foundationsArea.innerHTML = `
            <div class="foundation-placeholder">
                <div class="placeholder-text">Place Category Cards Here</div>
                <div class="placeholder-icon">📚</div>
            </div>
        `;
        return;
    }
    
    placedCategories.forEach(catId => {
        const foundation = foundations[catId];
        const category = foundation.category;
        
        const foundationEl = document.createElement('div');
        foundationEl.className = 'foundation-stack';
        foundationEl.innerHTML = `
            <div class="foundation-header">
                <div class="foundation-icon">${category.icon}</div>
                <div class="foundation-name">${category.name}</div>
                <div class="foundation-description">${category.description}</div>
            </div>
            <div class="foundation-words" id="foundation-${catId}">
                ${foundation.words.map(word => `
                    <div class="word-chip">${word.word} (+${word.points})</div>
                `).join('')}
            </div>
        `;
        
        elements.foundationsArea.appendChild(foundationEl);
    });
}

function renderTableau(tableau, playableCards) {
    elements.gameBoard.innerHTML = '';
    
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'tableau-columns';
    
    tableau.forEach((column, colIndex) => {
        const columnEl = document.createElement('div');
        columnEl.className = 'tableau-column';
        
        column.forEach((card, cardIndex) => {
            const cardEl = createCardElement(card);
            
            // Check if playable
            const isPlayable = playableCards.some(pc => pc.id === card.id);
            if (isPlayable) {
                cardEl.classList.add('playable');
                cardEl.addEventListener('click', () => handleCardClick(card));
            }
            
            columnEl.appendChild(cardEl);
        });
        
        columnsContainer.appendChild(columnEl);
    });
    
    elements.gameBoard.appendChild(columnsContainer);
}

function renderWaste(waste) {
    elements.wasteSlot.innerHTML = '';
    
    if (!waste) {
        elements.wasteSlot.innerHTML = '<div class="empty-slot">Empty</div>';
        return;
    }
    
    const cardEl = createCardElement(waste);
    cardEl.classList.add('playable');
    cardEl.addEventListener('click', () => handleCardClick(waste));
    elements.wasteSlot.appendChild(cardEl);
}

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.cardId = card.id;
    
    if (!card.faceUp) {
        cardEl.classList.add('face-down');
        return cardEl;
    }
    
    if (card.type === 'category') {
        cardEl.classList.add('category');
        cardEl.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <div class="card-title">${card.name}</div>
        `;
    } else if (card.type === 'word') {
        cardEl.classList.add('word');
        cardEl.innerHTML = `
            <div class="card-title">${card.word}</div>
            <div class="card-points">${card.points}</div>
        `;
    }
    
    return cardEl;
}

function handleCardClick(card) {
    // Haptic feedback for supported devices
    triggerHaptic('light');
    
    if (card.type === 'category') {
        handleCategoryClick(card);
    } else if (card.type === 'word') {
        handleWordClick(card);
    }
}

function handleCategoryClick(card) {
    const result = game.placeCategory(card.id);
    
    if (result.success) {
        triggerHaptic('medium');
        showFeedback(result.message, 'success');
        renderGame();
    } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
    }
}

function handleWordClick(card) {
    const state = game.getGameState();
    
    if (state.placedCategories.length === 0) {
        triggerHaptic('error');
        showFeedback('Place a category card first!', 'error');
        return;
    }
    
    if (state.placedCategories.length === 1) {
        // Only one category, auto-sort
        const result = game.sortWord(card.id, state.placedCategories[0]);
        handleSortResult(result);
    } else {
        // Multiple categories, show selector
        selectedWordCard = card;
        showCategorySelector(state.placedCategories);
    }
}

/**
 * Trigger haptic feedback on supported devices
 * @param {string} type - 'light', 'medium', 'heavy', 'error', 'success'
 */
function triggerHaptic(type = 'light') {
    // Check if device supports haptic feedback
    if (!('vibrate' in navigator)) return;
    
    const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        error: [10, 50, 10],
        success: [10, 30, 10, 30]
    };
    
    try {
        navigator.vibrate(patterns[type] || 10);
    } catch (e) {
        // Haptics not supported, fail silently
    }
}

function showCategorySelector(placedCategories) {
    elements.categoryOptions.innerHTML = '';
    
    placedCategories.forEach(catId => {
        const category = PhysicsCategories.find(c => c.id === catId);
        const btn = document.createElement('button');
        btn.className = 'category-option';
        btn.innerHTML = `${category.icon}<br>${category.name}`;
        btn.addEventListener('click', () => {
            const result = game.sortWord(selectedWordCard.id, catId);
            handleSortResult(result);
            hideCategorySelector();
        });
        elements.categoryOptions.appendChild(btn);
    });
    
    elements.categorySelector.classList.remove('hidden');
}

function hideCategorySelector() {
    elements.categorySelector.classList.add('hidden');
    selectedWordCard = null;
}

function handleSortResult(result) {
    if (result.success) {
        triggerHaptic('success');
        showFeedback(result.message, 'success');
        renderGame();
    } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
        renderGame(); // Still render to show move count decrease
    }
}

function handleDrawCard() {
    triggerHaptic('light');
    const result = game.drawFromStock();
    
    if (result.success) {
        triggerHaptic('medium');
        showFeedback(result.message, 'info');
        renderGame();
    } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
    }
}

function handleShowHint() {
    const hint = game.getHint();
    
    const priorityColors = {
        high: 'var(--success)',
        medium: 'var(--warning)',
        low: 'var(--text-light)'
    };
    
    const priorityLabels = {
        high: '⚡ High Priority',
        medium: '⚠️ Medium Priority',
        low: '💭 Consider This'
    };
    
    elements.modalTitle.textContent = '💡 Strategic Hint';
    elements.modalBody.innerHTML = `
        <div style="background: ${priorityColors[hint.priority || 'medium']}; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 4px;">
                ${priorityLabels[hint.priority || 'medium']}
            </div>
            <div style="font-size: 1.125rem; font-weight: bold;">
                ${hint.message}
            </div>
        </div>
        
        ${hint.type === 'category' ? `
            <div style="margin-bottom: 12px; padding: 12px; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 4px;">
                    Source: ${hint.source === 'tableau' ? '📊 Tableau (reveals hidden cards)' : '🎴 Drawn card'}
                </div>
                <div style="font-size: 0.875rem;">
                    This will unlock words for sorting in this category.
                </div>
            </div>
        ` : ''}
        
        ${hint.type === 'word' ? `
            <div style="margin-bottom: 12px; padding: 12px; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 4px;">
                    ${hint.card.source === 'tableau' ? '✓ Tableau card - will reveal more cards!' : 'Drawn card'}
                </div>
                <div style="font-size: 0.875rem;">
                    Category: <strong>${hint.targetCategory.name} ${hint.targetCategory.icon}</strong>
                </div>
            </div>
        ` : ''}
        
        ${hint.missing && hint.missing.length > 0 ? `
            <div style="background: #fef3c7; padding: 12px; border-radius: 8px; border-left: 4px solid var(--warning);">
                <strong>📋 Missing Categories:</strong>
                <ul style="margin-top: 8px; padding-left: 20px; font-size: 0.875rem;">
                    ${hint.missing.map(m => `
                        <li>${m.name} (${m.wordCount} words waiting)</li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div style="margin-top: 16px; padding: 10px; background: #e0f2fe; border-radius: 8px; font-size: 0.75rem; color: var(--text-dark);">
            <strong>💡 Remember:</strong> Prioritize tableau moves to reveal hidden cards. Only draw from stock when no board moves exist.
        </div>
        
        <button class="btn-stock" onclick="closeModal()" style="margin-top: 16px;">
            Got it!
        </button>
    `;
    
    showModal();
}

function handleShowMenu() {
    const state = game.getGameState();
    
    elements.modalTitle.textContent = 'Menu';
    elements.modalBody.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h3 style="margin-bottom: 8px;">How to Play</h3>
            <ol style="font-size: 0.875rem; line-height: 1.6; padding-left: 20px;">
                <li><strong>Place categories first</strong> - You can't sort words until their category is on a foundation</li>
                <li><strong>Sort words to categories</strong> - Tap a word, then select which category it belongs to</li>
                <li><strong>Reveal hidden cards</strong> - Sorting from tableau columns flips face-down cards</li>
                <li><strong>Draw strategically</strong> - Only draw from stock when no tableau moves exist</li>
                <li><strong>Watch your moves!</strong> - Every action costs 1 move. Wrong categories = wasted move</li>
            </ol>
        </div>
        
        <div style="margin-bottom: 16px; background: #fef3c7; padding: 12px; border-radius: 8px; border-left: 4px solid var(--warning);">
            <h3 style="margin-bottom: 8px; color: var(--warning);">⚡ Strategy Tips</h3>
            <ul style="font-size: 0.875rem; line-height: 1.6; padding-left: 20px;">
                <li><strong>Analyze first</strong> - Check all face-up cards before placing categories</li>
                <li><strong>Prioritize tableau</strong> - Sort from columns to reveal more cards (avoid drawing unnecessarily)</li>
                <li><strong>Think ahead</strong> - Ensure word truly belongs to category before tapping</li>
                <li><strong>Manage the stock</strong> - Drawing uses a move; use board cards first</li>
            </ul>
        </div>
        
        <div style="margin-bottom: 16px;">
            <h3 style="margin-bottom: 8px;">Current Progress</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-light);">Level</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${state.level}</div>
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-light);">Score</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${state.score}</div>
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-light);">Moves Left</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${state.movesRemaining <= 5 ? 'var(--danger)' : 'var(--primary)'};">${state.movesRemaining}</div>
                </div>
                <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-light);">Categories</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${state.placedCategories.length}</div>
                </div>
            </div>
        </div>
        <button class="btn-stock" onclick="confirmNewGame()" style="margin-top: 8px; background: var(--danger);">
            Restart Level
        </button>
    `;
    
    showModal();
}

function confirmNewGame() {
    if (confirm('Start a new game? Current progress will be lost.')) {
        closeModal();
        startNewGame(game.level);
    }
}

function showGameOverModal(won, state) {
    elements.modalTitle.textContent = won ? '🎉 Level Complete!' : '😔 Out of Moves';
    elements.modalBody.innerHTML = `
        <p style="font-size: 1.125rem; margin-bottom: 16px;">
            ${won 
                ? 'Excellent work! All words sorted correctly!' 
                : 'You ran out of moves. Try again!'}
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
            <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                <div style="font-size: 0.875rem; color: var(--text-light);">Final Score</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">${state.score}</div>
            </div>
            <div style="background: var(--bg-light); padding: 12px; border-radius: 8px; text-align: center;">
                <div style="font-size: 0.875rem; color: var(--text-light);">Moves Left</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">${state.movesRemaining}</div>
            </div>
        </div>
        ${won ? `
            <button class="btn-stock" onclick="nextLevel()" style="margin-top: 8px;">
                Next Level →
            </button>
        ` : ''}
        <button class="btn-stock" onclick="retryLevel()" style="margin-top: 8px; background: var(--warning);">
            ${won ? 'Replay Level' : 'Try Again'}
        </button>
    `;
    
    showModal();
}

function nextLevel() {
    closeModal();
    startNewGame(game.level + 1);
}

function retryLevel() {
    closeModal();
    startNewGame(game.level);
}

function showModal() {
    elements.modal.classList.remove('hidden');
}

function closeModal() {
    elements.modal.classList.add('hidden');
}

function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.3s';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Make functions globally accessible
window.closeModal = closeModal;
window.confirmNewGame = confirmNewGame;
window.nextLevel = nextLevel;
window.retryLevel = retryLevel;
