import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AnyCard } from '../types/game';
import { Card } from './Card';
import { CARD_WIDTH, OVERLAP_HEIGHT } from '../constants/layout';

interface ColumnProps {
  cards: AnyCard[];
  colIndex: number;
  onCardPress: (card: AnyCard) => void;
}

export const Column: React.FC<ColumnProps> = ({ cards, colIndex, onCardPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      {cards.map((card, index) => (
        <View
            key={card.id}
            style={[
                styles.cardContainer,
                { top: index * OVERLAP_HEIGHT, zIndex: index + 1 }
            ]}
        >
            <Card card={card} onPress={onCardPress} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    // Minimum height to act as a drop zone (to be implemented later)
    minHeight: 200,
    position: 'relative',
  },
  placeholder: {
      position: 'absolute',
      top: 0,
      width: CARD_WIDTH,
      height: CARD_WIDTH * 1.5,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.2)',
      borderRadius: 8,
      borderStyle: 'dashed',
  },
  cardContainer: {
      position: 'absolute',
      left: 0,
  }
});
