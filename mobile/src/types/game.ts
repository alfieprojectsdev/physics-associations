export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type CategoryId = string;
export type DomainId = 'physics' | 'chemistry' | 'computer-science' | 'biology' | 'mathematics';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface BaseWordData {
  word: string;
  difficulty: Difficulty;
  points: number;
  type?: 'word' | 'symbol' | 'acronym';
  definition?: string;
  isVector?: boolean;
}

export interface WordData extends BaseWordData {
  // If undefined, implies it belongs to the parent category key in the dictionary
  validCategories?: CategoryId[];
  isAmbiguous?: boolean;
}

export interface DomainData {
  name: string;
  icon: string;
  description: string;
  categories: Category[];
  words: Record<CategoryId, WordData[]>;
  abbreviations: Record<string, string>;
  ambiguousSymbols: WordData[];
}

export interface Card {
  id: string;
  faceUp: boolean;
  source?: 'tableau' | 'waste' | 'stock' | 'foundation';
  colIndex?: number;
  cardIndex?: number;
  // Visual properties
  rotation?: number;
}

export interface CategoryCard extends Card {
  type: 'category';
  categoryId: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface WordCard extends Card {
  type: 'word';
  word: string;
  points: number;
  difficulty: Difficulty;
  validCategories: CategoryId[];
  isVector?: boolean;
  isAmbiguous?: boolean;
  definition?: string;
}

export type AnyCard = CategoryCard | WordCard;

export interface Deck {
  categoryCards: CategoryCard[];
  wordCards: WordCard[];
}

export interface FoundationState {
  category: CategoryCard;
  words: WordCard[];
  capacity: number;
  isLocked: boolean;
}

export type GameState = 'ready' | 'playing' | 'won' | 'lost';

export interface GameStateSnapshot {
  level: number;
  score: number;
  movesRemaining: number;
  maxMoves: number;
  tableau: AnyCard[][];
  stockCount: number;
  waste: AnyCard[]; // Top is last
  foundations: Record<CategoryId, FoundationState>;
  placedCategories: CategoryId[];
  gameState: GameState;
  currentDomain: DomainId;
}

export interface MoveResult {
  success: boolean;
  message: string;
  card?: AnyCard;
  points?: number;
}
