import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Mock friend data
interface Friend {
  id: string;
  name: string;
  hashtags: string[];
  avatarColor: string;
  avatarEmoji: string;
  audioDuration: string;
}

const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Calvin',
    hashtags: ['#music', '#vibes'],
    avatarColor: '#FF6B6B',
    avatarEmoji: '😎',
    audioDuration: '0:12',
  },
  {
    id: '2',
    name: 'Sarah',
    hashtags: ['#chill', '#weekend'],
    avatarColor: '#4ECDC4',
    avatarEmoji: '🎧',
    audioDuration: '0:05',
  },
  {
    id: '3',
    name: 'Mike',
    hashtags: ['#workout', '#motivation'],
    avatarColor: '#45B7D1',
    avatarEmoji: '💪',
    audioDuration: '0:08',
  },
  {
    id: '4',
    name: 'Emma',
    hashtags: ['#travel', '#adventure'],
    avatarColor: '#96CEB4',
    avatarEmoji: '✈️',
    audioDuration: '0:15',
  },
  {
    id: '5',
    name: 'Alex',
    hashtags: ['#coding', '#tech'],
    avatarColor: '#DDA0DD',
    avatarEmoji: '👨‍💻',
    audioDuration: '0:03',
  },
];

// Animated waveform component for playing state
const AudioWaveform: React.FC = () => {
  return (
    <View style={styles.waveformContainer}>
      {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9, 0.3].map((height, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            { height: 16 * height },
          ]}
        />
      ))}
    </View>
  );
};

interface FriendCardProps {
  friend: Friend;
  isPlaying: boolean;
  onPlayPress: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  isPlaying,
  onPlayPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: friend.avatarColor }]}>
        <Text style={styles.avatarEmoji}>{friend.avatarEmoji}</Text>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.hashtags}>{friend.hashtags.join(' ')}</Text>
      </View>

      {/* Audio Controls */}
      <View style={styles.audioControls}>
        {isPlaying ? (
          <AudioWaveform />
        ) : (
          <Text style={styles.duration}>{friend.audioDuration}</Text>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPress}
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Ionicons name="pause" size={18} color={Colors.textPrimary} />
          ) : (
            <Ionicons name="play" size={18} color={Colors.textPrimary} style={styles.playIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FriendsScreen() {
  const [playingId, setPlayingId] = useState<string | null>('1'); // Calvin is playing by default

  const handlePlayPress = (friendId: string) => {
    if (playingId === friendId) {
      setPlayingId(null);
    } else {
      setPlayingId(friendId);
    }
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <FriendCard
      friend={item}
      isPlaying={playingId === item.id}
      onPlayPress={() => handlePlayPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Account for floating tab bar
  },
  separator: {
    height: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  hashtags: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: 14,
    color: Colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 20,
    minWidth: 50,
  },
  waveformBar: {
    width: 3,
    backgroundColor: Colors.tabBarActive,
    borderRadius: 2,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2, // Optical centering for play triangle
  },
});
