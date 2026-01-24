import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type ScreenMode = 'qr' | 'plans';
type InputMode = 'voice' | 'text';

// Placeholder QR Code component (visual representation)
const QRCodeVisual: React.FC<{ size?: number }> = ({ size = 160 }) => {
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
        <View style={[styles.recordBar, isRecording && styles.recordBarActive]} />
        <View style={[styles.recordBar, styles.recordBarMiddle, isRecording && styles.recordBarActive]} />
        <View style={[styles.recordBar, isRecording && styles.recordBarActive]} />
      </View>
    </TouchableOpacity>
  );
};

// Screen Mode Toggle (Top-level tabs)
const ScreenModeToggle: React.FC<{
  mode: ScreenMode;
  onModeChange: (mode: ScreenMode) => void;
}> = ({ mode, onModeChange }) => {
  return (
    <View style={styles.screenToggleContainer}>
      <TouchableOpacity
        style={[styles.screenToggleButton, mode === 'qr' && styles.screenToggleButtonActive]}
        onPress={() => onModeChange('qr')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="qr-code"
          size={18}
          color={mode === 'qr' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.screenToggleText, mode === 'qr' && styles.screenToggleTextActive]}>
          My QR
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.screenToggleButton, mode === 'plans' && styles.screenToggleButtonActive]}
        onPress={() => onModeChange('plans')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chatbubble-ellipses"
          size={18}
          color={mode === 'plans' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.screenToggleText, mode === 'plans' && styles.screenToggleTextActive]}>
          Let's Chat!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Input Mode Toggle (Voice/Text)
const InputModeToggle: React.FC<{
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}> = ({ mode, onModeChange }) => {
  return (
    <View style={styles.inputToggleContainer}>
      <TouchableOpacity
        style={[styles.inputToggleButton, mode === 'voice' && styles.inputToggleButtonActive]}
        onPress={() => onModeChange('voice')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="mic"
          size={16}
          color={mode === 'voice' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.inputToggleText, mode === 'voice' && styles.inputToggleTextActive]}>
          Voice
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.inputToggleButton, mode === 'text' && styles.inputToggleButtonActive]}
        onPress={() => onModeChange('text')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="create"
          size={16}
          color={mode === 'text' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.inputToggleText, mode === 'text' && styles.inputToggleTextActive]}>
          Text
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Text Note Input Component
const TextNoteInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
}> = ({ value, onChangeText, onSave }) => {
  const maxLength = 280;
  const remainingChars = maxLength - value.length;

  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="What are you up to this week? Share your activities, interests, or plans..."
        placeholderTextColor={Colors.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={maxLength}
        textAlignVertical="top"
      />
      <View style={styles.textInputFooter}>
        <Text style={[styles.charCount, remainingChars < 30 && styles.charCountWarning]}>
          {remainingChars}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.saveButton, !value.trim() && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={!value.trim()}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={value.trim() ? ['#8B5CF6', '#6366F1'] : ['#3A3A3C', '#3A3A3C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveButtonGradient}
        >
          <Text style={[styles.saveButtonText, !value.trim() && styles.saveButtonTextDisabled]}>
            Save Note
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default function AudioScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [screenMode, setScreenMode] = useState<ScreenMode>('qr');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [textNote, setTextNote] = useState('');

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const qrOpacity = useRef(new Animated.Value(1)).current;
  const plansOpacity = useRef(new Animated.Value(0)).current;

  // Handle tab parameter from navigation
  useEffect(() => {
    if (tab === 'plans') {
      setScreenMode('plans');
    }
  }, [tab]);

  // Animate tab transitions
  useEffect(() => {
    const toValue = screenMode === 'qr' ? 0 : 1;

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.timing(qrOpacity, {
        toValue: screenMode === 'qr' ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(plansOpacity, {
        toValue: screenMode === 'plans' ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenMode]);

  // Interpolate slide positions
  const qrTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });

  const plansTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0],
  });

  const handleCopyLink = () => {
    console.log('Copy link pressed');
  };

  const handleScanQR = () => {
    router.push('/scan');
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  const handleSaveVoiceNote = () => {
    console.log('Saving voice note');
    // TODO: Implement save functionality
    setHasRecording(false);
  };

  const handleSaveTextNote = () => {
    console.log('Saving text note:', textNote);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Screen Mode Toggle */}
          <ScreenModeToggle mode={screenMode} onModeChange={setScreenMode} />

          {/* Animated Tab Container */}
          <View style={styles.tabContainer}>
            {/* QR Tab Content */}
            <Animated.View
              style={[
                styles.qrTabContent,
                styles.animatedTab,
                {
                  transform: [{ translateX: qrTranslateX }],
                  opacity: qrOpacity,
                },
              ]}
              pointerEvents={screenMode === 'qr' ? 'auto' : 'none'}
            >
              {/* QR Code Card */}
              <View style={styles.qrCodeCard}>
                <QRCodeVisual size={180} />
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

              {/* Prompt to share plans */}
              <TouchableOpacity
                style={styles.sharePlansPrompt}
                onPress={() => setScreenMode('plans')}
                activeOpacity={0.7}
              >
                <Text style={styles.sharePlansText}>Share what you're up to</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>

            {/* Plans Tab Content */}
            <Animated.View
              style={[
                styles.plansTabContent,
                styles.animatedTab,
                {
                  transform: [{ translateX: plansTranslateX }],
                  opacity: plansOpacity,
                },
              ]}
              pointerEvents={screenMode === 'plans' ? 'auto' : 'none'}
            >
              {/* Title */}
              <Text style={styles.plansTitle}>What are you up to?</Text>
              <Text style={styles.plansSubtitle}>Share your plans to find activity partners</Text>

              {/* Input Mode Toggle */}
              <InputModeToggle mode={inputMode} onModeChange={setInputMode} />

              {/* Voice Input UI */}
              {inputMode === 'voice' && (
                <View style={styles.voiceInputContainer}>
                  <RecordButton isRecording={isRecording} onPress={handleRecord} />
                  
                  {isRecording && (
                    <Text style={styles.recordingText}>Recording...</Text>
                  )}

                  {hasRecording && !isRecording && (
                    <Text style={styles.recordedText}>Voice note recorded</Text>
                  )}

                  {!isRecording && !hasRecording && (
                    <Text style={styles.tapToRecordText}>Tap to record</Text>
                  )}

                  {/* Save Button */}
                  <TouchableOpacity
                    style={[styles.saveVoiceButton, !hasRecording && styles.saveVoiceButtonDisabled]}
                    onPress={handleSaveVoiceNote}
                    disabled={!hasRecording}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={hasRecording ? ['#8B5CF6', '#6366F1'] : ['#3A3A3C', '#3A3A3C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.saveVoiceButtonGradient}
                    >
                      <Text style={[styles.saveVoiceButtonText, !hasRecording && styles.saveVoiceButtonTextDisabled]}>
                        Save Note
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Text Input UI */}
              {inputMode === 'text' && (
                <TextNoteInput
                  value={textNote}
                  onChangeText={setTextNote}
                  onSave={handleSaveTextNote}
                />
              )}
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Screen Mode Toggle
  screenToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  screenToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  screenToggleButtonActive: {
    backgroundColor: Colors.tabBarActive,
  },
  screenToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  screenToggleTextActive: {
    color: Colors.textPrimary,
  },
  // Tab Container
  tabContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedTab: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // QR Tab
  qrTabContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  qrCodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scanButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  sharePlansPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  sharePlansText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  // Plans Tab
  plansTabContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  plansTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  plansSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  // Input Mode Toggle
  inputToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  inputToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 6,
  },
  inputToggleButtonActive: {
    backgroundColor: Colors.tabBarActive,
  },
  inputToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputToggleTextActive: {
    color: Colors.textPrimary,
  },
  // Voice Input
  voiceInputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  recordingText: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 24,
  },
  recordedText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
    marginBottom: 24,
  },
  tapToRecordText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  saveVoiceButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveVoiceButtonDisabled: {
    opacity: 0.6,
  },
  saveVoiceButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveVoiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveVoiceButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  // Text Input
  textInputContainer: {
    width: '100%',
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 140,
    lineHeight: 24,
  },
  textInputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 12,
  },
  charCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  charCountWarning: {
    color: '#FF6B6B',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});
