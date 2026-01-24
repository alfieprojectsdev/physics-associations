import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FoundationState, CategoryCard } from '../types/game';
import { Card } from './Card';
import { CARD_WIDTH, CARD_HEIGHT, COLORS } from '../constants/layout';

interface FoundationProps {
  foundation?: FoundationState;
  onPress?: () => void;
}

export const Foundation: React.FC<FoundationProps> = ({ foundation, onPress }) => {
  if (!foundation) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>CAT</Text>
      </View>
    );
  }

  const { category, words, capacity, isLocked } = foundation;
  const topCard = words.length > 0 ? words[words.length - 1] : category;

  // We can overlay a badge for count/progress
  return (
    <View style={styles.container}>
      <Card card={topCard} onPress={() => onPress?.()} />
      <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{words.length}/{capacity}</Text>
      </View>
      {isLocked && (
          <View style={styles.lockOverlay}>
              <Text style={styles.lockText}>👑</Text>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  emptyContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
    fontSize: 10,
  },
  badgeContainer: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: COLORS.primary,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      zIndex: 10,
  },
  badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
  },
  lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5,
  },
  lockText: {
      fontSize: 24,
  }
});
