// Main.js - UI Controller for Ground State

let game = null;
let currentDisplayMode = displayModes.ABBREVIATED;

// Helper: Get coordinates from either touch or mouse event
function getEventCoordinates(e) {
    if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

// Drag-and-drop state
let isDragging = false;
let draggedCard = null;
let dragClone = null;
let dragOperationId = 0; // Track unique drag operations
let touchStartX = 0;
let touchStartY = 0;
let currentTouchX = 0;
let currentTouchY = 0;
let dragOffsetX = 0;
let dragOffsetY = 0;

// 3D Card Effect state
let cardRotationX = 0;
let cardRotationY = 0;
const MAX_ROTATION = 12; // Maximum rotation angle in degrees

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
    careerBtn: null,
    domainBtn: null,
    domainIcon: null,
    modal: null,
    modalOverlay: null,
    modalTitle: null,
    modalBody: null,
    modalClose: null,
    careerModal: null,
    careerModalBody: null
};

document.addEventListener('DOMContentLoaded', () => {
    loadDisplayPreference();
    initializeElements();
    setupEventListeners();
    updateDomainIcon(); // Set initial domain icon
    startNewGame();
    startPerformanceMonitoring(); // Start FPS monitoring (Phase 4)
    document.body.classList.add('flowers-not-loaded');
    checkBirthdayEasterEgg();

    // Initialize progression manager
    window.progressionManager = new ProgressionManager();

    // Register service worker for PWA offline support (Phase 5)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch((error) => {
                console.error('ServiceWorker registration failed:', error);
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
    elements.domainBtn = document.getElementById('domain-btn');
    elements.domainIcon = document.getElementById('domain-icon');
    elements.careerBtn = document.getElementById('career-btn');
    elements.modal = document.getElementById('modal');
    elements.modalOverlay = document.getElementById('modal-overlay');
    elements.modalTitle = document.getElementById('modal-title');
    elements.modalBody = document.getElementById('modal-body');
    elements.modalClose = document.getElementById('modal-close');
    elements.careerModal = document.getElementById('career-modal');
    elements.careerModalTitle = document.getElementById('career-modal-title');
    elements.careerModalBody = document.getElementById('career-modal-body');
    elements.careerModalClose = document.getElementById('career-modal-close');
}

function setupEventListeners() {
    elements.drawBtn.addEventListener('click', handleDrawCard);
    elements.hintBtn.addEventListener('click', handleShowHint);
    elements.menuBtn.addEventListener('click', handleShowMenu);
    elements.domainBtn.addEventListener('click', handleShowDomainSelector);
    elements.careerBtn.addEventListener('click', handleShowCareerRoadmap);
    elements.modalClose.addEventListener('click', closeModal);
    elements.careerModalClose.addEventListener('click', () => {
        document.getElementById('career-modal').classList.add('hidden');
    });
    elements.modalOverlay.addEventListener('click', closeModal);

    // Drag-and-drop touch event listeners
    elements.gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
    elements.gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
    elements.gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events (desktop/touchpad support)
    elements.gameBoard.addEventListener('mousedown', handleTouchStart);
    elements.gameBoard.addEventListener('mousemove', handleTouchMove);
    elements.gameBoard.addEventListener('mouseup', handleTouchEnd);

    // Waste pile drag support (required - wasteSlot is outside gameBoard DOM tree)
    // wasteSlot is in controls-area, NOT inside game-board - events do NOT bubble to gameBoard
    elements.wasteSlot.addEventListener('touchstart', handleTouchStart, { passive: false });
    elements.wasteSlot.addEventListener('touchmove', handleTouchMove, { passive: false });
    elements.wasteSlot.addEventListener('touchend', handleTouchEnd, { passive: false });
    elements.wasteSlot.addEventListener('mousedown', handleTouchStart);
    elements.wasteSlot.addEventListener('mousemove', handleTouchMove);
    elements.wasteSlot.addEventListener('mouseup', handleTouchEnd);

    // Card hover feedback (event delegation to prevent memory leaks)
    const containers = [elements.gameBoard, elements.wasteSlot, elements.foundationsArea];

    containers.forEach(container => {
        if (!container) return; // Skip null containers

        container.addEventListener('mouseenter', (e) => {
            const cardEl = e.target.closest('.card');
            if (!cardEl || !cardEl.dataset.cardType) return;

            if (cardEl.dataset.cardType === 'category') {
                const icon = cardEl.dataset.categoryIcon || '';
                const name = cardEl.dataset.categoryName || '';
                showFeedback(`${icon} ${name}`, 'info');
            } else if (cardEl.dataset.cardType === 'word') {
                const word = cardEl.dataset.word || '';
                const categoryId = cardEl.dataset.categoryId;
                const domainData = getCurrentDomainData();
                if (!domainData) return;
                const cat = domainData.categories.find(c => c.id === categoryId);
                const categoryName = cat ? cat.name : '';
                showFeedback(categoryName ? `${word} (${categoryName})` : word, 'info');
            }
        }, true); // Use capture phase for efficiency

        container.addEventListener('mouseleave', (e) => {
            const cardEl = e.target.closest('.card');
            if (!cardEl) return;

            const feltMsg = document.getElementById('felt-message');
            if (feltMsg) {
                feltMsg.classList.remove('active');
            }
        }, true);

        container.addEventListener('touchstart', (e) => {
            const cardEl = e.target.closest('.card');
            if (!cardEl || !cardEl.dataset.cardType) return;

            if (cardEl.dataset.cardType === 'category') {
                const icon = cardEl.dataset.categoryIcon || '';
                const name = cardEl.dataset.categoryName || '';
                showFeedback(`${icon} ${name}`, 'info');
            } else if (cardEl.dataset.cardType === 'word') {
                const word = cardEl.dataset.word || '';
                const categoryId = cardEl.dataset.categoryId;
                const domainData = getCurrentDomainData();
                if (!domainData) return;
                const cat = domainData.categories.find(c => c.id === categoryId);
                const categoryName = cat ? cat.name : '';
                showFeedback(categoryName ? `${word} (${categoryName})` : word, 'info');
            }
        }, { passive: true, capture: true });
    });
}

function updateDomainIcon() {
    const domainData = getCurrentDomainData();
    if (elements.domainIcon && domainData) {
        elements.domainIcon.textContent = domainData.icon;
        // Add dynamic aria-label
        const btn = elements.domainBtn;
        if (btn) {
            btn.setAttribute('aria-label', `Change domain. Current: ${domainData.name}`);
        }
    }
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

// ===== 3D CARD EFFECTS =====

/**
 * Calculate 3D rotation based on touch position relative to card center
 * @param {number} touchX - Current touch X coordinate
 * @param {number} touchY - Current touch Y coordinate
 * @param {DOMRect} cardRect - Card's bounding rectangle
 * @returns {{rotateX: number, rotateY: number, shadowIntensity: string}}
 */
function calculate3DRotation(touchX, touchY, cardRect) {
    // Get touch position relative to card center
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const offsetX = touchX - cardCenterX;
    const offsetY = touchY - cardCenterY;

    // Calculate rotation angles (inverse for natural feel)
    // Negative Y offset (finger above center) → tilt back (negative rotateX)
    const rotateX = -(offsetY / cardRect.height) * MAX_ROTATION;
    // Positive X offset (finger right of center) → tilt right (positive rotateY)
    const rotateY = (offsetX / cardRect.width) * MAX_ROTATION;

    // Calculate shadow intensity based on total rotation magnitude
    const rotationMagnitude = Math.sqrt(rotateX * rotateX + rotateY * rotateY);
    let shadowIntensity = 'light';
    if (rotationMagnitude > 15) {
        shadowIntensity = 'heavy';
    } else if (rotationMagnitude > 8) {
        shadowIntensity = 'medium';
    }

    return { rotateX, rotateY, shadowIntensity };
}

/**
 * Apply 3D transform to card element
 * @param {HTMLElement} element - Card element to transform
 * @param {number} rotateX - Rotation around X axis (degrees)
 * @param {number} rotateY - Rotation around Y axis (degrees)
 */
function apply3DTransform(element, rotateX, rotateY) {
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Drag-and-drop: Touch start handler
function handleTouchStart(e) {
  // Only drag word cards that are playable
  const cardEl = e.target.closest('.card.word.playable');
  if (!cardEl) return;

  // Prevent default to avoid scrolling while dragging
  e.preventDefault();

  const coords = getEventCoordinates(e);
  touchStartX = coords.x;
  touchStartY = coords.y;
  currentTouchX = coords.x;
  currentTouchY = coords.y;

  const cardRect = cardEl.getBoundingClientRect();
  dragOffsetX = touchStartX - cardRect.left;
  dragOffsetY = touchStartY - cardRect.top;

  // Store reference to dragged card
  draggedCard = cardEl;

  // Trigger haptic feedback
  triggerHaptic('light');
}

// Drag-and-drop: Touch move handler
function handleTouchMove(e) {
  if (!draggedCard) return;

  // Get coordinates (works with both touch and mouse)
  const coords = getEventCoordinates(e);
  currentTouchX = coords.x;
  currentTouchY = coords.y;

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
    dragClone.classList.add('dragging-clone', 'card-dragging');
    dragClone.style.position = 'fixed';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '1000';
    dragClone.style.width = draggedCard.offsetWidth + 'px';
    dragClone.style.height = draggedCard.offsetHeight + 'px';
    document.body.appendChild(dragClone);

    // Add dragging class to original
    draggedCard.classList.add('dragging');

    // Enhanced haptic feedback for drag start
    triggerHaptic('light');
  }

  // Prevent scrolling only when actively dragging
  if (isDragging) {
    e.preventDefault();
  }

  // Update clone position and 3D rotation to follow finger
  if (isDragging && dragClone) {
    const cloneX = currentTouchX - dragOffsetX;
    const cloneY = currentTouchY - dragOffsetY;

    dragClone.style.left = cloneX + 'px';
    dragClone.style.top = cloneY + 'px';

    // Calculate and apply 3D rotation based on touch position
    const cardRect = dragClone.getBoundingClientRect();
    const { rotateX, rotateY, shadowIntensity } = calculate3DRotation(
      currentTouchX,
      currentTouchY,
      cardRect
    );

    // Update global rotation state
    cardRotationX = rotateX;
    cardRotationY = rotateY;

    // Apply 3D transform
    apply3DTransform(dragClone, rotateX, rotateY);

    // Update shadow intensity class
    dragClone.classList.remove('shadow-light', 'shadow-medium', 'shadow-heavy');
    dragClone.classList.add(`shadow-${shadowIntensity}`);

    // Update column visual feedback
    updateColumnHighlights();
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
  let columnTarget = null;

  // Check collision with foundation slots
  const foundations = document.querySelectorAll('.foundation-slot');
  foundations.forEach(foundation => {
    const rect = foundation.getBoundingClientRect();
    if (currentTouchX >= rect.left && currentTouchX <= rect.right &&
        currentTouchY >= rect.top && currentTouchY <= rect.bottom) {
      foundationTarget = foundation;
    }
  });

  // Column detection (only if no foundation hit)
  if (!foundationTarget) {
    const columns = document.querySelectorAll('.tableau-column');
    columns.forEach((column, colIndex) => {
      if (columnTarget) return; // Already found target - prevent overwrite
      const rect = column.getBoundingClientRect();
      if (currentTouchX >= rect.left && currentTouchX <= rect.right &&
          currentTouchY >= rect.top && currentTouchY <= rect.bottom) {
        columnTarget = { element: column, index: colIndex };
      }
    });
  }

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

        // Color feedback for visual learners + spring animation
        if (dragClone) {
          dragClone.classList.add('card-returning');
          // Reset rotation with spring easing
          apply3DTransform(dragClone, 0, 0);
          dragClone.style.background = 'var(--success)';
          dragClone.style.color = 'white';
          addAnimationClass(dragClone, 'sorted-correct');

          // Add spring bounce for success
          setTimeout(() => {
            if (dragClone && dragClone.parentNode) {
              dragClone.classList.add('card-snap');
            }
          }, 100);
        }
      } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
        announceToScreenReader(`Error: ${result.message}`, 'assertive');

        // Track wrong guess
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.wordSorted(false, categoryId);
        }

        // Color feedback for visual learners + spring return
        if (dragClone) {
          dragClone.classList.add('card-returning');
          // Reset rotation with spring easing
          apply3DTransform(dragClone, 0, 0);
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
  } else if (columnTarget && draggedCard) {
    // Handle column drop
    handleColumnDrop(draggedCard, columnTarget.index);
  } else {
    // Snap back animation for invalid drop with spring easing
    if (dragClone) {
      dragClone.classList.add('snap-back', 'card-returning');
      // Reset rotation smoothly
      apply3DTransform(dragClone, 0, 0);
      triggerHaptic('light');
    }
  }

  // Remove all column highlights
  document.querySelectorAll('.tableau-column').forEach(col => {
    col.classList.remove('drag-over', 'drag-valid', 'drag-invalid');
  });

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

/**
 * Handle dropping a card onto a tableau column
 * @param {HTMLElement} draggedCard - The card being dragged
 * @param {number} targetColIndex - Index of target column
 */
function handleColumnDrop(draggedCard, targetColIndex) {
    const sourceCard = game.getPlayableCards().find(c => c.id === draggedCard.dataset.cardId);

    if (!sourceCard) {
        console.error('Card not found in playable cards:', draggedCard.dataset.cardId);
        triggerHaptic('error');
        showFeedback('Invalid card - please try again', 'error');
        return;
    }

    if (sourceCard.source !== 'tableau') {
        triggerHaptic('error');
        showFeedback('Can only move tableau cards between columns', 'error');
        return;
    }

    const result = game.moveBetweenColumns(sourceCard.colIndex, targetColIndex);

    if (result.success) {
        const cardWord = draggedCard.dataset.fullWord || 'card';
        triggerHaptic('success');
        showFeedback(result.message, 'success');
        announceToScreenReader(`${cardWord} moved to another column`, 'polite');

        // Track column reorganization event
        if (typeof GameAnalytics !== 'undefined') {
            GameAnalytics.trackGameEvent('column-reorganization', {
                level: game.level,
                movesRemaining: game.movesRemaining
            });
        }

        // Visual feedback - spring animation
        if (dragClone) {
            dragClone.classList.add('card-returning');
            apply3DTransform(dragClone, 0, 0);
            dragClone.style.background = 'var(--primary)';
            dragClone.style.color = 'white';
            addAnimationClass(dragClone, 'card-snap');
        }

        renderGame();
    } else {
        triggerHaptic('error');
        showFeedback(result.message, 'error');
        announceToScreenReader(`Error: ${result.message}`, 'assertive');

        // Snap back animation
        if (dragClone) {
            dragClone.classList.add('snap-back', 'card-returning');
            apply3DTransform(dragClone, 0, 0);
        }
    }
}

/**
 * Highlight valid/invalid drop zones during drag
 */
function updateColumnHighlights() {
    if (!draggedCard || !draggedCard.dataset || !draggedCard.dataset.cardId) {
        return; // Defensive: no dragged card, no highlights
    }

    const columns = document.querySelectorAll('.tableau-column');

    columns.forEach((column, colIndex) => {
        const rect = column.getBoundingClientRect();
        const isOver = currentTouchX >= rect.left && currentTouchX <= rect.right &&
                       currentTouchY >= rect.top && currentTouchY <= rect.bottom;

        // Remove all drag classes
        column.classList.remove('drag-over', 'drag-valid', 'drag-invalid');

        if (isOver) {
            column.classList.add('drag-over');

            // Validate if this is a valid drop
            const sourceCard = game.getPlayableCards().find(c => c.id === draggedCard.dataset.cardId);
            if (sourceCard && sourceCard.source === 'tableau' && sourceCard.colIndex !== colIndex) {
                column.classList.add('drag-valid');
            } else {
                column.classList.add('drag-invalid');
            }
        }
    });
}

function startNewGame(level = 1) {
    game = new GameEngine();
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
    if (elements.score) {
        elements.score.textContent = state.score;
    }
    elements.movesRemaining.textContent = state.movesRemaining;
    elements.stockCount.textContent = state.stockCount;

    // Add visual state classes for stock count
    elements.stockCount.classList.remove('low', 'empty');
    if (state.stockCount === 0) {
        elements.stockCount.classList.add('empty');
    } else if (state.stockCount <= 3) {
        elements.stockCount.classList.add('low');
    }
    
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

        // Calculate progress: sorted words / capacity (Phase 2 uses foundation.capacity)
        const sortedCount = foundation.words.length;
        const totalCount = foundation.capacity;

        const foundationEl = document.createElement('div');
        const isFull = sortedCount >= totalCount;
        const isLocked = foundation.isLocked || false;
        foundationEl.className = `foundation-stack foundation-slot${isFull ? ' pile-full' : ''}${isLocked ? ' locked' : ''}`; // Add pile-full and locked classes
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
                ${isLocked ? '<div class="lock-indicator">👑</div>' : ''}
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

                if (card.faceUp) {
                    cardEl.classList.add('playable');
                    cardEl.addEventListener('click', () => handleCardClick(card));
                } else {
                    // Face-down cards: no playable class, no event handlers
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

    // Only word cards are draggable (category cards are clicked to place)
    if (waste.type === 'word') {
        cardEl.classList.add('playable');
    }

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

        // Add data attributes for event delegation
        cardEl.dataset.cardType = 'category';
        cardEl.dataset.categoryId = card.id;
        cardEl.dataset.categoryName = card.name;
        cardEl.dataset.categoryIcon = card.icon;
    } else if (card.type === 'word') {
        cardEl.classList.add('word');

        // Add vector class for symbols with vector arrows
        if (card.hasVector) {
            cardEl.classList.add('vector');
        }

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

        // Add data attributes for event delegation
        cardEl.dataset.fullWord = card.word;
        cardEl.dataset.cardType = 'word';
        cardEl.dataset.word = card.word;
        cardEl.dataset.categoryId = card.categoryId;
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

    // Hint for mobile users to use drag-and-drop
    triggerHaptic('light');
    showFeedback('Drag cards to sort them', 'info');
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
            <button class="tab-btn active" disabled style="opacity: 0.5; cursor: not-allowed;">Game</button>
            <button class="tab-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Settings</button>
        </div>

        <!-- Game tab (existing content) -->
        <div id="game-tab" class="tab-content">
            <div style="margin-bottom: 16px;">
                <h3 style="margin-bottom: 8px;">How to Play</h3>
                <ol style="font-size: 0.875rem; line-height: 1.6; padding-left: 20px;">
                    <li><strong>Place categories first</strong> - You can't sort words until their category is on a foundation</li>
                    <li><strong>Sort words to categories</strong> - Tap a word, then select which category it belongs to</li>
                    <li><strong>Reorganize tableau</strong> - Drag cards between columns to uncover hidden cards</li>
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
                    <li><strong>Reorganize wisely</strong> - Moving cards between columns costs a move; only do it to access blocked category cards</li>
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

        <!-- Settings tab (new) - COMMENTED OUT: Non-functional placeholder for v2.0 -->
        <!--
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
        -->
    `;

    // Settings tab radio button handlers - COMMENTED OUT: Settings tab disabled
    /*
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (!e.target.disabled) {
                setDisplayMode(displayModes[e.target.value.toUpperCase()]);
            }
        });
    });
    */

    showModal();
}

function showMenuTab(tab, evt) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`${tab}-tab`).classList.remove('hidden');
    evt.target.classList.add('active');
}

function handleShowDomainSelector() {
    stopPerformanceMonitoring();

    elements.modalTitle.textContent = 'Choose Your Domain';

    // Build domain options using safe DOM API
    const domainContainer = document.createElement('div');
    domainContainer.className = 'domain-selector-grid';

    Object.entries(DomainData).forEach(([domainKey, domain]) => {
        const isActive = domainKey === currentDomain;

        const card = document.createElement('div');
        card.className = isActive ? 'domain-card active' : 'domain-card';
        card.addEventListener('click', () => handleDomainSelect(domainKey));

        // Make domain cards keyboard accessible
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDomainSelect(domainKey);
            }
        });

        const iconLarge = document.createElement('div');
        iconLarge.className = 'domain-icon-large';
        iconLarge.textContent = domain.icon;

        const info = document.createElement('div');
        info.className = 'domain-info';

        const name = document.createElement('h3');
        name.textContent = domain.name;

        const desc = document.createElement('p');
        desc.textContent = domain.description;

        const meta = document.createElement('div');
        meta.className = 'domain-meta';
        meta.textContent = `${domain.categories.length} categories`;

        info.appendChild(name);
        info.appendChild(desc);
        info.appendChild(meta);

        card.appendChild(iconLarge);
        card.appendChild(info);

        if (isActive) {
            const badge = document.createElement('div');
            badge.className = 'domain-badge';
            badge.textContent = 'Current';
            card.appendChild(badge);
        }

        // Add comprehensive ARIA labels
        const ariaLabel = `${domain.name}: ${domain.description}. ${domain.categories.length} categories${isActive ? '. Currently selected' : ''}`;
        card.setAttribute('aria-label', ariaLabel);
        if (isActive) {
            card.setAttribute('aria-current', 'true');
        }

        domainContainer.appendChild(card);
    });

    const noteDiv = document.createElement('div');
    noteDiv.className = 'domain-note';
    const noteP = document.createElement('p');
    const noteStrong = document.createElement('strong');
    noteStrong.textContent = 'Note:';
    noteP.appendChild(noteStrong);
    noteP.appendChild(document.createTextNode(' Changing domain will start a new game from Level 1.'));
    noteDiv.appendChild(noteP);

    elements.modalBody.innerHTML = '';
    elements.modalBody.appendChild(domainContainer);
    elements.modalBody.appendChild(noteDiv);

    showModal();
}

function handleDomainSelect(domainKey) {
    if (domainKey === currentDomain) {
        // Same domain - just close modal
        closeModal();
        return;
    }

    // Confirm if game is in progress
    const state = game ? game.getGameState() : null;
    if (state && state.gameState === 'playing') {
        if (!confirm(`Switch to ${DomainData[domainKey].name}? Current progress will be lost.`)) {
            closeModal(); // Close modal if user cancels domain switch
            return;
        }
    }

    // Switch domain
    setCurrentDomain(domainKey);

    // Update domain icon in header
    elements.domainIcon.textContent = DomainData[domainKey].icon;

    // Track domain change
    if (typeof GameAnalytics !== 'undefined') {
        GameAnalytics.domainChanged(domainKey);
    }

    // Close modal and start new game
    closeModal();
    startNewGame(1);

    // Announce domain switch to screen readers
    announceToScreenReader(`Switched to ${DomainData[domainKey].name} domain. Starting new game at Level 1.`, 'polite');
}

function handleShowCareerRoadmap() {
    stopPerformanceMonitoring();

    if (!window.progressionManager) {
        console.error('ProgressionManager not initialized');
        return;
    }

    elements.modalTitle.textContent = '🎯 Career Roadmap';
    elements.modalBody.innerHTML = '';

    const roadmap = new CareerRoadmap(window.progressionManager);
    roadmap.render(elements.modalBody);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-stock';
    closeBtn.style.marginTop = '16px';
    closeBtn.textContent = 'Back to Game';
    closeBtn.onclick = () => {
        roadmap.close();
        closeModal();
        if (game && !lowPerformanceMode) {
            startPerformanceMonitoring();
        }
    };

    elements.modalBody.appendChild(closeBtn);

    showModal();

    window.addEventListener('resize', () => roadmap.handleResize());
}

function handleShowMenu() {
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

    if (won && window.progressionManager) {
        window.progressionManager.updateDomainProgress(currentDomain, {
            level: game.level,
            score: state.score,
            completed: true
        });
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
    const feltMsg = document.getElementById('felt-message');
    if (!feltMsg) return;

    // Reset animation if it's already running
    feltMsg.classList.remove('active');

    // Tiny timeout to trigger the transition again
    setTimeout(() => {
        feltMsg.textContent = message;
        feltMsg.classList.add('active');

        // Hide after 2 seconds
        if (window.feltTimer) clearTimeout(window.feltTimer);
        window.feltTimer = setTimeout(() => {
            feltMsg.classList.remove('active');
        }, 2000);
    }, 50);
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

// --- Birthday Easter Egg Logic ---

// =============================================================================
// BIRTHDAY EASTER EGG WITH BLOOMING FLOWERS EFFECT
// Integration for physics-associations/main.js
// =============================================================================

// --- Birthday Easter Egg Logic ---

function checkBirthdayEasterEgg() {
    const today = new Date();
    // Target: Jan 1, 2026
    const isBirthday = today.getFullYear() === 2026 &&
                       today.getMonth() === 0 &&
                       today.getDate() === 1;

    const hasSeenGreeting = localStorage.getItem('bhazel_birthday_2026');

    if (isBirthday && !hasSeenGreeting) {
        showBirthdayMessage();
        localStorage.setItem('bhazel_birthday_2026', 'true');
    }
}

function showBirthdayMessage() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('modal');

    if (modalTitle && modalBody && modal) {
        modalTitle.innerHTML = "🎂 Happy Birthday, Bhazel!";

        // Create birthday message content with better spacing
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px 20px 200px 20px; position: relative; z-index: 10;">
                <p style="font-size: 1.2rem; margin-bottom: 15px; line-height: 1.6;">
                    Surprise! I’ve been busy reducing the entropy in this code. <br>
                    50+ commits later, we've finally reached a stable <b>Ground State</b>.
                </p>
                <p style="margin-bottom: 20px; line-height: 1.6;">I hope your new year is full of high energy and perfect associations!</p>
                <div style="font-size: 3rem; margin: 15px 0; animation: bounceEmojis 2s ease-in-out infinite;">🎁⚛️💖</div>
            </div>

            <!-- Flowers Container -->
            <div class="birthday-flowers-container"></div>
        `;

        // Add birthday glow effect to modal
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.classList.add('birthday-glow');
            content.style.overflow = 'hidden'; // Prevent flowers from escaping

            // Initialize flowers animation
            initBirthdayFlowers(content);
        }

        modal.classList.remove('hidden');
    }
}

// =============================================================================
// BLOOMING FLOWERS ANIMATION SYSTEM
// =============================================================================

function initBirthdayFlowers(container) {
    // Create flowers container
    const flowersContainer = container.querySelector('.birthday-flowers-container');
    if (!flowersContainer) return;
    
    // Inject CSS if not already present
    injectFlowersCSS();
    
    // Build flower HTML structure
    flowersContainer.innerHTML = createFlowersHTML();
    
    // Start animation sequence after a brief delay
    setTimeout(() => {
        document.body.classList.remove('flowers-not-loaded');
    }, 100);
}

function injectFlowersCSS() {
    // Check if CSS already exists
    if (document.getElementById('birthday-flowers-styles')) return;

    const style = document.createElement('style');
    style.id = 'birthday-flowers-styles';
    style.textContent = `
        /* Birthday Flowers Animation Styles */

        .birthday-flowers-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 220px;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }

        .flowers {
            position: relative;
            width: 100%;
            height: 100%;
            transform: scale(0.8);
            transform-origin: bottom center;
        }

        .flower {
            position: absolute;
            bottom: 0;
            transform-origin: bottom center;
            z-index: 10;
        }

        .flower--1 {
            left: 10%;
            animation: moving-flower-1 4s linear infinite;
        }

        .flower--2 {
            left: 50%;
            transform: translateX(-50%);
            animation: moving-flower-2 4s linear infinite;
        }

        .flower--3 {
            left: 85%;
            animation: moving-flower-3 4s linear infinite;
        }

        /* Flower petals container */
        .flower__leafs {
            position: relative;
            animation: blooming-flower 2s backwards;
        }

        .flower__leafs--1 { animation-delay: 1.1s; }
        .flower__leafs--2 { animation-delay: 1.4s; }
        .flower__leafs--3 { animation-delay: 1.7s; }

        /* Individual petal */
        .flower__leaf {
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 20px;
            height: 28px;
            border-radius: 51% 49% 47% 53% / 44% 45% 55% 69%;
            background: linear-gradient(to top, #ff69b4, #ffb6d9);
            transform-origin: bottom center;
            opacity: 0.9;
            box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5);
        }

        .flower__leaf--1 {
            transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg);
        }

        .flower__leaf--2 {
            transform: translate(-50%, -4%) rotateX(40deg);
        }

        .flower__leaf--3 {
            transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg);
        }

        .flower__leaf--4 {
            width: 20px;
            height: 20px;
            transform-origin: bottom left;
            border-radius: 10px 25px 10px 10px;
            transform: translate(0%, 18%) rotateX(70deg) rotate(-43deg);
            background: linear-gradient(to top, #ff1493, #ffb6d9);
            z-index: 1;
            opacity: 0.8;
        }

        /* Flower center */
        .flower__white-circle {
            position: absolute;
            left: -8px;
            top: -7px;
            width: 22px;
            height: 10px;
            border-radius: 50%;
            background: #fff;
        }

        .flower__white-circle::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 45%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 60%;
            border-radius: inherit;
            background: linear-gradient(90deg, #ffeb12, #ffce00);
        }

        /* Flower stem */
        .flower__line {
            height: 160px;
            width: 4px;
            background: linear-gradient(to left, #000, transparent, rgba(255, 255, 255, 0.2)),
                        linear-gradient(to top, transparent 10%, #2d5016, #4a7c2f);
            box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
            animation: grow-flower-tree 4s backwards;
        }

        .flower--1 .flower__line { animation-delay: 0.3s; }
        .flower--2 .flower__line { animation-delay: 0.6s; }
        .flower--3 .flower__line { animation-delay: 0.9s; }

        /* Stem leaves */
        .flower__line__leaf {
            --w: 18px;
            --h: calc(var(--w) + 5px);
            position: absolute;
            top: 20%;
            left: 90%;
            width: var(--w);
            height: var(--h);
            border-top-right-radius: var(--h);
            border-bottom-left-radius: var(--h);
            background: linear-gradient(to top, rgba(45, 80, 22, 0.4), #4a7c2f);
        }

        .flower__line__leaf--1 {
            transform: rotate(70deg) rotateY(30deg);
            animation: blooming-leaf-right 0.8s 1.6s backwards;
        }

        .flower__line__leaf--2 {
            top: 45%;
            transform: rotate(70deg) rotateY(30deg);
            animation: blooming-leaf-right 0.8s 1.4s backwards;
        }

        .flower__line__leaf--3 {
            border-top-right-radius: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: var(--h);
            border-bottom-right-radius: var(--h);
            left: -460%;
            top: 12%;
            transform: rotate(-70deg) rotateY(30deg);
            animation: blooming-leaf-left 0.8s 1.2s backwards;
        }

        .flower__line__leaf--4 {
            border-top-right-radius: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: var(--h);
            border-bottom-right-radius: var(--h);
            left: -460%;
            top: 40%;
            transform: rotate(-70deg) rotateY(30deg);
            animation: blooming-leaf-left 0.8s 1s backwards;
        }

        /* Sparkles */
        .flower__light {
            position: absolute;
            bottom: 0;
            width: 3px;
            height: 3px;
            background: #ffd700;
            border-radius: 50%;
            filter: blur(0.5px);
            animation: light-ans 4s linear infinite backwards;
            box-shadow: 0 0 4px #ffd700;
        }

        .flower__light:nth-child(odd) {
            background: #ff69b4;
            box-shadow: 0 0 4px #ff69b4;
        }

        .flower__light--1 { left: -5px; animation-delay: 1s; }
        .flower__light--2 { left: 7px; animation-delay: 0.5s; }
        .flower__light--3 { left: -15px; animation-delay: 0.3s; }
        .flower__light--4 { left: 15px; animation-delay: 0.9s; }
        .flower__light--5 { left: -2px; animation-delay: 1.5s; }
        .flower__light--6 { left: -10px; animation-delay: 3s; }
        .flower__light--7 { left: 7px; animation-delay: 2s; }
        .flower__light--8 { left: -15px; animation-delay: 3.5s; }

        /* Ground grass decoration */
        .flower__grass {
            --c: #4a7c2f;
            position: absolute;
            bottom: 10px;
            left: -15px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            z-index: 20;
            transform-origin: bottom center;
            transform: rotate(-48deg) rotateY(40deg);
            animation: moving-grass 2s linear infinite;
        }

        .flower__grass--1 { animation-delay: 0s; }
        .flower__grass--2 {
            left: 5px;
            bottom: 8px;
            transform: scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);
            opacity: 0.8;
            z-index: 0;
            animation: moving-grass--2 1.5s linear infinite;
        }

        .flower__grass--top {
            width: 18px;
            height: 25px;
            border-top-right-radius: 100%;
            border-right: 4px solid var(--c);
            transform: rotate(-2deg);
        }

        .flower__grass--bottom {
            margin-top: -2px;
            width: 4px;
            height: 60px;
            background: linear-gradient(to top, transparent, var(--c));
        }

        /* Growing animation wrapper */
        .grow-ans {
            animation: grow-ans 2s var(--d, 0s) backwards;
        }

        .growing-grass {
            animation: growing-grass-ans 1s 2s backwards;
        }

        /* Keyframe Animations */

        @keyframes moving-flower-1 {
            0%, 100% { transform: rotate(2deg); }
            50% { transform: rotate(-2deg); }
        }

        @keyframes moving-flower-2 {
            0%, 100% { transform: rotate(18deg); }
            50% { transform: rotate(14deg); }
        }

        @keyframes moving-flower-3 {
            0%, 100% { transform: rotate(-18deg); }
            50% { transform: rotate(-20deg) rotateY(-10deg); }
        }

        @keyframes blooming-flower {
            0% { transform: scale(0); }
        }

        @keyframes blooming-leaf-right {
            0% {
                transform-origin: left;
                transform: rotate(70deg) rotateY(30deg) scale(0);
            }
        }

        @keyframes blooming-leaf-left {
            0% {
                transform-origin: right;
                transform: rotate(-70deg) rotateY(30deg) scale(0);
            }
        }

        @keyframes grow-flower-tree {
            0% {
                height: 0;
                border-radius: 2px;
            }
        }

        @keyframes light-ans {
            0% {
                opacity: 0;
                transform: translateY(0);
            }
            25% {
                opacity: 1;
                transform: translateY(-12px) translateX(-5px);
            }
            50% {
                opacity: 1;
                transform: translateY(-35px) translateX(5px);
                filter: blur(0.5px);
            }
            75% {
                transform: translateY(-50px) translateX(-5px);
                filter: blur(0.5px);
            }
            100% {
                transform: translateY(-75px);
                opacity: 0;
                filter: blur(2px);
            }
        }

        @keyframes moving-grass {
            0%, 100% { transform: rotate(-48deg) rotateY(40deg); }
            50% { transform: rotate(-50deg) rotateY(40deg); }
        }

        @keyframes moving-grass--2 {
            0%, 100% {
                transform: scale(0.5) rotate(75deg) rotateX(10deg) rotateY(-200deg);
            }
            50% {
                transform: scale(0.5) rotate(79deg) rotateX(10deg) rotateY(-200deg);
            }
        }

        @keyframes grow-ans {
            0% {
                transform: scale(0);
                opacity: 0;
            }
        }

        @keyframes growing-grass-ans {
            0% { transform: scale(0); }
        }

        /* Bounce animation for emojis */
        @keyframes bounceEmojis {
            0%, 100% {
                transform: translateY(0) scale(1);
            }
            50% {
                transform: translateY(-10px) scale(1.05);
            }
        }

        /* Pause animations initially */
        .flowers-not-loaded * {
            animation-play-state: paused !important;
        }

        /* Responsive adjustments for smaller modals */
        @media (max-width: 480px) {
            .birthday-flowers-container {
                height: 160px;
            }

            .flowers {
                transform: scale(0.6);
            }

            .flower__line {
                height: 120px;
            }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            .flower__light,
            .flower--1,
            .flower--2,
            .flower--3,
            .flower__grass {
                animation: none !important;
            }

            @keyframes bounceEmojis {
                0%, 100% { transform: translateY(0) scale(1); }
            }
        }
    `;

    document.head.appendChild(style);
}

function createFlowersHTML() {
    return `
        <div class="flowers">
            <!-- Flower 1 -->
            <div class="flower flower--1">
                <div class="flower__leafs flower__leafs--1">
                    <div class="flower__leaf flower__leaf--1"></div>
                    <div class="flower__leaf flower__leaf--2"></div>
                    <div class="flower__leaf flower__leaf--3"></div>
                    <div class="flower__leaf flower__leaf--4"></div>
                    <div class="flower__white-circle"></div>
                    
                    <div class="flower__light flower__light--1"></div>
                    <div class="flower__light flower__light--2"></div>
                    <div class="flower__light flower__light--3"></div>
                    <div class="flower__light flower__light--4"></div>
                    <div class="flower__light flower__light--5"></div>
                    <div class="flower__light flower__light--6"></div>
                    <div class="flower__light flower__light--7"></div>
                    <div class="flower__light flower__light--8"></div>
                </div>
                <div class="flower__line">
                    <div class="flower__line__leaf flower__line__leaf--1"></div>
                    <div class="flower__line__leaf flower__line__leaf--2"></div>
                    <div class="flower__line__leaf flower__line__leaf--3"></div>
                    <div class="flower__line__leaf flower__line__leaf--4"></div>
                </div>
            </div>

            <!-- Flower 2 -->
            <div class="flower flower--2">
                <div class="flower__leafs flower__leafs--2">
                    <div class="flower__leaf flower__leaf--1"></div>
                    <div class="flower__leaf flower__leaf--2"></div>
                    <div class="flower__leaf flower__leaf--3"></div>
                    <div class="flower__leaf flower__leaf--4"></div>
                    <div class="flower__white-circle"></div>
                    
                    <div class="flower__light flower__light--1"></div>
                    <div class="flower__light flower__light--2"></div>
                    <div class="flower__light flower__light--3"></div>
                    <div class="flower__light flower__light--4"></div>
                    <div class="flower__light flower__light--5"></div>
                    <div class="flower__light flower__light--6"></div>
                    <div class="flower__light flower__light--7"></div>
                    <div class="flower__light flower__light--8"></div>
                </div>
                <div class="flower__line">
                    <div class="flower__line__leaf flower__line__leaf--1"></div>
                    <div class="flower__line__leaf flower__line__leaf--2"></div>
                    <div class="flower__line__leaf flower__line__leaf--3"></div>
                    <div class="flower__line__leaf flower__line__leaf--4"></div>
                </div>
            </div>

            <!-- Flower 3 -->
            <div class="flower flower--3">
                <div class="flower__leafs flower__leafs--3">
                    <div class="flower__leaf flower__leaf--1"></div>
                    <div class="flower__leaf flower__leaf--2"></div>
                    <div class="flower__leaf flower__leaf--3"></div>
                    <div class="flower__leaf flower__leaf--4"></div>
                    <div class="flower__white-circle"></div>
                    
                    <div class="flower__light flower__light--1"></div>
                    <div class="flower__light flower__light--2"></div>
                    <div class="flower__light flower__light--3"></div>
                    <div class="flower__light flower__light--4"></div>
                    <div class="flower__light flower__light--5"></div>
                    <div class="flower__light flower__light--6"></div>
                    <div class="flower__light flower__light--7"></div>
                    <div class="flower__light flower__light--8"></div>
                </div>
                <div class="flower__line">
                    <div class="flower__line__leaf flower__line__leaf--1"></div>
                    <div class="flower__line__leaf flower__line__leaf--2"></div>
                    <div class="flower__line__leaf flower__line__leaf--3"></div>
                    <div class="flower__line__leaf flower__line__leaf--4"></div>
                </div>
            </div>

            <!-- Decorative grass -->
            <div class="growing-grass">
                <div class="flower__grass flower__grass--1">
                    <div class="flower__grass--top"></div>
                    <div class="flower__grass--bottom"></div>
                </div>
            </div>

            <div class="growing-grass">
                <div class="flower__grass flower__grass--2">
                    <div class="flower__grass--top"></div>
                    <div class="flower__grass--bottom"></div>
                </div>
            </div>
        </div>
    `;
}

// =============================================================================
// INITIALIZATION
// Add flowers-not-loaded class to body initially (to be removed after setup)
// =============================================================================

// document.addEventListener('DOMContentLoaded', () => {
//     document.body.classList.add('flowers-not-loaded');
//     checkBirthdayEasterEgg();
// });

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================

/*
INTEGRATION STEPS:

1. Replace the existing checkBirthdayEasterEgg() and showBirthdayMessage() 
   functions in your main.js with this entire code block.

2. The flower animation will automatically initialize when the birthday modal opens.

3. The flowers are positioned at the bottom of the modal and won't interfere with
   the message text (which has z-index: 10).

4. Responsive design is built-in - flowers scale down on mobile devices.

5. The animation is performance-optimized and uses CSS animations (GPU-accelerated).

CUSTOMIZATION OPTIONS:

- Adjust flower colors: Change the gradient colors in .flower__leaf background
- Change animation speed: Modify animation duration values (e.g., 4s, 2s)
- Add more flowers: Duplicate a .flower block and adjust left position
- Adjust height: Change .birthday-flowers-container height value
- Change sparkle colors: Modify .flower__light background colors

PERFORMANCE NOTES:

- Animations are paused initially via .flowers-not-loaded class
- Removed after 100ms delay to ensure smooth initialization
- Uses CSS transforms (GPU-accelerated) instead of position changes
- Compatible with low-performance mode (animations simplified via prefers-reduced-motion)
*/