import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { ParamisIcon } from '@/components/ParamisIcon';

// Mock data for messages
interface Message {
  id: string;
  name: string;
  preview: string;
  time: string;
  isUnread: boolean;
  avatarColor: string;
  avatarEmoji: string;
  isApp?: boolean;
}

const MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Paramis',
    preview: 'Hey Karam! 3 suggestions for thi...',
    time: '3 min ago',
    isUnread: true,
    avatarColor: Colors.tabBarActive,
    avatarEmoji: '',
    isApp: true,
  },
  {
    id: '2',
    name: 'Francisco Karbaji',
    preview: 'Will right back',
    time: '7 min ago',
    isUnread: false,
    avatarColor: '#45B7D1',
    avatarEmoji: '🧔',
  },
  {
    id: '3',
    name: 'Colleen Cohen',
    preview: 'Okay!',
    time: '2 days ago',
    isUnread: false,
    avatarColor: '#96CEB4',
    avatarEmoji: '👩',
  },
];

// Message Card Component
const MessageCard: React.FC<{ message: Message; onPress: () => void }> = ({ message, onPress }) => {
  return (
    <TouchableOpacity style={styles.messageCard} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.messageAvatar, { backgroundColor: message.avatarColor }]}>
        {message.isApp ? (
          <ParamisIcon size="small" />
        ) : (
          <Text style={styles.messageAvatarEmoji}>{message.avatarEmoji}</Text>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.messageName}>{message.name}</Text>
        <Text style={styles.messagePreview} numberOfLines={1}>
          {message.preview}
        </Text>
      </View>
      <View style={styles.messageRight}>
        <Text style={styles.messageTime}>{message.time}</Text>
        {message.isUnread && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const handleNotifications = () => {
    console.log('Notifications pressed');
  };


  const handleRecord = () => {
    // Navigate to audio tab with chat mode
    router.push('/(tabs)/audio?tab=plans');
  };

  const handleSeeAllMessages = () => {
    router.push('/messages');
  };

  const handleMessagePress = (message: Message) => {
    if (message.isApp) {
      // Navigate to Paramis chat for AI assistant messages
      router.push('/paramis-chat');
    } else {
      // For regular messages, just log for now
      console.log('Message pressed:', message.name);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarEmoji}>👨‍🦳</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome Back Karam!</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleNotifications} style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Voice Recording Card */}
        <LinearGradient
          colors={['#8B5CF6', '#6366F1', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.recordingCard}
        >
          <View style={styles.recordingHeader}>
            <View style={styles.appIcon}>
              <MaterialCommunityIcons name="waveform" size={24} color={Colors.textPrimary} />
            </View>
            <View style={styles.recordingTextContainer}>
              <Text style={styles.recordingTitle}>What's on your mind?</Text>
              <Text style={styles.recordingSubtitle}>
                We'll help you find activity partners
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
            <Text style={styles.recordButtonText}>Tap to Chat</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages Section */}
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Messages</Text>
          <TouchableOpacity onPress={handleSeeAllMessages}>
            <Text style={styles.seeAllText}>See all {'>'}</Text>
          </TouchableOpacity>
        </View>

        {MESSAGES.map((message) => (
          <MessageCard key={message.id} message={message} onPress={() => handleMessagePress(message)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarEmoji: {
    fontSize: 28,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  recordingCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordingTextContainer: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  recordingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recordButton: {
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  messagesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarEmoji: {
    fontSize: 26,
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  messageRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.tabBarActive,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.tabBarActive,
  },
});
