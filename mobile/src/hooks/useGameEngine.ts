import { useState, useRef, useCallback, useEffect } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { GameStateSnapshot, MoveResult, DomainId } from '../types/game';

export const useGameEngine = (initialDomain: DomainId = 'physics') => {
  const engineRef = useRef<GameEngine>(new GameEngine(initialDomain));
  const [gameState, setGameState] = useState<GameStateSnapshot>(
    engineRef.current.getGameStateSnapshot()
  );

  const updateState = useCallback(() => {
    setGameState(engineRef.current.getGameStateSnapshot());
  }, []);

  useEffect(() => {
    engineRef.current.initLevel(1);
    updateState();
  }, []);

  const initLevel = useCallback((level: number) => {
    engineRef.current.initLevel(level);
    updateState();
  }, [updateState]);

  const placeCategory = useCallback((cardId: string): MoveResult => {
    const result = engineRef.current.placeCategory(cardId);
    updateState();
    return result;
  }, [updateState]);

  const sortWord = useCallback((wordCardId: string, targetCategoryId: string): MoveResult => {
    const result = engineRef.current.sortWord(wordCardId, targetCategoryId);
    updateState();
    return result;
  }, [updateState]);

  const drawFromStock = useCallback((): MoveResult => {
    const result = engineRef.current.drawFromStock();
    updateState();
    return result;
  }, [updateState]);

  const moveBetweenColumns = useCallback((fromCol: number, toCol: number): MoveResult => {
    const result = engineRef.current.moveBetweenColumns(fromCol, toCol);
    updateState();
    return result;
  }, [updateState]);

  return {
    gameState,
    actions: {
      initLevel,
      placeCategory,
      sortWord,
      drawFromStock,
      moveBetweenColumns
    }
  };
};
