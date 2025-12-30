// Game Logic - Associations-style Category Sorting

/**
 * Validates if a card can be sorted to a target category
 * Supports both legacy single category and new ambiguous symbol arrays
 *
 * @param {Object} card - Card object with either categoryId or validCategories
 * @param {string} targetCategory - Category ID to validate against
 * @returns {boolean} True if card belongs to targetCategory
 */
function checkMatch(card, targetCategory) {
    // Legacy support: words with single categoryId property
    if (card.categoryId && card.categoryId === targetCategory) {
        return true;
    }

    // New support: ambiguous symbols/acronyms with validCategories array
    if (card.validCategories && card.validCategories.includes(targetCategory)) {
        return true;
    }

    return false;
}

/**
 * Gets valid category IDs for a card
 * Supports both legacy single category and new ambiguous symbol arrays
 *
 * @param {Object} card - Card object with either categoryId or validCategories
 * @returns {Array<string>} Array of category IDs the card belongs to
 */
function getValidCategories(card) {
    // Legacy support: single categoryId becomes single-element array
    if (card.categoryId) {
        return [card.categoryId];
    }

    // New support: ambiguous symbols with validCategories array
    if (card.validCategories && Array.isArray(card.validCategories)) {
        return card.validCategories;
    }

    return [];
}

class PhysicsAssociations {
    constructor() {
        this.level = 1;
        this.maxMoves = 0;
        this.movesRemaining = 0;
        this.score = 0;
        
        // Board layout (similar to solitaire spread)
        this.tableau = []; // Face-up and face-down cards in columns
        this.stockPile = []; // Draw pile
        this.waste = null; // Current drawn card
        
        // Foundation stacks (category sorting area)
        this.foundations = {}; // { categoryId: [sorted word cards] }
        this.placedCategories = []; // Which categories are on foundations
        
        this.gameState = 'ready'; // ready, playing, won, lost
    }

    /**
     * Initialize a new level
     */
    initLevel(level = 1) {
        this.level = level;
        const deck = generateLevelDeck(level);
        
        // Calculate moves based on level (generous at first)
        const totalCards = deck.categoryCards.length + deck.wordCards.length;
        this.maxMoves = Math.floor(totalCards * 1.5) + 10;
        this.movesRemaining = this.maxMoves;
        
        this.score = 0;
        this.foundations = {};
        this.placedCategories = [];
        this.waste = null;
        
        // Create tableau layout (5 columns)
        this.createTableauLayout(deck);
        
        this.gameState = 'playing';
    }

    /**
     * Creates a solitaire-style tableau spread
     * Column layout: Some face-down, some face-up
     */
    createTableauLayout(deck) {
        this.tableau = [];
        const allCards = [...deck.categoryCards, ...deck.wordCards];
        
        // Number of columns (3-5 based on level)
        const numColumns = Math.min(3 + Math.floor(this.level / 2), 5);
        
        // Reserve 30% of cards for stock pile
        const stockCount = Math.floor(allCards.length * 0.3);
        this.stockPile = allCards.slice(0, stockCount).map(card => ({
            ...card,
            faceUp: false
        }));
        
        const tableauCards = allCards.slice(stockCount);
        
        // Distribute cards across columns
        const cardsPerColumn = Math.ceil(tableauCards.length / numColumns);
        
        for (let col = 0; col < numColumns; col++) {
            const column = [];
            const start = col * cardsPerColumn;
            const end = Math.min(start + cardsPerColumn, tableauCards.length);
            
            for (let i = start; i < end; i++) {
                const card = tableauCards[i];
                
                // Bottom 2 cards are face-up, rest are face-down
                const positionFromBottom = (end - i);
                card.faceUp = positionFromBottom <= 2;
                card.column = col;
                card.position = i - start;
                
                column.push(card);
            }
            
            this.tableau.push(column);
        }
    }

    /**
     * Get all playable cards (top of each column + waste)
     * Phase 2: Limited to 3-4 cards for spatial constraint
     */
    getPlayableCards() {
        const allPlayable = [];

        // ALL face-up cards from each column
        this.tableau.forEach((column, colIndex) => {
            column.forEach((card, cardIndex) => {
                if (card.faceUp) {
                    allPlayable.push({ ...card, source: 'tableau', colIndex, cardIndex });
                }
            });
        });

        // Waste pile card (always prioritized)
        if (this.waste && this.waste.faceUp) {
            allPlayable.unshift({ ...this.waste, source: 'waste' }); // Add to front
        }

        // Phase 2: Limit to 4 exposed cards for spatial constraint
        // Waste card + max 3 tableau cards
        const MAX_EXPOSED = 4;
        return allPlayable.slice(0, MAX_EXPOSED);
    }

    /**
     * Place a category card on a foundation
     */
    placeCategory(cardId) {
        const playable = this.getPlayableCards();
        const card = playable.find(c => c.id === cardId);
        
        if (!card || card.type !== 'category') {
            return { success: false, message: 'Invalid category card' };
        }
        
        // Check if category already placed
        if (this.placedCategories.includes(card.categoryId)) {
            return { success: false, message: 'Category already placed' };
        }
        
        // Remove from source
        this.removeCardFromSource(card);

        // Create foundation stack with capacity tracking (Phase 2)
        const capacity = this.countWordsForCategory(card.categoryId);
        this.foundations[card.categoryId] = {
            category: card,
            words: [],
            capacity: capacity,
            isLocked: false
        };
        this.placedCategories.push(card.categoryId);
        
        this.movesRemaining--;
        this.revealCards();
        
        return { 
            success: true, 
            message: `${card.name} category placed!`,
            card 
        };
    }

    /**
     * Sort a word card to its category foundation
     * Following Associations rules: wrong category = wasted move
     * Supports ambiguous symbols with multiple valid categories
     */
    sortWord(wordCardId, categoryId) {
        const playable = this.getPlayableCards();
        const card = playable.find(c => c.id === wordCardId);

        if (!card || card.type !== 'word') {
            return { success: false, message: 'Invalid word card' };
        }

        // Check if category is placed
        if (!this.placedCategories.includes(categoryId)) {
            return { success: false, message: 'Place that category card first!' };
        }

        // Phase 3: Check if foundation is locked (complete piles cannot accept more cards)
        const foundation = this.foundations[categoryId];
        if (foundation.isLocked) {
            this.movesRemaining--; // Penalty for attempting to sort to locked pile
            return {
                success: false,
                message: `That pile is locked! (Complete)`
            };
        }

        // Phase 2: Check capacity blocking (pile full = cannot accept)
        if (foundation.words.length >= foundation.capacity) {
            this.movesRemaining--; // Penalty for attempting impossible move
            return {
                success: false,
                message: `That pile is full! (${foundation.capacity}/${foundation.capacity})`
            };
        }

        // Validate word belongs to category
        // Uses checkMatch() to support both legacy categoryId and new validCategories array
        // In Associations: Wrong match costs a move but doesn't sort the card
        if (!checkMatch(card, categoryId)) {
            this.movesRemaining--; // Move penalty for wrong guess

            // Get the correct category name(s) for feedback
            // For ambiguous symbols, show all valid categories
            const domainData = getCurrentDomainData();
            let correctCategoryName = '';
            if (card.categoryId) {
                const correctCategory = domainData.categories.find(c => c.id === card.categoryId);
                correctCategoryName = correctCategory.name;
            } else if (card.validCategories) {
                const validCatNames = card.validCategories
                    .map(catId => domainData.categories.find(c => c.id === catId).name)
                    .join(' or ');
                correctCategoryName = validCatNames;
            }

            const attemptedCategory = domainData.categories.find(c => c.id === categoryId);

            return {
                success: false,
                message: `Wrong! "${card.word}" belongs to ${correctCategoryName}, not ${attemptedCategory.name}. -1 move`,
                correctCategory: correctCategoryName
            };
        }

        // Correct match - remove from source and add to foundation
        this.removeCardFromSource(card);
        this.foundations[categoryId].words.push(card);
        this.score += card.points;

        // Phase 3: Lock foundation when it reaches capacity
        if (this.foundations[categoryId].words.length >= this.foundations[categoryId].capacity) {
            this.foundations[categoryId].isLocked = true;
        }

        this.movesRemaining--;
        this.revealCards();
        this.checkGameState();

        return {
            success: true,
            message: `"${card.word}" sorted correctly! +${card.points}`,
            points: card.points
        };
    }

    /**
     * Draw a card from stock pile
     * In Associations: Drawing is only allowed when no other valid moves exist
     */
    drawFromStock() {
        if (this.stockPile.length === 0) {
            return { success: false, message: 'Stock pile is empty' };
        }

        // Strategic tip: Warn if playable cards exist on tableau
        const playableOnBoard = this.getPlayableCards().filter(c => c.source === 'tableau');
        if (playableOnBoard.length > 0 && this.waste) {
            // Player is drawing while having playable tableau cards AND an unplayed waste card
            // This is generally a mistake in Associations
            console.warn('Drawing while playable cards exist - may waste moves');
        }

        // If waste already has a card, it gets discarded (no move penalty in true Associations)
        // The move cost is ONLY for the draw action itself
        if (this.waste) {
            // In strict Associations, unplayed cards just cycle back or are lost
            // We'll allow it but the player spent a move to draw something they didn't use
        }

        const card = this.stockPile.pop();
        card.faceUp = true;
        this.waste = card;

        this.movesRemaining--; // Only the draw costs a move

        return {
            success: true,
            message: `Drew: ${card.type === 'category' ? card.name : card.word}`,
            card
        };
    }

    /**
     * Remove a card from its source (tableau or waste)
     * Uses ID-based lookup for defensive programming against stale indices
     */
    removeCardFromSource(card) {
        if (card.source === 'waste') {
            this.waste = null;
        } else if (card.source === 'tableau') {
            // Defensive: Find card by ID instead of trusting cardIndex
            const column = this.tableau[card.colIndex];
            const actualIndex = column.findIndex(c => c.id === card.id);
            if (actualIndex === -1) {
                console.error('Card not found in column:', card.id);
                return; // Fail gracefully
            }
            column.splice(actualIndex, 1);
        }
    }

    /**
     * Reveal face-down cards when top cards are removed
     */
    revealCards() {
        this.tableau.forEach(column => {
            if (column.length > 0) {
                const topCard = column[column.length - 1];
                if (!topCard.faceUp) {
                    topCard.faceUp = true;
                }
            }
        });
    }

    /**
     * Check win/loss conditions
     */
    checkGameState() {
        // Win: All word cards sorted
        const totalWordsSorted = Object.values(this.foundations)
            .reduce((sum, foundation) => sum + foundation.words.length, 0);

        const totalWordsInGame = this.tableau
            .flat()
            .filter(c => c.type === 'word').length
            + (this.waste && this.waste.type === 'word' ? 1 : 0)
            + this.stockPile.filter(c => c.type === 'word').length;

        if (totalWordsInGame === 0 && totalWordsSorted > 0) {
            this.gameState = 'won';
            return;
        }

        // Loss: No moves remaining
        if (this.movesRemaining <= 0) {
            this.gameState = 'lost';
            return;
        }

        // Phase 3: Dead board detection - no valid moves possible
        const playable = this.getPlayableCards();

        // Check if there are any valid category placements
        const hasPlaceableCategory = playable.some(c =>
            c.type === 'category' && !this.placedCategories.includes(c.categoryId)
        );

        // Check if there are any valid word sorts
        const hasValidWordMove = playable.some(c => {
            if (c.type !== 'word') return false;
            // Check if any valid category for this card is placed AND not locked AND not full
            const validCats = getValidCategories(c);
            return validCats.some(cat => {
                const isPlaced = this.placedCategories.includes(cat);
                const foundation = this.foundations[cat];
                if (!foundation) return false;
                const isNotLocked = !foundation.isLocked;
                const isNotFull = foundation.words.length < foundation.capacity;
                return isPlaced && isNotLocked && isNotFull;
            });
        });

        // Dead board: no valid moves and stock is empty
        if (!hasPlaceableCategory && !hasValidWordMove && this.stockPile.length === 0) {
            this.gameState = 'lost';
        }
    }

    /**
     * Get strategic hint following Associations gameplay tips
     * Priority: 1) Use tableau cards, 2) Reveal hidden cards, 3) Draw from stock
     * Handles both legacy and ambiguous symbol cards
     */
    getHint() {
        const playable = this.getPlayableCards();

        // PRIORITY 1: Place missing categories if available
        const playableCategories = playable.filter(c =>
            c.type === 'category' && !this.placedCategories.includes(c.categoryId)
        );

        if (playableCategories.length > 0) {
            // Prefer categories from tableau over waste (reveals more cards)
            const tableauCategory = playableCategories.find(c => c.source === 'tableau');
            const category = tableauCategory || playableCategories[0];

            return {
                type: 'category',
                message: `Place "${category.name}" category to unlock ${this.countWordsForCategory(category.categoryId)} words`,
                card: category,
                source: category.source
            };
        }

        // PRIORITY 2: Sort tableau words (reveals hidden cards)
        // Check if any valid category for the card is placed AND not locked AND not full
        const tableauWords = playable.filter(c => {
            if (c.type !== 'word' || c.source !== 'tableau') return false;
            const validCats = getValidCategories(c);
            return validCats.some(cat => {
                const isPlaced = this.placedCategories.includes(cat);
                const foundation = this.foundations[cat];
                if (!foundation) return false;
                const isNotLocked = !foundation.isLocked;
                const isNotFull = foundation.words.length < foundation.capacity;
                return isPlaced && isNotLocked && isNotFull;
            });
        });

        if (tableauWords.length > 0) {
            const word = tableauWords[0];
            // Get first placed valid category for this word that is not locked and not full
            const validCats = getValidCategories(word);
            const targetCategoryId = validCats.find(cat => {
                const isPlaced = this.placedCategories.includes(cat);
                const foundation = this.foundations[cat];
                if (!foundation) return false;
                const isNotLocked = !foundation.isLocked;
                const isNotFull = foundation.words.length < foundation.capacity;
                return isPlaced && isNotLocked && isNotFull;
            });
            const domainData = getCurrentDomainData();
            const category = domainData.categories.find(c => c.id === targetCategoryId);

            return {
                type: 'word',
                message: `Sort "${word.word}" to ${category.name} (reveals hidden cards)`,
                card: word,
                targetCategory: category,
                priority: 'high'
            };
        }

        // PRIORITY 3: Sort waste words (if no tableau moves)
        const wasteWords = playable.filter(c => {
            if (c.type !== 'word' || c.source !== 'waste') return false;
            const validCats = getValidCategories(c);
            return validCats.some(cat => {
                const isPlaced = this.placedCategories.includes(cat);
                const foundation = this.foundations[cat];
                if (!foundation) return false;
                const isNotLocked = !foundation.isLocked;
                const isNotFull = foundation.words.length < foundation.capacity;
                return isPlaced && isNotLocked && isNotFull;
            });
        });

        if (wasteWords.length > 0) {
            const word = wasteWords[0];
            // Get first placed valid category for this word that is not locked and not full
            const validCats = getValidCategories(word);
            const targetCategoryId = validCats.find(cat => {
                const isPlaced = this.placedCategories.includes(cat);
                const foundation = this.foundations[cat];
                if (!foundation) return false;
                const isNotLocked = !foundation.isLocked;
                const isNotFull = foundation.words.length < foundation.capacity;
                return isPlaced && isNotLocked && isNotFull;
            });
            const domainData = getCurrentDomainData();
            const category = domainData.categories.find(c => c.id === targetCategoryId);

            return {
                type: 'word',
                message: `Sort drawn card "${word.word}" to ${category.name}`,
                card: word,
                targetCategory: category,
                priority: 'medium'
            };
        }

        // PRIORITY 4: Draw from stock (only when no other moves)
        const hint = getHint(this.placedCategories,
            playable.filter(c => c.type === 'word'));

        return {
            type: 'draw',
            message: 'No valid moves on board - draw from stock',
            missing: hint.missingCategories,
            priority: 'low'
        };
    }
    
    /**
     * Helper: Count how many words belong to a category
     * Handles both legacy categoryId and new validCategories array for ambiguous symbols
     */
    countWordsForCategory(categoryId) {
        const tableauWords = this.tableau.flat().filter(c =>
            c.type === 'word' && checkMatch(c, categoryId)
        );
        const wasteWords = (this.waste && this.waste.type === 'word' && checkMatch(this.waste, categoryId)) ? 1 : 0;
        const stockWords = this.stockPile.filter(c =>
            c.type === 'word' && checkMatch(c, categoryId)
        ).length;

        return tableauWords.length + wasteWords + stockWords;
    }

    /**
     * Get complete game state for UI
     */
    getGameState() {
        return {
            level: this.level,
            score: this.score,
            movesRemaining: this.movesRemaining,
            maxMoves: this.maxMoves,
            tableau: this.tableau,
            stockCount: this.stockPile.length,
            waste: this.waste,
            foundations: this.foundations,
            placedCategories: this.placedCategories,
            playableCards: this.getPlayableCards(),
            gameState: this.gameState
        };
    }
}
