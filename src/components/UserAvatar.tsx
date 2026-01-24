import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { getInitials } from '@/utils/getInitials';

interface UserAvatarProps {
  /** User's full name */
  name: string;
  /** URL to user's profile picture */
  avatarUrl?: string | null;
  /** Avatar size in pixels (default: 44) */
  size?: number;
  /** Optional background color (defaults to primaryAccent) */
  backgroundColor?: string;
  /** Optional additional styles */
  style?: ViewStyle;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 44,
  backgroundColor = Colors.primaryAccent,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = avatarUrl && !imageError;
  const initials = getInitials(name);
  const displayText = initials || '🙂';
  const fontSize = Math.max(size * 0.35, 12);

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (hasValidImage) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            // Emoji doesn't need bold weight
            fontWeight: initials ? '800' : '400',
          },
        ]}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
