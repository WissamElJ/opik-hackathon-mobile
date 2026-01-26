import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type InputMode = 'voice' | 'text';

// Recording button with bars
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
            <View style={styles.recordBar} />
            <View style={[styles.recordBar, styles.recordBarMiddle]} />
            <View style={styles.recordBar} />
          </>
        )}
      </View>
    </TouchableOpacity>
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
          size={18}
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
          size={18}
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
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [textNote, setTextNote] = useState('');

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
    setHasRecording(false);
  };

  const handleSaveTextNote = () => {
    console.log('Saving text note:', textNote);
    setTextNote('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.header}>Let's Chat!</Text>

          {/* Title */}
          <Text style={styles.title}>What are you up to?</Text>
          <Text style={styles.subtitle}>Share your plans to find activity partners</Text>

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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  // Input Mode Toggle
  inputToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 14,
    padding: 4,
    marginBottom: 32,
  },
  inputToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    gap: 8,
  },
  inputToggleButtonActive: {
    backgroundColor: Colors.tabBarActive,
  },
  inputToggleText: {
    fontSize: 15,
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
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  stopIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#EC4899',
    borderRadius: 4,
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
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveVoiceButtonDisabled: {
    opacity: 0.6,
  },
  saveVoiceButtonGradient: {
    paddingVertical: 16,
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
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: 16,
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
