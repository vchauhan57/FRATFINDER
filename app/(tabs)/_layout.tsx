import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDragging, DraggingProvider } from './DraggingContext';

const activeColor = '#91760d'; // Same color as 'fratch.'

export default function TabLayout() {
  return (
    <DraggingProvider>
      <TabNavigator />
    </DraggingProvider>
  );
}

function TabNavigator() {
  const colorScheme = useColorScheme();
  const tabBarColor = useRef(new Animated.Value(0)).current;
  const { isDragging, swipeDirection } = useDragging();

  useEffect(() => {
    if (isDragging) {
      Animated.timing(tabBarColor, {
        toValue: swipeDirection === 'right' ? 1 : swipeDirection === 'left' ? -1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(tabBarColor, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [isDragging, swipeDirection, tabBarColor]);

  const tabBarBackgroundColor = tabBarColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['#ff0000', '#1a1a1a', '#00ff00'],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: tabBarBackgroundColor }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeColor, // Set active tint color to 'fratch.' color
          headerShown: false,
          tabBarShowLabel: false, // This removes the text labels
          tabBarStyle: {
            backgroundColor: 'transparent', // Make tab bar background transparent for Animated.View to work
          },
          tabBarIconStyle: {
            marginTop: 7.5, // Lower the icons by adding margin to the bottom
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.iconText, { color }]}>F</Text> // Capital 'F' icon
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="message" color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
