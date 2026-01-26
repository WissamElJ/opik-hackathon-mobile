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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ParamisIcon } from '@/components/ParamisIcon';
import { UserAvatar } from '@/components/UserAvatar';

// Mock data for messages
interface Message {
  id: string;
  name: string;
  preview: string;
  time: string;
  isUnread: boolean;
  avatarUrl?: string | null;
  isApp?: boolean;
}

const MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Paramis',
    preview: 'Hey Karam! 3 suggestions for thi...',
    time: '3 min ago',
    isUnread: true,
    isApp: true,
  },
  {
    id: '2',
    name: 'Francisco Karbaji',
    preview: 'Will right back',
    time: '7 min ago',
    isUnread: false,
    avatarUrl: null, // No avatar, will show "FK" initials
  },
  {
    id: '3',
    name: 'Colleen Cohen',
    preview: 'Okay!',
    time: '2 days ago',
    isUnread: false,
    avatarUrl: null, // No avatar, will show "CC" initials
  },
];

// Message Card Component
const MessageCard: React.FC<{ message: Message; onPress: () => void }> = ({ message, onPress }) => {
  return (
    <TouchableOpacity style={styles.messageCard} activeOpacity={0.7} onPress={onPress}>
      {message.isApp ? (
        <View style={styles.paramisAvatar}>
          <ParamisIcon size="small" />
        </View>
      ) : (
        <UserAvatar
          name={message.name}
          avatarUrl={message.avatarUrl}
          size={50}
        />
      )}
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

export default function InteractionsScreen() {
  const router = useRouter();

  const handleNotifications = () => {
    console.log('Notifications pressed');
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
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerButton: {
    padding: 8,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  paramisAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
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
