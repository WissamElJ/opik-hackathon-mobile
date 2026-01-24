import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { MockProfile } from '@/data/mockProfiles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchOverlayProps {
  visible: boolean;
  profile: MockProfile | null;
  onClose: () => void;
  onSendMessage: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
  visible,
  profile,
  onClose,
  onSendMessage,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const avatarLeftAnim = useRef(new Animated.Value(-100)).current;
  const avatarRightAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      heartScale.setValue(0);
      avatarLeftAnim.setValue(-100);
      avatarRightAnim.setValue(100);

      // Start sequence
      Animated.sequence([
        // Avatars slide in
        Animated.parallel([
          Animated.spring(avatarLeftAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 12,
            bounciness: 8,
          }),
          Animated.spring(avatarRightAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 12,
            bounciness: 8,
          }),
        ]),
        // Heart pops
        Animated.spring(heartScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 12,
        }),
        // Content fades in
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 10,
          bounciness: 5,
        }),
      ]).start();
    }
  }, [visible]);

  if (!profile) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.95)', 'rgba(99, 102, 241, 0.95)', 'rgba(236, 72, 153, 0.95)']}
        style={styles.overlay}
      >
        {/* Avatars */}
        <View style={styles.avatarsContainer}>
          <Animated.View
            style={[
              styles.avatar,
              styles.userAvatar,
              { transform: [{ translateX: avatarLeftAnim }] },
            ]}
          >
            <Text style={styles.avatarEmoji}>👨‍🦳</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.heartContainer,
              { transform: [{ scale: heartScale }] },
            ]}
          >
            <Ionicons name="heart" size={48} color="#FF6B9D" />
          </Animated.View>

          <Animated.View
            style={[
              styles.avatar,
              { backgroundColor: profile.avatarColor, transform: [{ translateX: avatarRightAnim }] },
            ]}
          >
            <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
          </Animated.View>
        </View>

        {/* Match Text */}
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSubtitle}>
            You and {profile.name} liked each other
          </Text>

          {/* Buttons */}
          <TouchableOpacity style={styles.messageButton} onPress={onSendMessage}>
            <Ionicons name="chatbubble" size={20} color={Colors.textPrimary} />
            <Text style={styles.messageButtonText}>Send a Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Confetti effect placeholder */}
        <View style={styles.confettiContainer}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.confetti,
                {
                  left: Math.random() * SCREEN_WIDTH,
                  top: Math.random() * 200,
                  backgroundColor: ['#FF6B9D', '#4ECDC4', '#FFE66D', '#8B5CF6', '#FF6B6B'][i % 5],
                  transform: [{ rotate: `${Math.random() * 360}deg` }],
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.textPrimary,
  },
  userAvatar: {
    backgroundColor: '#E0E0E0',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  heartContainer: {
    marginHorizontal: -15,
    zIndex: 10,
    backgroundColor: Colors.textPrimary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  matchSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 10,
    marginBottom: 16,
  },
  messageButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  keepSwipingButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  keepSwipingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

export default MatchOverlay;
