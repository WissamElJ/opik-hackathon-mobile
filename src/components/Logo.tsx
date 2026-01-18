import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const SIZES = {
  small: {
    barWidth: 10,
    middleBarHeight: 42,
    gap: 5,
    borderRadius: 5,
    fontSize: 18,
    textMargin: 8,
  },
  medium: {
    barWidth: 14,
    middleBarHeight: 56,
    gap: 6,
    borderRadius: 7,
    fontSize: 24,
    textMargin: 12,
  },
  large: {
    barWidth: 20,
    middleBarHeight: 90,
    gap: 10,
    borderRadius: 10,
    fontSize: 36,
    textMargin: 20,
  },
};

export const Logo: React.FC<LogoProps> = ({ size = 'large', showText = true }) => {
  const config = SIZES[size];
  const sideBarHeight = config.middleBarHeight * 0.55;

  return (
    <View style={styles.container}>
      <View style={[styles.barsContainer, { gap: config.gap }]}>
        {/* Left bar - shorter */}
        <View
          style={[
            styles.bar,
            {
              width: config.barWidth,
              height: sideBarHeight,
              borderRadius: config.borderRadius,
            },
          ]}
        />
        {/* Middle bar - taller */}
        <View
          style={[
            styles.bar,
            {
              width: config.barWidth,
              height: config.middleBarHeight,
              borderRadius: config.borderRadius,
            },
          ]}
        />
        {/* Right bar - shorter */}
        <View
          style={[
            styles.bar,
            {
              width: config.barWidth,
              height: sideBarHeight,
              borderRadius: config.borderRadius,
            },
          ]}
        />
      </View>
      {showText && (
        <Text
          style={[
            styles.logoText,
            { fontSize: config.fontSize, marginTop: config.textMargin },
          ]}
        >
          Paramis
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: Colors.primaryAccent,
  },
  logoText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
