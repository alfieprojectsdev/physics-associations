import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { AnyCard } from '../types/game';
import { CARD_WIDTH, CARD_HEIGHT, COLORS } from '../constants/layout';

interface CardProps {
  card: AnyCard;
  onPress?: (card: AnyCard) => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ card, onPress, style }) => {
  const rotation = useSharedValue(card.faceUp ? 0 : 180);

  useEffect(() => {
    rotation.value = withTiming(card.faceUp ? 0 : 180, { duration: 400 });
  }, [card.faceUp]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      zIndex: rotation.value < 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [180, 360], Extrapolate.CLAMP);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      zIndex: rotation.value > 90 ? 1 : 0,
    };
  });

  const renderFront = () => {
    if (card.type === 'category') {
      return (
        <View style={[styles.face, styles.categoryFace]}>
          <Text style={styles.categoryIcon}>{card.icon}</Text>
          <Text style={styles.categoryName} numberOfLines={2}>{card.name}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.face, styles.wordFace]}>
        <View style={styles.header}>
            <Text style={styles.headerText}>{card.word.substring(0, 3)}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{card.points}</Text>
            </View>
        </View>
        <View style={styles.body}>
            <Text style={styles.wordText}>{card.word}</Text>
            {card.isVector && <Text style={styles.vectorArrow}>→</Text>}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress?.(card)} style={[styles.container, style]}>
       <View style={styles.cardWrapper}>
        <Animated.View style={[styles.cardFace, styles.faceFront, frontAnimatedStyle]}>
            {renderFront()}
        </Animated.View>
        <Animated.View style={[styles.cardFace, styles.faceBack, backAnimatedStyle]}>
            <View style={[styles.face, styles.backFace]}>
                <Text style={styles.backIcon}>⚛️</Text>
            </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardWrapper: {
    flex: 1,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.cardBg,
  },
  faceFront: {
    // Front styling
  },
  faceBack: {
    // Back styling
  },
  face: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 4,
  },
  backFace: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  backIcon: {
      fontSize: 24,
      opacity: 0.5
  },
  categoryFace: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
      fontSize: 28,
      marginBottom: 4,
  },
  categoryName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 10,
      textAlign: 'center',
  },
  wordFace: {
      backgroundColor: '#fff',
      justifyContent: 'space-between',
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  headerText: {
      fontSize: 10,
      color: COLORS.textLight,
      fontWeight: '700',
      textTransform: 'uppercase',
  },
  badge: {
      backgroundColor: COLORS.warning,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
  },
  badgeText: {
      fontSize: 8,
      color: '#fff',
      fontWeight: 'bold',
  },
  body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  wordText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: COLORS.textDark,
      textAlign: 'center',
  },
  vectorArrow: {
      position: 'absolute',
      top: '30%',
      fontSize: 10,
      color: COLORS.textDark,
  }
});
