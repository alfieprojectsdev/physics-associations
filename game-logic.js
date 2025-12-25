// Game Logic - Associations-style Category Sorting

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
     */
    getPlayableCards() {
        const playable = [];
        
        // Top card from each column
        this.tableau.forEach((column, colIndex) => {
            if (column.length > 0) {
                const topCard = column[column.length - 1];
                if (topCard.faceUp) {
                    playable.push({ ...topCard, source: 'tableau', colIndex });
                }
            }
        });
        
        // Waste pile card
        if (this.waste && this.waste.faceUp) {
            playable.push({ ...this.waste, source: 'waste' });
        }
        
        return playable;
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
        
        // Create foundation stack
        this.foundations[card.categoryId] = {
            category: card,
            words: []
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
        
        // Validate word belongs to category
        // In Associations: Wrong match costs a move but doesn't sort the card
        if (card.categoryId !== categoryId) {
            this.movesRemaining--; // Move penalty for wrong guess
            
            // Get the correct category name for feedback
            const correctCategory = PhysicsCategories.find(c => c.id === card.categoryId);
            const attemptedCategory = PhysicsCategories.find(c => c.id === categoryId);
            
            return { 
                success: false, 
                message: `Wrong! "${card.word}" belongs to ${correctCategory.name}, not ${attemptedCategory.name}. -1 move`,
                correctCategory: correctCategory.name
            };
        }
        
        // Correct match - remove from source and add to foundation
        this.removeCardFromSource(card);
        this.foundations[categoryId].words.push(card);
        this.score += card.points;
        
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
     */
    removeCardFromSource(card) {
        if (card.source === 'waste') {
            this.waste = null;
        } else if (card.source === 'tableau') {
            this.tableau[card.colIndex].pop();
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
        
        // Loss: No valid moves available
        const playable = this.getPlayableCards();
        const hasCategory = playable.some(c => c.type === 'category');
        const hasValidWord = playable.some(c => 
            c.type === 'word' && this.placedCategories.includes(c.categoryId)
        );
        
        if (!hasCategory && !hasValidWord && this.stockPile.length === 0) {
            this.gameState = 'lost';
        }
    }

    /**
     * Get strategic hint following Associations gameplay tips
     * Priority: 1) Use tableau cards, 2) Reveal hidden cards, 3) Draw from stock
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
        const tableauWords = playable.filter(c => 
            c.type === 'word' && 
            c.source === 'tableau' &&
            this.placedCategories.includes(c.categoryId)
        );
        
        if (tableauWords.length > 0) {
            const word = tableauWords[0];
            const category = PhysicsCategories.find(c => c.id === word.categoryId);
            return {
                type: 'word',
                message: `Sort "${word.word}" to ${category.name} (reveals hidden cards)`,
                card: word,
                targetCategory: category,
                priority: 'high'
            };
        }
        
        // PRIORITY 3: Sort waste words (if no tableau moves)
        const wasteWords = playable.filter(c => 
            c.type === 'word' && 
            c.source === 'waste' &&
            this.placedCategories.includes(c.categoryId)
        );
        
        if (wasteWords.length > 0) {
            const word = wasteWords[0];
            const category = PhysicsCategories.find(c => c.id === word.categoryId);
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
     */
    countWordsForCategory(categoryId) {
        const tableauWords = this.tableau.flat().filter(c => 
            c.type === 'word' && c.categoryId === categoryId
        );
        const wasteWords = (this.waste && this.waste.type === 'word' && this.waste.categoryId === categoryId) ? 1 : 0;
        const stockWords = this.stockPile.filter(c => 
            c.type === 'word' && c.categoryId === categoryId
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
