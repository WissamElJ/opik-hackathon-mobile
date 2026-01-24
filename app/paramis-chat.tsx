import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { MOCK_PROFILES, MockProfile } from '@/data/mockProfiles';
import { SwipeCard } from '@/components/SwipeCard';
import { ProfilePublicPrompt } from '@/components/ProfilePublicPrompt';
import { MatchOverlay } from '@/components/MatchOverlay';
import { ParamisIcon } from '@/components/ParamisIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Chat message interface
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  hasAction?: boolean;
}

// Mock chat messages
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Hey Karam! 👋',
    isUser: false,
    timestamp: '3 min ago',
  },
  {
    id: '2',
    text: 'I\'ve been analyzing your interests and activities, and I found 3 potential matches that I think you\'d really connect with!',
    isUser: false,
    timestamp: '3 min ago',
  },
  {
    id: '3',
    text: 'They share similar interests in music, travel, and social activities. Would you like to see them?',
    isUser: false,
    timestamp: '3 min ago',
    hasAction: true,
  },
];

// Chat bubble component
const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <View style={[styles.bubbleContainer, message.isUser && styles.userBubbleContainer]}>
      {!message.isUser && (
        <View style={styles.avatarSmall}>
          <ParamisIcon size="tiny" />
        </View>
      )}
      <View style={[styles.bubble, message.isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={styles.bubbleText}>{message.text}</Text>
      </View>
    </View>
  );
};

// Matches card in chat
const MatchesCard: React.FC<{ onPress: () => void; matchCount: number }> = ({ onPress, matchCount }) => {
  return (
    <TouchableOpacity style={styles.matchesCard} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.matchesCardGradient}
      >
        <View style={styles.matchesCardContent}>
          <View style={styles.matchesAvatars}>
            {MOCK_PROFILES.slice(0, 3).map((profile, index) => (
              <View
                key={profile.id}
                style={[
                  styles.matchAvatar,
                  { backgroundColor: profile.avatarColor, marginLeft: index > 0 ? -15 : 0 },
                ]}
              >
                <Text style={styles.matchAvatarEmoji}>{profile.avatarEmoji}</Text>
              </View>
            ))}
          </View>
          <View style={styles.matchesTextContainer}>
            <Text style={styles.matchesTitle}>{matchCount} Potential Matches</Text>
            <Text style={styles.matchesSubtitle}>Tap to view and start matching!</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Action buttons for swipe view
const SwipeActions: React.FC<{
  onSkip: () => void;
  onConnect: () => void;
}> = ({ onSkip, onConnect }) => {
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.actionButton, styles.skipButton]} onPress={onSkip}>
        <Ionicons name="close" size={32} color="#FF6B6B" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.connectButton]} onPress={onConnect}>
        <Ionicons name="checkmark" size={32} color="#4ECDC4" />
      </TouchableOpacity>
    </View>
  );
};

export default function ParamisChatScreen() {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MockProfile | null>(null);
  const [swipedProfiles, setSwipedProfiles] = useState<string[]>([]);

  const handleBack = () => {
    if (isPublic) {
      setIsPublic(false);
    } else {
      router.back();
    }
  };

  const handleMatchesCardPress = () => {
    setShowPrompt(true);
  };

  const handleConfirmPublic = () => {
    setShowPrompt(false);
    setIsPublic(true);
  };

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < MOCK_PROFILES.length) {
      setSwipedProfiles((prev) => [...prev, MOCK_PROFILES[currentIndex].id]);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  }, [currentIndex]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex < MOCK_PROFILES.length) {
      const profile = MOCK_PROFILES[currentIndex];
      setMatchedProfile(profile);
      setSwipedProfiles((prev) => [...prev, profile.id]);
      setTimeout(() => {
        setShowMatch(true);
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    }
  }, [currentIndex]);

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  const handleSendMessage = () => {
    setShowMatch(false);
    // In a real app, navigate to chat with matched user
    console.log('Send message to:', matchedProfile?.name);
  };

  const remainingProfiles = MOCK_PROFILES.filter((p) => !swipedProfiles.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <ParamisIcon size="small" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Paramis</Text>
              <Text style={styles.headerSubtitle}>Your AI Assistant</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        {isPublic ? (
          /* Swipe Cards View */
          <View style={styles.swipeContainer}>
            {remainingProfiles.length > 0 ? (
              <>
                <View style={styles.cardsContainer}>
                  {remainingProfiles
                    .slice(0, 2)
                    .reverse()
                    .map((profile, index) => (
                      <SwipeCard
                        key={profile.id}
                        profile={profile}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        isFirst={index === remainingProfiles.slice(0, 2).length - 1}
                      />
                    ))}
                </View>
                <SwipeActions onSkip={handleSwipeLeft} onConnect={handleSwipeRight} />
              </>
            ) : (
              /* No more profiles */
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="people-outline" size={60} color={Colors.textSecondary} />
                </View>
                <Text style={styles.emptyTitle}>All Caught Up!</Text>
                <Text style={styles.emptySubtitle}>
                  You've seen all the suggested connections for now. Check back later for more!
                </Text>
                <TouchableOpacity style={styles.backToChatButton} onPress={() => setIsPublic(false)}>
                  <Text style={styles.backToChatText}>Back to Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          /* Chat View */
          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {INITIAL_MESSAGES.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {/* Matches Card */}
            <View style={styles.matchesCardContainer}>
              <MatchesCard onPress={handleMatchesCardPress} matchCount={MOCK_PROFILES.length} />
            </View>
          </ScrollView>
        )}

        {/* Profile Public Prompt Modal */}
        <ProfilePublicPrompt
          visible={showPrompt}
          onClose={() => setShowPrompt(false)}
          onConfirm={handleConfirmPublic}
        />

        {/* Match Overlay */}
        <MatchOverlay
          visible={showMatch}
          profile={matchedProfile}
          onClose={handleCloseMatch}
          onSendMessage={handleSendMessage}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  headerRight: {
    width: 32,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  userBubbleContainer: {
    justifyContent: 'flex-end',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 18,
  },
  aiBubble: {
    backgroundColor: Colors.tabBarBackground,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.tabBarActive,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  bubbleText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  matchesCardContainer: {
    marginTop: 8,
    marginLeft: 36,
  },
  matchesCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  matchesCardGradient: {
    padding: 16,
  },
  matchesCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchesAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  matchAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  matchAvatarEmoji: {
    fontSize: 22,
  },
  matchesTextContainer: {
    flex: 1,
  },
  matchesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  matchesSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  cardsContainer: {
    flex: 1,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  skipButton: {
    backgroundColor: Colors.tabBarBackground,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  connectButton: {
    backgroundColor: Colors.tabBarBackground,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.tabBarBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToChatButton: {
    backgroundColor: Colors.tabBarActive,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backToChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
