import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { UserAvatar } from '@/components/UserAvatar';

// Mock friend data with connection context
interface Friend {
  id: string;
  name: string;
  avatarUrl?: string | null;
  connectedAt: Date;
  location: string;
}

// Helper to format relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
};

const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Calvin Johnson',
    avatarUrl: null,
    connectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: 'Blue Note Jazz Club',
  },
  {
    id: '2',
    name: 'Sarah',
    avatarUrl: null,
    connectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    location: 'Central Park',
  },
  {
    id: '3',
    name: 'Mike Thompson',
    avatarUrl: null,
    connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    location: 'Equinox Gym SoHo',
  },
  {
    id: '4',
    name: 'Emma',
    avatarUrl: null,
    connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    location: 'JFK Terminal 4',
  },
  {
    id: '5',
    name: 'Alex Chen',
    avatarUrl: null,
    connectedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // ~1.5 months ago
    location: 'TechCrunch Disrupt',
  },
];

interface FriendCardProps {
  friend: Friend;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const relativeTime = getRelativeTime(friend.connectedAt);

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <UserAvatar
        name={friend.name}
        avatarUrl={friend.avatarUrl}
        size={56}
      />

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.timeAgo}>{relativeTime}</Text>
        </View>
        
        {/* Connection context */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.tabBarActive} />
          <Text style={styles.location}>{friend.location}</Text>
        </View>
      </View>
    </View>
  );
};

export default function FriendsScreen() {
  const renderFriend = ({ item }: { item: Friend }) => (
    <FriendCard friend={item} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>{MOCK_FRIENDS.length} connections</Text>
      </View>
      <FlatList
        data={MOCK_FRIENDS}
        renderItem={renderFriend}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  separator: {
    height: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 16,
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeAgo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.tabBarActive,
    fontWeight: '500',
  },
});
