import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { UserAvatar } from '@/components/UserAvatar';

// Animated Switch Component
const AnimatedSwitch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ value, onValueChange }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3A3A3C', Colors.tabBarActive],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
        <Animated.View
          style={[styles.switchThumb, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Settings Row Component
const SettingsRow: React.FC<{
  icon: string;
  iconFamily?: 'ionicons' | 'material';
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
}> = ({ icon, iconFamily = 'ionicons', label, subtitle, onPress, rightElement, isDestructive }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const IconComponent = iconFamily === 'material' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
    >
      <Animated.View style={[styles.settingsRow, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.rowIconContainer, isDestructive && styles.rowIconDestructive]}>
          <IconComponent
            name={icon as any}
            size={22}
            color={isDestructive ? '#FF453A' : Colors.tabBarActive}
          />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, isDestructive && styles.rowLabelDestructive]}>
            {label}
          </Text>
          {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
        {rightElement || (
          onPress && (
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          )
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Section Component
const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

// Bottom Sheet Modal Component
const BottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ visible, onClose, title, description, children }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>{title}</Text>
            {description && (
              <Text style={styles.bottomSheetDescription}>{description}</Text>
            )}
            {children}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonCard, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonSection, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.skeletonSection, { opacity: pulseAnim }]} />
    </View>
  );
};

// Profile data interface
interface ProfileData {
  username: string;
  bio: string;
  interests: string[];
  avatarUrl: string | null;
}

// Edit Profile Modal Component
const EditProfileModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (profile: ProfileData) => void;
}> = ({ visible, onClose, profile, onSave }) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [interestsText, setInterestsText] = useState(profile.interests.join(', '));
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      // Reset form when opening
      setUsername(profile.username);
      setBio(profile.bio);
      setInterestsText(profile.interests.join(', '));
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, profile]);

  const handleSave = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }
    
    // Parse interests from comma-separated string
    const interests = interestsText
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    
    onSave({
      ...profile,
      username: username.trim(),
      bio: bio.trim(),
      interests,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.modalOverlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <Animated.View
            style={[styles.editProfileSheet, { transform: [{ translateY: slideAnim }] }]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.bottomSheetTitle}>Edit Profile</Text>
              
              {/* Avatar Preview */}
              <View style={styles.avatarPreviewContainer}>
                <UserAvatar name={username} avatarUrl={profile.avatarUrl} size={80} />
                <TouchableOpacity style={styles.changeAvatarButton}>
                  <Ionicons name="camera" size={16} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              {/* Username Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username *</Text>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor={Colors.textPlaceholder}
                  autoCapitalize="none"
                  maxLength={30}
                />
              </View>
              
              {/* Bio Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio (optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={Colors.textPlaceholder}
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>{bio.length}/150</Text>
              </View>
              
              {/* Interests Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Interests (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={interestsText}
                  onChangeText={setInterestsText}
                  placeholder="music, travel, coding..."
                  placeholderTextColor={Colors.textPlaceholder}
                  autoCapitalize="none"
                />
                <Text style={styles.inputHint}>Separate interests with commas</Text>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.editProfileButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    username: 'Karam',
    bio: '',
    interests: [],
    avatarUrl: null,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    setEditProfileVisible(true);
  };
  
  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Account deleted'),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Hero Section with Gradient */}
      <View style={styles.heroWrapper}>
        <LinearGradient
          colors={[Colors.tabBarActive, '#6366F1']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <UserAvatar 
            name={profile.username} 
            avatarUrl={profile.avatarUrl} 
            size={56} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.username}</Text>
            {profile.bio ? (
              <Text style={styles.profileBio} numberOfLines={1}>{profile.bio}</Text>
            ) : (
              <Text style={styles.profileRole}>Premium Member</Text>
            )}
            {profile.interests.length > 0 && (
              <Text style={styles.profileInterests} numberOfLines={1}>
                {profile.interests.join(' • ')}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={18} color={Colors.tabBarActive} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.tabBarActive}
          />
        }
      >
        <SettingsSection title="PREFERENCES">
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            subtitle="Receive push notifications"
            rightElement={
              <AnimatedSwitch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            }
          />
          <SettingsRow
            icon="volume-high-outline"
            label="Sound Effects"
            rightElement={
              <AnimatedSwitch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
              />
            }
          />
          <SettingsRow
            icon="color-palette-outline"
            label="Theme"
            subtitle={selectedTheme === 'dark' ? 'Dark' : 'Light'}
            onPress={() => setThemeModalVisible(true)}
          />
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsRow
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Privacy & Security"
            onPress={() => console.log('Privacy')}
          />
          <SettingsRow
            icon="card-outline"
            label="Subscription"
            subtitle="Premium Plan"
            onPress={() => console.log('Subscription')}
          />
          <SettingsRow
            icon="language-outline"
            label="Language"
            subtitle="English"
            onPress={() => console.log('Language')}
          />
        </SettingsSection>

        <SettingsSection title="SUPPORT">
          <SettingsRow
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => console.log('Help')}
          />
          <SettingsRow
            icon="chatbubble-outline"
            label="Contact Us"
            onPress={() => console.log('Contact')}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => console.log('Terms')}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => console.log('Privacy Policy')}
          />
        </SettingsSection>

        <SettingsSection title="DANGER ZONE">
          <SettingsRow
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            isDestructive
          />
          <SettingsRow
            icon="trash-outline"
            label="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            isDestructive
          />
        </SettingsSection>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Theme Selection Bottom Sheet */}
      <BottomSheet
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        title="Select Theme"
        description="Choose your preferred app theme"
      >
        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              selectedTheme === 'dark' && styles.themeOptionSelected,
            ]}
            onPress={() => {
              setSelectedTheme('dark');
              setThemeModalVisible(false);
            }}
          >
            <Ionicons
              name="moon"
              size={24}
              color={selectedTheme === 'dark' ? Colors.tabBarActive : Colors.textSecondary}
            />
            <Text
              style={[
                styles.themeOptionText,
                selectedTheme === 'dark' && styles.themeOptionTextSelected,
              ]}
            >
              Dark
            </Text>
            {selectedTheme === 'dark' && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.tabBarActive} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeOption,
              selectedTheme === 'light' && styles.themeOptionSelected,
            ]}
            onPress={() => {
              setSelectedTheme('light');
              setThemeModalVisible(false);
            }}
          >
            <Ionicons
              name="sunny"
              size={24}
              color={selectedTheme === 'light' ? Colors.tabBarActive : Colors.textSecondary}
            />
            <Text
              style={[
                styles.themeOptionText,
                selectedTheme === 'light' && styles.themeOptionTextSelected,
              ]}
            >
              Light
            </Text>
            {selectedTheme === 'light' && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.tabBarActive} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.bottomSheetButton}
          onPress={() => setThemeModalVisible(false)}
        >
          <Text style={styles.bottomSheetButtonText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroWrapper: {
    position: 'relative',
    height: 130,
    marginBottom: 60,
  },
  heroSection: {
    height: 180,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 8,
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF453A',
  },
  profileCard: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    right: 20,
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profileRole: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileBio: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  profileInterests: {
    fontSize: 12,
    color: Colors.tabBarActive,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.tabBarActive,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowIconDestructive: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  rowLabelDestructive: {
    color: '#FF453A',
  },
  rowSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  versionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.tabBarBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomSheetDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  themeOptions: {
    gap: 12,
    marginBottom: 20,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 14,
  },
  themeOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: Colors.tabBarActive,
  },
  themeOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  themeOptionTextSelected: {
    color: Colors.textPrimary,
  },
  bottomSheetButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  skeletonContainer: {
    flex: 1,
    padding: 20,
  },
  skeletonCard: {
    height: 100,
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 20,
    marginTop: 120,
    marginBottom: 40,
  },
  skeletonSection: {
    height: 150,
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 16,
    marginBottom: 20,
  },
  // Edit Profile Modal Styles
  editProfileSheet: {
    backgroundColor: Colors.tabBarBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.tabBarBackground,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textAreaInput: {
    height: 80,
    paddingTop: 14,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  editProfileButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.tabBarActive,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
