import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

// Mock data for friend requests
interface FriendRequest {
  id: string;
  name: string;
  activity: string;
  avatarColor: string;
  avatarEmoji: string;
}

const FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: '1',
    name: 'Jane Delvaux',
    activity: 'Padel',
    avatarColor: '#4ECDC4',
    avatarEmoji: '🧔',
  },
  {
    id: '2',
    name: 'Pia Kaliounji',
    activity: 'Partying',
    avatarColor: '#FF6B6B',
    avatarEmoji: '👩',
  },
];

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

// Friend Request Card Component
const FriendRequestCard: React.FC<{
  request: FriendRequest;
  onAccept: () => void;
  onDismiss: () => void;
}> = ({ request, onAccept, onDismiss }) => {
  return (
    <View style={styles.requestCard}>
      <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
        <Ionicons name="close" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
      <View style={[styles.requestAvatar, { backgroundColor: request.avatarColor }]}>
        <Text style={styles.requestAvatarEmoji}>{request.avatarEmoji}</Text>
      </View>
      <Text style={styles.requestName}>{request.name}</Text>
      <Text style={styles.requestText}>
        Is interested to join you{'\n'}
        <Text style={styles.requestActivity}>{request.activity}</Text> this week!
      </Text>
      <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

// Message Card Component
const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <TouchableOpacity style={styles.messageCard} activeOpacity={0.7}>
      <View style={[styles.messageAvatar, { backgroundColor: message.avatarColor }]}>
        {message.isApp ? (
          <MaterialCommunityIcons name="waveform" size={24} color={Colors.textPrimary} />
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
    // Navigate to audio tab for recording
    router.push('/(tabs)/audio');
  };

  const handleAcceptRequest = (id: string) => {
    console.log('Accept request:', id);
  };

  const handleDismissRequest = (id: string) => {
    console.log('Dismiss request:', id);
  };

  const handleSeeAllMessages = () => {
    router.push('/messages');
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
          <TouchableOpacity onPress={handleNotifications} style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
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
              <Text style={styles.recordingTitle}>Tell us what you up to this week?</Text>
              <Text style={styles.recordingSubtitle}>
                change your voice as you wish 🎙️
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
            <Text style={styles.recordButtonText}>Record</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Friend Requests */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.requestsContainer}
        >
          {FRIEND_REQUESTS.map((request) => (
            <FriendRequestCard
              key={request.id}
              request={request}
              onAccept={() => handleAcceptRequest(request.id)}
              onDismiss={() => handleDismissRequest(request.id)}
            />
          ))}
        </ScrollView>

        {/* Messages Section */}
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Messages</Text>
          <TouchableOpacity onPress={handleSeeAllMessages}>
            <Text style={styles.seeAllText}>See all {'>'}</Text>
          </TouchableOpacity>
        </View>

        {MESSAGES.map((message) => (
          <MessageCard key={message.id} message={message} />
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
  notificationButton: {
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
  requestsContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  requestCard: {
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 16,
    width: 165,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  dismissButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  requestAvatarEmoji: {
    fontSize: 28,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  requestText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  requestActivity: {
    fontWeight: '600',
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  acceptButton: {
    backgroundColor: Colors.tabBarActive,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
