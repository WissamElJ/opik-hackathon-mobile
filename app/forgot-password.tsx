import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/Colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSendReset = () => {
    // TODO: Implement password reset logic
    console.log('Send reset link to:', email);
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Top Spacer */}
          <View style={styles.topSpacer} />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather
                name={isSubmitted ? "mail" : "lock"}
                size={40}
                color={Colors.primaryAccent}
              />
            </View>
          </View>

          {!isSubmitted ? (
            <>
              {/* Heading */}
              <Text style={styles.heading}>Forgot Password?</Text>
              <Text style={styles.subheading}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Input
                  icon="mail"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
              </View>

              {/* Send Button */}
              <TouchableOpacity
                style={[styles.sendButton, !email && styles.sendButtonDisabled]}
                onPress={handleSendReset}
                disabled={!email}
              >
                <Text style={styles.sendButtonText}>Send Reset Link</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Success State */}
              <Text style={styles.heading}>Check Your Email</Text>
              <Text style={styles.subheading}>
                We've sent a password reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              <Text style={styles.tipText}>
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </Text>

              {/* Resend Button */}
              <TouchableOpacity style={styles.resendButton} onPress={() => setIsSubmitted(false)}>
                <Text style={styles.resendButtonText}>Try Different Email</Text>
              </TouchableOpacity>

              {/* Back to Login Button */}
              <TouchableOpacity style={styles.sendButton} onPress={handleBackToLogin}>
                <Text style={styles.sendButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Flexible Spacer */}
          <View style={styles.flexSpacer} />

          {/* Footer */}
          {!isSubmitted && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  topSpacer: {
    height: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  emailHighlight: {
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 14,
    color: Colors.textPlaceholder,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 28,
  },
  sendButton: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: Colors.borderRadius,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: Colors.buttonSecondary,
    borderRadius: Colors.borderRadius,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  resendButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  flexSpacer: {
    flex: 1,
    minHeight: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: Colors.primaryAccent,
    fontSize: 15,
    fontWeight: '600',
  },
});
