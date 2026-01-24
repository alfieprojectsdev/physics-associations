import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useGameEngine } from '../hooks/useGameEngine';
import { Foundation } from '../components/Foundation';
import { Column } from '../components/Column';
import { StockWaste } from '../components/StockWaste';
import { COLORS, CARD_WIDTH } from '../constants/layout';
import { AnyCard } from '../types/game';

const GameScreen = () => {
  const { gameState, actions } = useGameEngine('physics');
  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);

  const handleCardPress = (card: AnyCard) => {
    // Logic for interactions
    if (card.type === 'category') {
      // Try to place category immediately
      const result = actions.placeCategory(card.id);
      if (!result.success) {
        Alert.alert('Info', result.message);
      }
      setSelectedCard(null);
      return;
    }

    // Word card logic
    if (selectedCard?.id === card.id) {
        setSelectedCard(null); // Deselect
    } else {
        setSelectedCard(card);
    }
  };

  const handleFoundationPress = (categoryId: string) => {
      if (!selectedCard) return;

      if (selectedCard.type === 'word') {
          const result = actions.sortWord(selectedCard.id, categoryId);
          if (result.success) {
              setSelectedCard(null);
          } else {
              Alert.alert('Move Failed', result.message);
          }
      }
  };

  const handleDraw = () => {
      const result = actions.drawFromStock();
      if (!result.success) {
          Alert.alert('Info', result.message);
      }
      setSelectedCard(null);
  };

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text style={styles.headerLabel}>LEVEL</Text>
            <Text style={styles.headerValue}>{gameState.level}</Text>
        </View>
        <View>
            <Text style={styles.headerLabel}>SCORE</Text>
            <Text style={styles.headerValue}>{gameState.score}</Text>
        </View>
        <View>
            <Text style={styles.headerLabel}>MOVES</Text>
            <Text style={[styles.headerValue, { color: COLORS.warning }]}>{gameState.movesRemaining}</Text>
        </View>
      </View>

      <View style={styles.foundationsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foundationsContent}>
            {gameState.placedCategories.map(catId => (
                <View key={catId} style={styles.foundationWrapper}>
                    <Foundation
                        foundation={gameState.foundations[catId]}
                        onPress={() => handleFoundationPress(catId)}
                    />
                </View>
            ))}
            {/* Placeholder for next category if needed, or just showing placed ones */}
            {gameState.placedCategories.length === 0 && (
                <View style={styles.instructionBox}>
                    <Text style={styles.instructionText}>Place Category Cards Here</Text>
                </View>
            )}
        </ScrollView>
      </View>

      <View style={styles.boardContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableauContent}>
            {gameState.tableau.map((column, index) => (
                <View key={index} style={styles.columnWrapper}>
                    <Column
                        cards={column}
                        colIndex={index}
                        onCardPress={handleCardPress}
                    />
                </View>
            ))}
        </ScrollView>
      </View>

      <View style={styles.controlsContainer}>
        <StockWaste
            stockCount={gameState.stockCount}
            wasteTop={gameState.waste.length > 0 ? gameState.waste[gameState.waste.length - 1] : null}
            onDraw={handleDraw}
            onWastePress={handleCardPress}
        />
        {selectedCard && (
            <View style={styles.selectionInfo}>
                <Text style={styles.selectionText}>Selected: {selectedCard.type === 'word' ? selectedCard.word : selectedCard.name}</Text>
            </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3d0f', // Dark green background
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  headerValue: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  foundationsContainer: {
      height: 140, // Adjust based on card height
      paddingVertical: 10,
  },
  foundationsContent: {
      paddingHorizontal: 10,
      gap: 10,
  },
  foundationWrapper: {
      marginRight: 10,
  },
  instructionBox: {
      width: 200,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      borderRadius: 8,
      borderStyle: 'dashed',
  },
  instructionText: {
      color: 'rgba(255,255,255,0.5)',
  },
  boardContainer: {
      flex: 1,
  },
  tableauContent: {
      paddingHorizontal: 10,
      gap: 10,
  },
  columnWrapper: {
      marginRight: 10,
  },
  controlsContainer: {
      height: 120,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 10,
  },
  selectionInfo: {
      position: 'absolute',
      right: 20,
      top: 20,
  },
  selectionText: {
      fontWeight: 'bold',
      color: COLORS.primary,
  }
});

export default GameScreen;
