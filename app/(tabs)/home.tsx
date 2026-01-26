import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Placeholder QR Code component (visual representation)
const QRCodeVisual: React.FC<{ size?: number }> = ({ size = 180 }) => {
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
    <View style={[styles.qrContainer, { width: size, height: size }]}>
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

export default function HomeScreen() {
  const router = useRouter();

  const handleCopyLink = () => {
    console.log('Copy link pressed');
  };

  const handleScanQR = () => {
    router.push('/scan');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>My QR Code</Text>

        {/* QR Code Card */}
        <View style={styles.qrCodeCard}>
          <QRCodeVisual size={200} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
            <Ionicons name="copy-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.actionButtonText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanButtonGradient}
            >
              <Ionicons name="scan" size={20} color={Colors.textPrimary} />
              <Text style={styles.scanButtonText}>Scan QR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Helper text */}
        <Text style={styles.helperText}>
          Share your QR code to connect with others
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
  },
  qrCodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  qrContainer: {
    // Size set dynamically via props
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scanButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
