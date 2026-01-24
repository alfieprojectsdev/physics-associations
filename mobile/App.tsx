import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GameScreen />
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
