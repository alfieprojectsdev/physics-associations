import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AnyCard } from '../types/game';
import { Card } from './Card';
import { CARD_WIDTH, CARD_HEIGHT, COLORS } from '../constants/layout';

interface StockWasteProps {
  stockCount: number;
  wasteTop: AnyCard | null;
  onDraw: () => void;
  onWastePress: (card: AnyCard) => void;
}

export const StockWaste: React.FC<StockWasteProps> = ({ stockCount, wasteTop, onDraw, onWastePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.pileContainer}>
          <Text style={styles.label}>Stock ({stockCount})</Text>
          {stockCount > 0 ? (
              <TouchableOpacity onPress={onDraw} activeOpacity={0.8}>
                <View style={[styles.cardPlaceholder, styles.stockBack]}>
                    <Text style={styles.stockIcon}>⚛️</Text>
                </View>
              </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={onDraw} activeOpacity={0.8}>
                <View style={styles.emptyPlaceholder}>
                    <Text style={styles.emptyText}>RECYCLE</Text>
                </View>
              </TouchableOpacity>
          )}
      </View>

      <View style={styles.pileContainer}>
          <Text style={styles.label}>Waste</Text>
          {wasteTop ? (
              <Card card={wasteTop} onPress={onWastePress} />
          ) : (
              <View style={styles.emptyPlaceholder}>
                  <Text style={styles.emptyText}>EMPTY</Text>
              </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    padding: 8,
  },
  pileContainer: {
      alignItems: 'center',
      gap: 4,
  },
  label: {
      color: COLORS.textLight,
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
  },
  cardPlaceholder: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 8,
  },
  stockBack: {
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#fff',
  },
  stockIcon: {
      fontSize: 24,
      opacity: 0.5,
  },
  emptyPlaceholder: {
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
      fontSize: 8,
      fontWeight: 'bold',
  }
});
