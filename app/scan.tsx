import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { InteractionNoteModal } from '@/components/InteractionNoteModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

// Mock connection data (in real app, this would come from QR code scan)
const MOCK_CONNECTION = {
  id: '123',
  name: 'Sarah Chen',
  avatarColor: '#FF6B9D',
  avatarEmoji: '👩‍💻',
};

export default function ScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [scannedConnection, setScannedConnection] = useState<typeof MOCK_CONNECTION | null>(null);

  const handleBack = () => {
    router.back();
  };

  // Simulate a successful scan (in real app, this would be triggered by camera)
  const handleSimulateScan = () => {
    setIsScanning(false);
    setScannedConnection(MOCK_CONNECTION);
    setShowNoteModal(true);
  };

  const handleSaveNote = (note: string) => {
    console.log('Saving interaction note:', note, 'for connection:', scannedConnection?.name);
    // TODO: Save note to database
    router.back();
  };

  const handleSkipNote = () => {
    console.log('Skipped note for:', scannedConnection?.name);
    router.back();
  };

  const handleCloseModal = () => {
    setShowNoteModal(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Camera View Placeholder */}
      <View style={styles.cameraContainer}>
        {/* Simulated camera background */}
        <LinearGradient
          colors={['#1A1A1A', '#2D2D2D', '#1A1A1A']}
          style={styles.cameraBackground}
        />

        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          {/* Corner decorations */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Scanning line animation placeholder */}
          {isScanning && (
            <View style={styles.scanLine} />
          )}
        </View>

        {/* Instructions */}
        <Text style={styles.instructions}>
          Position the QR code within the frame
        </Text>

        {/* Simulate Scan Button (for demo purposes) */}
        <TouchableOpacity
          style={styles.simulateButton}
          onPress={handleSimulateScan}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.simulateButtonGradient}
          >
            <Ionicons name="qr-code" size={20} color={Colors.textPrimary} />
            <Text style={styles.simulateButtonText}>Simulate Scan</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Helper text */}
        <Text style={styles.helperText}>
          Scan someone's QR code to connect with them
        </Text>
      </View>

      {/* Interaction Note Modal */}
      <InteractionNoteModal
        visible={showNoteModal}
        connection={scannedConnection}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        onSkip={handleSkipNote}
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
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 32,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  scanFrame: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
    marginBottom: 40,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.tabBarActive,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: Colors.tabBarActive,
    opacity: 0.8,
  },
  instructions: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  simulateButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  simulateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  simulateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
