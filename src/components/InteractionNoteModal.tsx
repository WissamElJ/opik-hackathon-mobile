import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

type InputMode = 'voice' | 'text';

interface ConnectionInfo {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
}

interface InteractionNoteModalProps {
  visible: boolean;
  connection: ConnectionInfo | null;
  onClose: () => void;
  onSave: (note: string, isVoice?: boolean) => void;
  onSkip: () => void;
}

// Input Mode Toggle Component
const InputModeToggle: React.FC<{
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}> = ({ mode, onModeChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, mode === 'voice' && styles.toggleButtonActive]}
        onPress={() => onModeChange('voice')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="mic"
          size={16}
          color={mode === 'voice' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.toggleText, mode === 'voice' && styles.toggleTextActive]}>
          Voice
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, mode === 'text' && styles.toggleButtonActive]}
        onPress={() => onModeChange('text')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="create"
          size={16}
          color={mode === 'text' ? Colors.textPrimary : Colors.textSecondary}
        />
        <Text style={[styles.toggleText, mode === 'text' && styles.toggleTextActive]}>
          Text
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Recording button
const RecordButton: React.FC<{ isRecording: boolean; onPress: () => void }> = ({
  isRecording,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.recordButton, isRecording && styles.recordButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.recordButtonInner}>
        {isRecording ? (
          <View style={styles.stopIcon} />
        ) : (
          <>
            <View style={[styles.recordBar]} />
            <View style={[styles.recordBar, styles.recordBarMiddle]} />
            <View style={[styles.recordBar]} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const InteractionNoteModal: React.FC<InteractionNoteModalProps> = ({
  visible,
  connection,
  onClose,
  onSave,
  onSkip,
}) => {
  const [note, setNote] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && !isAnimatingOut) {
      setNote('');
      setInputMode('voice');
      setIsRecording(false);
      setHasRecording(false);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 5,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 5,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!visible) {
      slideAnim.setValue(400);
      scaleAnim.setValue(0.9);
      overlayOpacity.setValue(0);
      setIsAnimatingOut(false);
    }
  }, [visible]);

  const animateOut = (callback: () => void) => {
    setIsAnimatingOut(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimatingOut(false);
      callback();
    });
  };

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setHasRecording(true);
    } else {
      // Start recording
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  const handleSave = () => {
    if (inputMode === 'voice' && hasRecording) {
      animateOut(() => {
        onSave('[Voice Note]', true);
        onClose();
      });
    } else if (inputMode === 'text' && note.trim()) {
      animateOut(() => {
        onSave(note.trim(), false);
        onClose();
      });
    }
  };

  const handleSkip = () => {
    animateOut(() => {
      onSkip();
      onClose();
    });
  };

  const handleCloseModal = () => {
    animateOut(() => {
      onClose();
    });
  };

  const canSave = (inputMode === 'voice' && hasRecording) || (inputMode === 'text' && note.trim());

  if (!connection) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleCloseModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlayBackground, { opacity: overlayOpacity }]} />
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Header */}
          <View style={styles.header}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color={Colors.textPrimary} />
            </View>
            <Text style={styles.successTitle}>Connection Made!</Text>
          </View>

          {/* Connection Info */}
          <View style={styles.connectionInfo}>
            <View style={[styles.avatar, { backgroundColor: connection.avatarColor }]}>
              <Text style={styles.avatarEmoji}>{connection.avatarEmoji}</Text>
            </View>
            <Text style={styles.connectionName}>Connected with {connection.name}</Text>
          </View>

          {/* Prompt */}
          <Text style={styles.prompt}>
            Leave a note about this interaction
          </Text>

          {/* Input Mode Toggle */}
          <InputModeToggle mode={inputMode} onModeChange={setInputMode} />

          {/* Voice Input UI */}
          {inputMode === 'voice' && (
            <View style={styles.voiceContainer}>
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
            </View>
          )}

          {/* Text Input UI */}
          {inputMode === 'text' && (
            <TextInput
              style={styles.textInput}
              placeholder="What did you talk about? How was the interaction?"
              placeholderTextColor={Colors.textPlaceholder}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={canSave ? ['#8B5CF6', '#6366F1'] : ['#3A3A3C', '#3A3A3C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                  Save Note
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 24,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  connectionName: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  prompt: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: Colors.tabBarActive,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.textPrimary,
  },
  // Voice Input
  voiceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 120,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#333333',
  },
  recordButtonActive: {
    borderColor: '#EC4899',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  recordButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  recordBar: {
    width: 5,
    height: 20,
    backgroundColor: Colors.tabBarActive,
    borderRadius: 3,
  },
  recordBarMiddle: {
    height: 28,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  recordingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
  },
  tapToRecordText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  recordedText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  // Text Input
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 90,
    lineHeight: 22,
    marginBottom: 16,
  },
  // Buttons
  buttonContainer: {
    gap: 10,
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {},
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
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default InteractionNoteModal;
