// Main.js - UI Controller for Ground State

let game = null;
let selectedWordCard = null;
let currentDisplayMode = displayModes.ABBREVIATED;

// Drag-and-drop state
let isDragging = false;
let draggedCard = null;
let dragClone = null;
let dragOperationId = 0; // Track unique drag operations
let touchStartX = 0;
let touchStartY = 0;
let currentTouchX = 0;
let currentTouchY = 0;

// Performance monitoring for budget devices (Phase 4)
let lastFrameTime = performance.now();
let frameCount = 0;
let lowPerformanceMode = false;
let isInitialDeal = true; // Track first render for stagger animation
let previousTableauState = []; // Track face-down cards for flip animation
let previousFoundationCounts = {}; // Track sorted counts for snap animation

// PWA Install Prompt (Phase 5)
let deferredInstallPrompt = null;

// Load saved display preference from localStorage
function loadDisplayPreference() {
    const saved = localStorage.getItem('physics_display_mode');
    if (saved && displayModes[saved.toUpperCase()]) {
        currentDisplayMode = displayModes[saved];
    }
}

// Save display preference to localStorage and re-render
function setDisplayMode(mode) {
    currentDisplayMode = mode;
    localStorage.setItem('physics_display_mode', mode);

    // Track display mode change
    if (typeof GameAnalytics !== 'undefined') {
        GameAnalytics.displayModeChanged(mode);
    }

    renderGame(); // Re-render with new mode
}

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
    loadDisplayPreference();
    initializeElements();
    setupEventListeners();
    startNewGame();
    startPerformanceMonitoring(); // Start FPS monitoring (Phase 4)

    // Register service worker for PWA offline support (Phase 5)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    }

    // Capture PWA install prompt event (Phase 5)
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default mini-infobar
        e.preventDefault();

        // Save prompt for later
        deferredInstallPrompt = e;

        // Track prompt shown
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.installPromptShown();
        }

        console.log('PWA install prompt available');
    });
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

    // Drag-and-drop touch event listeners
    elements.gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
    elements.gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
    elements.gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Check FPS and enable low-performance mode if needed (Phase 4)
let performanceMonitoringActive = false;

function startPerformanceMonitoring() {
    if (!performanceMonitoringActive) {
        performanceMonitoringActive = true;
        frameCount = 0;
        lastFrameTime = performance.now();
        requestAnimationFrame(checkPerformance);
    }
}

function stopPerformanceMonitoring() {
    performanceMonitoringActive = false;
}

function checkPerformance() {
    if (!performanceMonitoringActive) return;

    frameCount++;
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (frameCount >= 180) { // Check every 180 frames (3 seconds @ 60fps) - P1 fix
        const fps = (frameCount / elapsed) * 1000;

        if (fps < 30 && !lowPerformanceMode) {
            lowPerformanceMode = true;
            document.body.classList.add('low-performance-mode');
            console.log('Low performance mode enabled (FPS:', Math.round(fps), ')');
            showFeedback('Animations reduced for smoother gameplay', 'info');
            // Stop monitoring after detection
            stopPerformanceMonitoring();
            return;
        }

        frameCount = 0;
        lastFrameTime = now;
    }

    requestAnimationFrame(checkPerformance);
}

// Pause monitoring when tab hidden (battery optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopPerformanceMonitoring();
    } else if (game && !lowPerformanceMode) {
        startPerformanceMonitoring();
    }
});

// Helper function to announce messages to screen readers (Phase 4 - WCAG compliance)
function announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('screen-reader-announcements');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcements';
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.textContent = message;
}

// Helper to add animation class with automatic cleanup (Phase 4 - memory leak fix)
function addAnimationClass(element, className, cleanup = () => {}) {
    if (!element) return;

    element.classList.add(className);

    const handler = () => {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
            cleanup();
        }
    };

    // Listen for animationend
    element.addEventListener('animationend', handler, { once: true });

    // Fallback timeout for disabled animations (low-performance mode, prefers-reduced-motion)
    setTimeout(() => {
        if (element.classList.contains(className)) {
            element.removeEventListener('animationend', handler);
            element.classList.remove(className);
            cleanup();
        }
    }, 700); // Increased from 600ms to 700ms (shake = 500ms max)
}

// Drag-and-drop: Touch start handler
function handleTouchStart(e) {
  // Only drag word cards that are playable
  const cardEl = e.target.closest('.card.word.playable');
  if (!cardEl) return;

  // Prevent default to avoid scrolling while dragging
  e.preventDefault();

  // Get touch coordinates
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  currentTouchX = touch.clientX;
  currentTouchY = touch.clientY;

  // Store reference to dragged card
  draggedCard = cardEl;

  // Trigger haptic feedback
  triggerHaptic('light');
}

// Drag-and-drop: Touch move handler
function handleTouchMove(e) {
  if (!draggedCard) return;

  e.preventDefault();

  const touch = e.touches[0];
  currentTouchX = touch.clientX;
  currentTouchY = touch.clientY;

  // Calculate distance moved
  const deltaX = Math.abs(currentTouchX - touchStartX);
  const deltaY = Math.abs(currentTouchY - touchStartY);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Start drag if moved > 10px (prevents accidental drags on taps)
  if (!isDragging && distance > 10) {
    isDragging = true;

    // Create floating clone (shallow to avoid copying event listeners)
    dragClone = draggedCard.cloneNode(false); // Shallow clone
    dragClone.innerHTML = draggedCard.innerHTML; // Copy visual content only
    dragClone.classList.add('dragging-clone');
    dragClone.style.position = 'fixed';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '1000';
    dragClone.style.width = draggedCard.offsetWidth + 'px';
    dragClone.style.height = draggedCard.offsetHeight + 'px';
    document.body.appendChild(dragClone);

    // Add dragging class to original
    draggedCard.classList.add('dragging');
  }

  // Update clone position to follow finger
  if (isDragging && dragClone) {
    dragClone.style.left = (currentTouchX - dragClone.offsetWidth / 2) + 'px';
    dragClone.style.top = (currentTouchY - dragClone.offsetHeight / 2) + 'px';
  }
}

// Drag-and-drop: Touch end handler
function handleTouchEnd(e) {
  if (!isDragging) {
    // If not dragging, treat as tap (existing tap behavior)
    draggedCard = null;
    return;
  }

  e.preventDefault();

  let foundationTarget = null;

  // Check collision with foundation slots
  const foundations = document.querySelectorAll('.foundation-slot');
  foundations.forEach(foundation => {
    const rect = foundation.getBoundingClientRect();
    if (currentTouchX >= rect.left && currentTouchX <= rect.right &&
        currentTouchY >= rect.top && currentTouchY <= rect.bottom) {
      foundationTarget = foundation;
    }
  });

  if (foundationTarget && draggedCard) {
    const categoryId = foundationTarget.dataset.categoryId;
    const cardId = draggedCard.dataset.cardId;

    try {
      const result = game.sortWord(cardId, categoryId);

      if (result.success) {
        const fullWord = draggedCard.dataset.fullWord || cardId;
        triggerHaptic('success');
        showFeedback(result.message, 'success');
        announceToScreenReader(`Success! ${fullWord} sorted correctly`, 'polite');

        // Track successful word sort
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.wordSorted(true, categoryId);
        }

        // Color feedback for visual learners
        if (dragClone) {
          dragClone.style.background = 'var(--success)';
          dragClone.style.color = 'white';
          addAnimationClass(dragClone, 'sorted-correct');
        }
      } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
        announceToScreenReader(`Error: ${result.message}`, 'assertive');

        // Track wrong guess
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.wordSorted(false, categoryId);
        }

        // Color feedback for visual learners
        if (dragClone) {
          dragClone.style.background = 'var(--danger)';
          dragClone.style.color = 'white';
          addAnimationClass(dragClone, 'sorted-wrong');
        }
      }
      renderGame();
    } catch (err) {
      console.error('Drag-drop sort failed:', err);
      triggerHaptic('error');
      showFeedback('Sort operation failed', 'error');
    }
  } else {
    // Snap back animation for invalid drop
    if (dragClone) {
      dragClone.classList.add('snap-back');
      triggerHaptic('light');
    }
  }

  // Cleanup with race condition protection
  const currentOperationId = ++dragOperationId;
  const cloneToCleanup = dragClone;
  const cardToCleanup = draggedCard;

  setTimeout(() => {
    if (cloneToCleanup) {
      cloneToCleanup.remove();
    }
    if (cardToCleanup) {
      cardToCleanup.classList.remove('dragging');
    }
    // Only reset global state if no new drag started
    if (dragOperationId === currentOperationId) {
      isDragging = false;
      draggedCard = null;
      dragClone = null;
    }
  }, 300); // Increased from 200ms to 300ms to accommodate longer animations
}

function startNewGame(level = 1) {
    game = new PhysicsAssociations();
    game.initLevel(level);
    isInitialDeal = true; // Reset for stagger animation (Phase 4)
    previousFoundationCounts = {}; // Reset foundation tracking

    // Track level start
    if (typeof GameAnalytics !== 'undefined') {
        GameAnalytics.levelStarted(level);
    }

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
                <span class="placeholder-label">Category</span>
            </div>
        `;
        return;
    }

    placedCategories.forEach(catId => {
        const foundation = foundations[catId];
        const category = foundation.category;

        // Calculate progress: sorted words / total words in deck for this category
        const sortedCount = foundation.words.length;
        const totalCount = game.countWordsForCategory(catId);

        const foundationEl = document.createElement('div');
        foundationEl.className = 'foundation-stack foundation-slot'; // Add foundation-slot for drag-and-drop
        foundationEl.dataset.categoryId = catId; // Add data attribute for drag-and-drop

        // Build pile visualization with empty slots
        let pileHTML = '';
        const previousCount = previousFoundationCounts[catId] || 0;
        const justAddedIndex = previousCount < sortedCount ? sortedCount - 1 : -1;

        for (let i = 0; i < totalCount; i++) {
            if (i < sortedCount) {
                const isJustAdded = i === justAddedIndex ? ' just-added' : '';
                pileHTML += `<div class="pile-slot filled${isJustAdded}"></div>`;
            } else {
                pileHTML += '<div class="pile-slot empty"></div>';
            }
        }

        // Update tracking
        previousFoundationCounts[catId] = sortedCount;

        foundationEl.innerHTML = `
            <div class="foundation-header">
                <div class="foundation-icon">${category.icon}</div>
                <div class="foundation-name">${category.name}</div>
                <div class="foundation-count">${sortedCount}/${totalCount}</div>
            </div>
            <div class="pile-slots">
                ${pileHTML}
            </div>
        `;

        elements.foundationsArea.appendChild(foundationEl);
    });
}

function renderTableau(tableau, playableCards) {
    elements.gameBoard.innerHTML = '';

    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'tableau-columns';

    // Build tableau state tracking for flip animation
    const tableauState = [];

    tableau.forEach((column, colIndex) => {
        const columnEl = document.createElement('div');
        columnEl.className = 'tableau-column';
        const columnState = [];

        // Handle empty column with ghost placeholder
        if (column.length === 0) {
            const emptyPlaceholder = document.createElement('div');
            emptyPlaceholder.className = 'tableau-column-empty';
            emptyPlaceholder.innerHTML = '<div class="empty-slot-outline"></div>';
            columnEl.appendChild(emptyPlaceholder);
        } else {
            // Render cards in column
            column.forEach((card, cardIndex) => {
                // Determine if card is covered (middle cards in stack)
                const isTopCard = cardIndex === column.length - 1;
                const isBottomCard = cardIndex === 0;

                const cardEl = createCardElement(card);

                // Track card state
                columnState.push({ id: card.id, faceUp: card.faceUp });

                if ((isTopCard || isBottomCard) && card.faceUp) {
                    cardEl.classList.add('playable');
                    cardEl.addEventListener('click', () => handleCardClick(card));
                } else {
                    // Middle cards: no playable class, no event handlers
                    cardEl.classList.remove('playable');
                }

                columnEl.appendChild(cardEl);
            });
        }

        tableauState.push(columnState);
        columnsContainer.appendChild(columnEl);
    });

    elements.gameBoard.appendChild(columnsContainer);

    // Detect newly revealed cards and add flip animation
    const currentFaceUpCards = tableauState.map(pile => pile.filter(c => c.faceUp).map(c => c.id)).flat();
    const previousFaceUpCards = previousTableauState.map(pile => pile.filter(c => c.faceUp).map(c => c.id)).flat();
    const newlyRevealedCards = currentFaceUpCards.filter(id => !previousFaceUpCards.includes(id));

    newlyRevealedCards.forEach(cardId => {
        const cardEl = document.querySelector(`.card[data-card-id="${cardId}"]`);
        if (cardEl) {
            addAnimationClass(cardEl, 'flipping');
            const fullWord = cardEl.dataset.fullWord || 'card';
            announceToScreenReader(`${fullWord} revealed`, 'polite');
        }
    });

    // Add stagger animation on initial deal
    if (isInitialDeal) {
        const allCards = columnsContainer.querySelectorAll('.card');
        allCards.forEach((cardEl, index) => {
            cardEl.style.animationDelay = `${index * 0.02}s`; // Changed from 0.05s to 0.02s (20ms)
            addAnimationClass(cardEl, 'dealing', () => {
                cardEl.style.animationDelay = '';
            });
        });
        isInitialDeal = false;
    }

    // Update previous state for next render
    previousTableauState = tableauState;
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

        // Two-zone layout: header index (top 15%) + body (bottom 85%)
        // Index is ALWAYS visible when stacked, body gets covered
        const displayText = getCardDisplayText(card.word, currentDisplayMode);

        cardEl.innerHTML = `
            <div class="card-header-index">
                <span class="index-text">${displayText}</span>
            </div>
            <div class="card-body">
                <div class="body-text">${displayText}</div>
                <div class="card-points">${card.points}</div>
            </div>
        `;

        // Add data attribute for full word (for tooltips/sorting feedback)
        cardEl.dataset.fullWord = card.word;
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
        // Show full word in feedback, not abbreviation
        const fullWord = selectedWordCard.word;
        showFeedback(`"${fullWord}" sorted!`, 'success');
        renderGame();
    } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error'); // Already has full word from game logic
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
    stopPerformanceMonitoring(); // Pause FPS monitoring when menu open
    const state = game.getGameState();

    elements.modalTitle.textContent = 'Settings & Menu';
    elements.modalBody.innerHTML = `
        <div class="menu-tabs">
            <button class="tab-btn active" onclick="showMenuTab('game')">Game</button>
            <button class="tab-btn" onclick="showMenuTab('settings')">Settings</button>
        </div>

        <!-- Game tab (existing content) -->
        <div id="game-tab" class="tab-content">
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
            <a href="about.html" class="btn-stock" style="margin-top: 8px; background: var(--primary); text-align: center; text-decoration: none; display: block;">
                About Ground State
            </a>
        </div>

        <!-- Settings tab (new) -->
        <div id="settings-tab" class="tab-content hidden">
            <h3>Display Settings</h3>

            <div class="setting-group">
                <label class="setting-label">Card Display Mode</label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="display-mode" value="abbreviated" checked>
                        <span class="radio-label">
                            <strong>Abbreviated</strong>
                            <small>Uses physics notation (p, λ, F)</small>
                        </span>
                    </label>

                    <label class="radio-option disabled" title="Coming soon!">
                        <input type="radio" name="display-mode" value="icon_label" disabled>
                        <span class="radio-label">
                            <strong>Icon + Label</strong>
                            <small>Visual icons with text (Coming Soon)</small>
                            <span class="badge">v2.0</span>
                        </span>
                    </label>
                </div>
            </div>

            <div class="setting-info">
                <p><strong>ℹ️ About Abbreviations:</strong></p>
                <p>This game uses standard physics notation. For example:</p>
                <ul>
                    <li><strong>p</strong> = momentum</li>
                    <li><strong>λ</strong> = wavelength</li>
                    <li><strong>F</strong> = force</li>
                </ul>
                <p>Tap any card to see the full word.</p>
            </div>
        </div>
    `;

    // Setup radio button listener
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (!e.target.disabled) {
                setDisplayMode(displayModes[e.target.value.toUpperCase()]);
            }
        });
    });

    showModal();
}

function showMenuTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`${tab}-tab`).classList.remove('hidden');
    event.target.classList.add('active');
}

function confirmNewGame() {
    if (confirm('Start a new game? Current progress will be lost.')) {
        closeModal();
        startNewGame(game.level);
    }
}

function showGameOverModal(won, state) {
    elements.modalTitle.textContent = won ? '🎉 Level Complete!' : '😔 Out of Moves';

    // Track level completion/failure (Phase 5)
    if (typeof GameAnalytics !== 'undefined') {
        if (won) {
            const movesTaken = (game.maxMoves || 30) - state.movesRemaining;
            GameAnalytics.levelCompleted(state.level, state.score, movesTaken);
        } else {
            const reason = state.movesRemaining === 0 ? 'out-of-moves' : 'no-valid-moves';
            GameAnalytics.levelFailed(state.level, reason);
        }
    }

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
    // Resume FPS monitoring
    if (game && !lowPerformanceMode) {
        startPerformanceMonitoring();
    }
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
window.showMenuTab = showMenuTab;

// PWA Install Functions (Phase 5)

// Detect if running as installed PWA
function isInstalledPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

// Prompt user to install PWA
async function promptInstall() {
    if (!deferredInstallPrompt) {
        console.log('Install prompt not available');
        return;
    }

    // Show install prompt
    deferredInstallPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredInstallPrompt.userChoice;

    if (outcome === 'accepted') {
        console.log('User installed PWA');

        // Track installation
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.installCompleted();
        }
    } else {
        console.log('User declined PWA installation');
    }

    // Clear prompt
    deferredInstallPrompt = null;
}

// Track if launched from home screen
if (isInstalledPWA() && typeof GameAnalytics !== 'undefined') {
    trackGameEvent('app-launched-from-homescreen');
}
