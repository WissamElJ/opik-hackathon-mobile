import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Modal,
  FlatList,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

// List of cities
const CITIES = [
  'Amsterdam',
  'Antwerp',
  'Barcelona',
  'Berlin',
  'Brussels',
  'Copenhagen',
  'Dublin',
  'Frankfurt',
  'Geneva',
  'Helsinki',
  'Lisbon',
  'London',
  'Luxembourg',
  'Madrid',
  'Milan',
  'Munich',
  'Oslo',
  'Paris',
  'Prague',
  'Rome',
  'Stockholm',
  'Strasbourg',
  'Vienna',
  'Warsaw',
  'Zurich',
];

// Zod validation schema
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  city: z.string().min(1, 'Please select a city'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormErrors = {
  fullName?: string;
  city?: string;
  email?: string;
  password?: string;
};

// City Picker Component
const CityPicker: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  selectedCity: string;
}> = ({ visible, onClose, onSelect, selectedCity }) => {
  const [search, setSearch] = useState('');
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5,
      }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible]);

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: string) => {
    onSelect(city);
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.cityPickerContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.cityPickerHandle} />
            <Text style={styles.cityPickerTitle}>Select City</Text>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cities..."
                placeholderTextColor={Colors.textPlaceholder}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Feather name="x" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* City List */}
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              style={styles.cityList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    selectedCity === item && styles.cityItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Feather
                    name="map-pin"
                    size={18}
                    color={selectedCity === item ? '#8A81F1' : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.cityItemText,
                      selectedCity === item && styles.cityItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedCity === item && (
                    <Feather name="check" size={20} color="#8A81F1" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No cities found</Text>
              }
            />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // Validate a single field
  const validateField = (field: keyof FormErrors, value: string) => {
    const fieldSchema = signupSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      const issues = result.error.issues;
      setErrors((prev) => ({ ...prev, [field]: issues[0]?.message }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle field blur - validate when user leaves the field
  const handleBlur = (field: keyof FormErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  // Clear error when user starts typing
  const handleChange = (field: keyof FormErrors, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touched[field] && errors[field]) {
      // Re-validate as user types if they've already seen an error
      validateField(field, value);
    }
  };

  // Handle city selection
  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setTouched((prev) => ({ ...prev, city: true }));
    setErrors((prev) => ({ ...prev, city: undefined }));
  };

  // Validate all fields on submit
  const validateForm = (): boolean => {
    const result = signupSchema.safeParse({ fullName, city, email, password });

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      setTouched({ fullName: true, city: true, email: true, password: true });
      return false;
    }

    setErrors({});
    return true;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            city: city,
            avatar_url: profileImage,
          },
        },
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
        return;
      }

      if (data.user) {
        Alert.alert(
          'Check Your Email',
          'We sent you a verification link. Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add a profile photo.');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Profile Photo',
      'Allow access to your photo library to add a profile photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: pickImage,
        },
      ]
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <Text style={styles.headerTitle}>Create your account</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Top Spacer */}
          <View style={styles.topSpacer} />

          {/* Avatar Upload */}
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={52} color={Colors.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={handleCameraPress}
              activeOpacity={0.7}
            >
              <Feather name="camera" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Input
              icon="user"
              placeholder="Full Name"
              value={fullName}
              onChangeText={(value) => handleChange('fullName', value, setFullName)}
              onBlur={() => handleBlur('fullName', fullName)}
              autoCapitalize="words"
              error={touched.fullName ? errors.fullName : undefined}
            />

            {/* City Picker Field */}
            <TouchableOpacity
              style={[styles.pickerField, touched.city && errors.city && styles.pickerFieldError]}
              onPress={() => setCityPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="map-pin" size={20} color={Colors.textSecondary} style={styles.pickerIcon} />
              <Text style={[styles.pickerText, !city && styles.pickerPlaceholder]}>
                {city || 'City'}
              </Text>
              <Feather name="chevron-down" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            {touched.city && errors.city && (
              <Text style={styles.errorText}>{errors.city}</Text>
            )}

            <Input
              icon="mail"
              placeholder="Email"
              value={email}
              onChangeText={(value) => handleChange('email', value, setEmail)}
              onBlur={() => handleBlur('email', email)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={touched.email ? errors.email : undefined}
            />
            <Input
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={(value) => handleChange('password', value, setPassword)}
              onBlur={() => handleBlur('password', password)}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={togglePasswordVisibility}
              error={touched.password ? errors.password : undefined}
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.createAccountButton, isLoading && styles.createAccountButtonDisabled]}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            <Text style={styles.createAccountButtonText}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Text>
          </TouchableOpacity>

          {/* Flexible Spacer */}
          <View style={styles.flexSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* City Picker Modal */}
      <CityPicker
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
        onSelect={handleCitySelect}
        selectedCity={city}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  topSpacer: {
    height: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 4,
    right: '32%',
    backgroundColor: '#8A81F1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 36,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: Colors.borderRadius,
    paddingHorizontal: 16,
    height: 56,
  },
  pickerFieldError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: Colors.textPlaceholder,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: -10,
    marginLeft: 4,
  },
  createAccountButton: {
    backgroundColor: '#8A81F1',
    borderRadius: Colors.borderRadius,
    paddingVertical: 18,
    alignItems: 'center',
  },
  createAccountButtonDisabled: {
    opacity: 0.6,
  },
  createAccountButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  flexSpacer: {
    flex: 1,
    minHeight: 40,
  },
  // City Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  cityPickerContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  cityPickerHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cityPickerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    marginLeft: 10,
  },
  cityList: {
    maxHeight: 300,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
  },
  cityItemSelected: {
    backgroundColor: 'rgba(138, 129, 241, 0.15)',
  },
  cityItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  cityItemTextSelected: {
    color: '#8A81F1',
    fontWeight: '600',
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
