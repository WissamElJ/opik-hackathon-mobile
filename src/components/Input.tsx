import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({ 
  icon, 
  error, 
  rightIcon, 
  onRightIconPress, 
  style, 
  ...props 
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error && styles.containerError]}>
        <Feather name={icon} size={20} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textPlaceholder}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconButton}>
            <Feather name={rightIcon} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: Colors.borderRadius,
    paddingHorizontal: 16,
    height: 56,
  },
  containerError: {
    borderWidth: 1,
    borderColor: '#FF453A',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    height: '100%',
  },
  rightIconButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
