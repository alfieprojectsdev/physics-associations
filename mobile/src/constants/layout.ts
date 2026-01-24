import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const CARD_ASPECT_RATIO = 1.5; // height / width
export const CARD_WIDTH = width / 5.5; // 5 columns + padding
export const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT_RATIO;
export const COLUMN_SPACING = 4;
export const OVERLAP_HEIGHT = 25; // How much a card covers the one below it

export const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  cardBg: '#ffffff',
  textDark: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0',
  faceDown: '#4f46e5', // Gradient start roughly
};
