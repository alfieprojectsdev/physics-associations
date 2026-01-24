import {
  GameStateSnapshot,
  GameEngine as IGameEngine,
  Card,
  CategoryCard,
  WordCard,
  Deck,
  MoveResult,
  FoundationState,
  GameState,
  DomainId,
  CategoryId,
  AnyCard,
  Difficulty
} from '../types/game';
import { DOMAIN_DATA, DIFFICULTY_CONFIG } from '../data/vocabulary';

// Helper functions
function normalizeCardData(card: any): void {
  // In TS, we ensure the data is correct at creation, so this might be less relevant,
  // but we keep the logic: ensure validCategories is array.
  if (!card.validCategories) {
    card.validCategories = [];
  }
}

function checkMatch(card: WordCard, targetCategory: CategoryId): boolean {
  return card.validCategories && card.validCategories.includes(targetCategory);
}

function getValidCategories(card: WordCard): CategoryId[] {
  return card.validCategories || [];
}

export class GameEngine {
  private level: number = 1;
  private maxMoves: number = 0;
  private movesRemaining: number = 0;
  private score: number = 0;

  private tableau: AnyCard[][] = [];
  private stockPile: AnyCard[] = [];
  private waste: AnyCard[] = [];

  private foundations: Record<CategoryId, FoundationState> = {};
  private placedCategories: CategoryId[] = [];

  private gameState: GameState = 'ready';
  private currentDomain: DomainId = 'physics';

  constructor(domain: DomainId = 'physics') {
    this.currentDomain = domain;
  }

  public initLevel(level: number = 1): void {
    this.level = level;
    const deck = this.generateLevelDeck(level);

    const totalCards = deck.categoryCards.length + deck.wordCards.length;
    this.maxMoves = Math.floor(totalCards * 1.5) + 10;
    this.movesRemaining = this.maxMoves;

    this.score = 0;
    this.foundations = {};
    this.placedCategories = [];
    this.waste = [];

    this.createTableauLayout(deck);
    this.gameState = 'playing';
  }

  private generateLevelDeck(level: number): Deck {
    const domainData = DOMAIN_DATA[this.currentDomain];
    const deck: Deck = { categoryCards: [], wordCards: [] };

    const numCategories = Math.min(
      DIFFICULTY_CONFIG.minCategories + Math.floor(level / DIFFICULTY_CONFIG.categoryIncreaseRate),
      DIFFICULTY_CONFIG.maxCategories
    );

    const shuffledCategories = [...domainData.categories]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCategories);

    const activeCategoryIds = shuffledCategories.map(c => c.id);

    // Create Category Cards
    shuffledCategories.forEach(cat => {
      deck.categoryCards.push({
        id: `cat-${cat.id}`,
        type: 'category',
        categoryId: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        faceUp: false
      });
    });

    // Create Word Cards
    shuffledCategories.forEach(cat => {
      const categoryWords = domainData.words[cat.id] || [];
      const wordsPerCategory = Math.min(
        DIFFICULTY_CONFIG.minWordsPerCategory + level,
        DIFFICULTY_CONFIG.maxWordsPerCategory
      );

      let availableWords = categoryWords;
      if (level <= DIFFICULTY_CONFIG.easyMaxLevel) {
        availableWords = categoryWords.filter(w => w.difficulty === 'basic');
      } else if (level <= DIFFICULTY_CONFIG.intermediateMaxLevel) {
        availableWords = categoryWords.filter(w => w.difficulty === 'basic' || w.difficulty === 'intermediate');
      }

      const selectedWords = [...availableWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, wordsPerCategory);

      selectedWords.forEach((wordData, index) => {
        const validCategories = wordData.validCategories || [cat.id];

        const card: WordCard = {
          id: `word-${cat.id}-${index}-${Date.now()}-${Math.random()}`,
          type: 'word',
          word: wordData.word,
          points: wordData.points,
          difficulty: wordData.difficulty,
          validCategories: validCategories,
          isVector: wordData.isVector,
          isAmbiguous: wordData.isAmbiguous,
          definition: wordData.definition,
          faceUp: false
        };
        deck.wordCards.push(card);
      });
    });

    // Ambiguous Symbols
    if (domainData.ambiguousSymbols) {
      domainData.ambiguousSymbols.forEach((symbolData, index) => {
        const validCats = symbolData.validCategories || [];
        const isRelevant = validCats.some(cid => activeCategoryIds.includes(cid));

        if (isRelevant) {
           let shouldInclude = false;
           if (level <= DIFFICULTY_CONFIG.easyMaxLevel) {
               shouldInclude = symbolData.difficulty === 'basic';
           } else if (level <= DIFFICULTY_CONFIG.intermediateMaxLevel) {
               shouldInclude = symbolData.difficulty === 'basic' || symbolData.difficulty === 'intermediate';
           } else {
               shouldInclude = true;
           }

           if (shouldInclude) {
             const card: WordCard = {
               id: `ambiguous-${index}-${Date.now()}`,
               type: 'word',
               word: symbolData.word,
               points: symbolData.points,
               difficulty: symbolData.difficulty,
               validCategories: validCats,
               isAmbiguous: true,
               definition: symbolData.definition,
               faceUp: false
             };
             deck.wordCards.push(card);
           }
        }
      });
    }

    // Shuffle words
    deck.wordCards.sort(() => Math.random() - 0.5);
    return deck;
  }

  private createTableauLayout(deck: Deck): void {
    this.tableau = [];
    const allCards: AnyCard[] = [...deck.categoryCards, ...deck.wordCards];

    // Shuffle all cards together before dealing
    allCards.sort(() => Math.random() - 0.5);

    const numColumns = Math.min(3 + Math.floor(this.level / 2), 5);
    const stockCount = Math.floor(allCards.length * 0.3);

    // Create stock pile
    this.stockPile = allCards.slice(0, stockCount).map(card => ({
      ...card,
      faceUp: false,
      source: 'stock'
    }));

    const tableauCards = allCards.slice(stockCount);
    const cardsPerColumn = Math.ceil(tableauCards.length / numColumns);

    for (let col = 0; col < numColumns; col++) {
      const column: AnyCard[] = [];
      const start = col * cardsPerColumn;
      const end = Math.min(start + cardsPerColumn, tableauCards.length);

      for (let i = start; i < end; i++) {
        const card = tableauCards[i];
        const positionFromBottom = (end - i);

        card.faceUp = positionFromBottom <= 2;
        card.column = col;
        card.source = 'tableau';
        // card.position = i - start; // Not strictly needed in TS obj if generic

        column.push(card);
      }
      this.tableau.push(column);
    }
  }

  public getPlayableCards(): AnyCard[] {
    const allPlayable: AnyCard[] = [];

    // All face-up cards from tableau
    this.tableau.forEach((column, colIndex) => {
      column.forEach((card, cardIndex) => {
        if (card.faceUp) {
          allPlayable.push({ ...card, source: 'tableau', colIndex, cardIndex });
        }
      });
    });

    // Top waste card
    if (this.waste.length > 0) {
      const topWaste = this.waste[this.waste.length - 1];
      allPlayable.unshift({ ...topWaste, source: 'waste' });
    }

    const MAX_EXPOSED = 4;
    return allPlayable.slice(0, MAX_EXPOSED); // TODO: Revisit this limit for mobile UI?
  }

  public getCardById(id: string): AnyCard | undefined {
      // Search everywhere
      for(const col of this.tableau) {
          const c = col.find(x => x.id === id);
          if(c) return c;
      }
      if (this.waste.length > 0 && this.waste[this.waste.length-1].id === id) return this.waste[this.waste.length-1];
      // Stock is not playable directly usually
      return undefined;
  }

  public placeCategory(cardId: string): MoveResult {
    // Find card in tableau or waste
    let card: AnyCard | undefined;
    let source: 'tableau' | 'waste' | undefined;
    let colIndex: number = -1;

    // Check waste
    if (this.waste.length > 0 && this.waste[this.waste.length - 1].id === cardId) {
        card = this.waste[this.waste.length - 1];
        source = 'waste';
    } else {
        // Check tableau
        for(let c = 0; c < this.tableau.length; c++) {
            const found = this.tableau[c].find(x => x.id === cardId);
            if (found && found.faceUp) {
                card = found;
                source = 'tableau';
                colIndex = c;
                break;
            }
        }
    }

    if (!card || card.type !== 'category') {
      return { success: false, message: 'Invalid category card' };
    }

    if (this.placedCategories.includes(card.categoryId)) {
      return { success: false, message: 'Category already placed' };
    }

    this.removeCardFromSource(card.id, source!, colIndex);

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

    return { success: true, message: `${card.name} category placed!`, card };
  }

  public sortWord(wordCardId: string, targetCategoryId: CategoryId): MoveResult {
    // Locate card
    let card: AnyCard | undefined;
    let source: 'tableau' | 'waste' | undefined;
    let colIndex: number = -1;

     // Check waste
     if (this.waste.length > 0 && this.waste[this.waste.length - 1].id === wordCardId) {
        card = this.waste[this.waste.length - 1];
        source = 'waste';
    } else {
        // Check tableau
        for(let c = 0; c < this.tableau.length; c++) {
            const found = this.tableau[c].find(x => x.id === wordCardId);
            if (found && found.faceUp) {
                card = found;
                source = 'tableau';
                colIndex = c;
                break;
            }
        }
    }

    if (!card || card.type !== 'word') {
      return { success: false, message: 'Invalid word card' };
    }

    if (!this.placedCategories.includes(targetCategoryId)) {
      return { success: false, message: 'Place that category card first!' };
    }

    const foundation = this.foundations[targetCategoryId];
    if (foundation.isLocked) {
      this.movesRemaining--;
      return { success: false, message: 'Pile is locked!' };
    }

    if (foundation.words.length >= foundation.capacity) {
      this.movesRemaining--;
      return { success: false, message: 'Pile is full!' };
    }

    if (!checkMatch(card, targetCategoryId)) {
      this.movesRemaining--;
      return { success: false, message: 'Wrong category! -1 move' };
    }

    // Success
    this.removeCardFromSource(card.id, source!, colIndex);
    this.foundations[targetCategoryId].words.push(card);
    this.score += card.points;

    if (this.foundations[targetCategoryId].words.length >= this.foundations[targetCategoryId].capacity) {
      this.foundations[targetCategoryId].isLocked = true;
    }

    this.movesRemaining--;
    this.revealCards();
    this.checkGameState();

    return { success: true, message: `Sorted! +${card.points}`, points: card.points };
  }

  public drawFromStock(): MoveResult {
    if (this.stockPile.length === 0) {
      if (this.waste.length === 0) {
        return { success: false, message: 'No more cards!' };
      }
      return this.recycleWaste();
    }

    const card = this.stockPile.pop();
    if (card) {
      card.faceUp = true;
      card.source = 'waste';
      this.waste.push(card);
      this.movesRemaining--;
      return { success: true, message: 'Card drawn', card };
    }
    return { success: false, message: 'Error drawing card' };
  }

  private recycleWaste(): MoveResult {
    this.stockPile = this.waste.reverse().map(c => ({...c, faceUp: false, source: 'stock'}));
    this.waste = [];
    this.movesRemaining--;
    return { success: true, message: 'Stockpile recycled' };
  }

  public moveBetweenColumns(fromColIndex: number, toColIndex: number): MoveResult {
    const fromCol = this.tableau[fromColIndex];
    const toCol = this.tableau[toColIndex];

    if (fromCol.length === 0) {
      return { success: false, message: 'Source column empty' };
    }

    const card = fromCol[fromCol.length - 1];
    if (!card.faceUp) return { success: false, message: 'Card not face up' };

    fromCol.pop();
    toCol.push(card);
    card.colIndex = toColIndex; // update tracking

    this.movesRemaining--;
    this.revealCards();
    return { success: true, message: 'Card moved' };
  }

  private removeCardFromSource(id: string, source: 'tableau' | 'waste', colIndex: number): void {
    if (source === 'waste') {
      this.waste.pop();
    } else if (source === 'tableau') {
      const column = this.tableau[colIndex];
      const idx = column.findIndex(c => c.id === id);
      if (idx !== -1) {
        column.splice(idx, 1);
      }
    }
  }

  private revealCards(): void {
    this.tableau.forEach(col => {
      if (col.length > 0) {
        const top = col[col.length - 1];
        if (!top.faceUp) top.faceUp = true;
      }
    });
  }

  private checkGameState(): void {
    const totalSorted = Object.values(this.foundations).reduce((sum, f) => sum + f.words.length, 0);
    const totalCards = this.tableau.flat().length + this.waste.length + this.stockPile.length;

    // Note: totalCards includes categories too?
    // Wait, original logic checked word count.
    const totalWordsInPlay = this.tableau.flat().filter(c => c.type === 'word').length
      + this.waste.filter(c => c.type === 'word').length
      + this.stockPile.filter(c => c.type === 'word').length;

    if (totalWordsInPlay === 0 && totalSorted > 0) {
      this.gameState = 'won';
    } else if (this.movesRemaining <= 0) {
      this.gameState = 'lost';
    }
    // Dead board detection omitted for brevity in PoC, but should be here.
  }

  private countWordsForCategory(categoryId: CategoryId): number {
    // Count words in tableau, waste, and stock that match this category
    let count = 0;

    const countInList = (list: AnyCard[]) => {
      list.forEach(c => {
        if (c.type === 'word' && checkMatch(c as WordCard, categoryId)) {
          count++;
        }
      });
    };

    this.tableau.forEach(col => countInList(col));
    countInList(this.waste);
    countInList(this.stockPile);

    return count;
  }

  public getGameStateSnapshot(): GameStateSnapshot {
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
      gameState: this.gameState,
      currentDomain: this.currentDomain
    };
  }
}
