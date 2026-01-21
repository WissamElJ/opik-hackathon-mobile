import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import Ionicons  from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const TAB_BAR_HEIGHT = 70;
const TAB_BAR_PADDING = 10;
const TAB_ICON_SIZE = 26;
const ACTIVE_INDICATOR_SIZE = TAB_BAR_HEIGHT - (TAB_BAR_PADDING * 2); // Slightly smaller than bar height

type IconName = 'home' | 'waveform' | 'friends' | 'settings';

const getIconComponent = (name: IconName, color: string, size: number) => {
  switch (name) {
    case 'home':
      // Pentagon shape for geometric style
      return <MaterialCommunityIcons name="pentagon" size={size} color={color} />;
    case 'waveform':
      return <MaterialIcons name="multitrack-audio" size={size} color={color} />;
    case 'friends':
      return <Ionicons name="people" size={size} color={color} />;
    case 'settings':
      return <Ionicons name="settings-outline" size={size} color={color} />;
    default:
      return <MaterialCommunityIcons name="pentagon" size={size} color={color} />;
  }
};

const getIconName = (routeName: string): IconName => {
  switch (routeName) {
    case 'home':
      return 'home';
    case 'audio':
      return 'waveform';
    case 'friends':
      return 'friends';
    case 'settings':
      return 'settings';
    default:
      return 'home';
  }
};

interface TabButtonProps {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  iconName: IconName;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  isFocused,
  onPress,
  onLongPress,
  iconName,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          isFocused && styles.activeIconContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {getIconComponent(
          iconName,
          isFocused ? Colors.textPrimary : Colors.tabBarInactive,
          TAB_ICON_SIZE
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const tabBarWidth = screenWidth * 0.9; // 90% of screen width

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, 24),
          left: (screenWidth - tabBarWidth) / 2,
          width: tabBarWidth,
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              iconName={getIconName(route.name)}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 35,
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around', // Spread icons evenly
    paddingHorizontal: TAB_BAR_PADDING, // Internal padding so active indicator doesn't touch edges
    paddingVertical: TAB_BAR_PADDING,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, // Extra horizontal spacing between icons
  },
  iconContainer: {
    width: ACTIVE_INDICATOR_SIZE,
    height: ACTIVE_INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // Squircle rounded square
  },
  activeIconContainer: {
    backgroundColor: Colors.tabBarActive,
  },
});
