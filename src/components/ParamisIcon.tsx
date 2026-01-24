import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ParamisIconProps {
  size?: 'tiny' | 'small' | 'medium';
}

const SIZES = {
  tiny: {
    barWidth: 3,
    middleBarHeight: 12,
    gap: 2,
    borderRadius: 2,
  },
  small: {
    barWidth: 4,
    middleBarHeight: 16,
    gap: 2,
    borderRadius: 2,
  },
  medium: {
    barWidth: 5,
    middleBarHeight: 20,
    gap: 3,
    borderRadius: 3,
  },
};

export const ParamisIcon: React.FC<ParamisIconProps> = ({ size = 'small' }) => {
  const config = SIZES[size];
  const sideBarHeight = config.middleBarHeight * 0.55;

  return (
    <View style={[styles.container, { gap: config.gap }]}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: Colors.textPrimary,
  },
});

export default ParamisIcon;
