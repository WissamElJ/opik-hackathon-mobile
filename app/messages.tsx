import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Message interface
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

// Extended mock data for all messages
const ALL_MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Paramis',
    preview: 'Hey Karam! 3 suggestions for this week activities...',
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
  {
    id: '4',
    name: 'Jane Delvaux',
    preview: 'See you at the padel court tomorrow!',
    time: '3 days ago',
    isUnread: false,
    avatarColor: '#4ECDC4',
    avatarEmoji: '🧔',
  },
  {
    id: '5',
    name: 'Pia Kaliounji',
    preview: 'The party was amazing! Thanks for coming 🎉',
    time: '4 days ago',
    isUnread: false,
    avatarColor: '#FF6B6B',
    avatarEmoji: '👩',
  },
  {
    id: '6',
    name: 'Alex Thompson',
    preview: 'Check out this new track I made',
    time: '5 days ago',
    isUnread: false,
    avatarColor: '#DDA0DD',
    avatarEmoji: '👨‍💻',
  },
  {
    id: '7',
    name: 'Paramis',
    preview: 'Your weekly summary is ready!',
    time: '1 week ago',
    isUnread: false,
    avatarColor: Colors.tabBarActive,
    avatarEmoji: '',
    isApp: true,
  },
  {
    id: '8',
    name: 'Mike Johnson',
    preview: 'Great workout session today 💪',
    time: '1 week ago',
    isUnread: false,
    avatarColor: '#45B7D1',
    avatarEmoji: '💪',
  },
  {
    id: '9',
    name: 'Emma Wilson',
    preview: 'The photos from our trip are uploaded!',
    time: '2 weeks ago',
    isUnread: false,
    avatarColor: '#96CEB4',
    avatarEmoji: '✈️',
  },
];

// Message Card Component
const MessageCard: React.FC<{ message: Message; onPress: () => void }> = ({ message, onPress }) => {
  return (
    <TouchableOpacity style={styles.messageCard} activeOpacity={0.7} onPress={onPress}>
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
        <Text style={[styles.messageTime, message.isUnread && styles.messageTimeUnread]}>
          {message.time}
        </Text>
        {message.isUnread && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleMessagePress = (message: Message) => {
    console.log('Message pressed:', message.name);
    // TODO: Navigate to individual conversation
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageCard message={item} onPress={() => handleMessagePress(item)} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Messages List */}
      <FlatList
        data={ALL_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 32, // Balance the back button
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 14,
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
    color: Colors.textSecondary,
  },
  messageTimeUnread: {
    color: Colors.tabBarActive,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.tabBarActive,
  },
});
