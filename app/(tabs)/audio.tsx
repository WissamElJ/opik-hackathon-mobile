import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Placeholder QR Code component (visual representation)
const QRCodeVisual: React.FC = () => {
  // Create a simple visual grid pattern to represent a QR code
  const gridSize = 7;
  const pattern = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];

  return (
    <View style={styles.qrContainer}>
      {pattern.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.qrRow}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                styles.qrCell,
                { backgroundColor: cell ? '#000000' : 'transparent' },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

// Orb/Fluid graphic with gradient glow
const OrbGraphic: React.FC = () => {
  return (
    <View style={styles.orbWrapper}>
      {/* Outer glow */}
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.4)', 'rgba(236, 72, 153, 0.3)', 'rgba(59, 130, 246, 0.2)', 'transparent']}
        style={styles.orbGlow}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Inner orb */}
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']}
        style={styles.orb}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

// Small waveform indicator
const SmallWaveform: React.FC = () => {
  return (
    <View style={styles.smallWaveform}>
      {[0.4, 0.7, 1, 0.5, 0.8].map((height, index) => (
        <View
          key={index}
          style={[
            styles.smallWaveformBar,
            { height: 12 * height },
          ]}
        />
      ))}
    </View>
  );
};

// Recording button with bars
const RecordButton: React.FC<{ isRecording: boolean; onPress: () => void }> = ({
  isRecording,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.recordButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.recordButtonInner}>
        {/* Three vertical bars */}
        <View style={[styles.recordBar, isRecording && styles.recordBarActive]} />
        <View style={[styles.recordBar, styles.recordBarMiddle, isRecording && styles.recordBarActive]} />
        <View style={[styles.recordBar, isRecording && styles.recordBarActive]} />
      </View>
    </TouchableOpacity>
  );
};

export default function AudioScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopyLink = () => {
    // TODO: Implement copy to clipboard
    console.log('Copy link pressed');
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>My QR code</Text>

        {/* Copy Link Bar */}
        <TouchableOpacity style={styles.copyLinkBar} onPress={handleCopyLink}>
          <Text style={styles.copyLinkText}>Copy QR code link</Text>
          <Ionicons name="copy-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* QR Code */}
          <View style={styles.qrCodeCard}>
            <QRCodeVisual />
          </View>

          {/* Orb Graphic */}
          <OrbGraphic />

          {/* Voice Note Text */}
          <Text style={styles.voiceNoteTitle}>Add voice note</Text>
          <Text style={styles.hashtags}>#AI #Hackathon #Brussels</Text>

          {/* Recording UI */}
          <RecordButton isRecording={isRecording} onPress={handleRecord} />

          {/* Status Indicators */}
          <View style={styles.statusRow}>
            {/* Left: Waveform */}
            <SmallWaveform />

            {/* Right: Timestamp + Play button */}
            <View style={styles.playbackControls}>
              <Text style={styles.timestamp}>0:05</Text>
              <TouchableOpacity
                style={styles.smallPlayButton}
                onPress={handlePlay}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={14}
                  color={Colors.textPrimary}
                  style={!isPlaying && styles.playIconOffset}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 120, // Account for floating tab bar
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  copyLinkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  copyLinkText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  mainCard: {
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  qrCodeCard: {
    backgroundColor: Colors.tabBarActive,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  qrContainer: {
    width: 120,
    height: 120,
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrCell: {
    flex: 1,
    margin: 1,
    borderRadius: 2,
  },
  orbWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  orbGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  orb: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  voiceNoteTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  hashtags: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#333333',
  },
  recordButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordBar: {
    width: 6,
    height: 24,
    backgroundColor: Colors.tabBarActive,
    borderRadius: 3,
  },
  recordBarMiddle: {
    height: 32,
  },
  recordBarActive: {
    backgroundColor: '#EC4899',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  smallWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  smallWaveformBar: {
    width: 3,
    backgroundColor: Colors.tabBarActive,
    borderRadius: 2,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timestamp: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  smallPlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 2,
  },
});
