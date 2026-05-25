import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';

export const NeonInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  icon,
  style,
  multiline,
  maxLength,
  autoCapitalize = 'none',
}) => {
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.container, {backgroundColor: theme.inputBg, borderColor: theme.border}, style]}>
      {icon && (
        <Text style={styles.icon}>{icon}</Text>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={[styles.input, {color: theme.text}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginVertical: 8,
  },
  icon: {
    marginRight: 12,
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
});
