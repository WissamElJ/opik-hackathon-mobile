import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
}

export const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {
  return (
    <View style={styles.container}>
      <Feather name={icon} size={20} color={Colors.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textPlaceholder}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Colors.borderRadius,
    paddingHorizontal: 16,
    height: 56,
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
});
