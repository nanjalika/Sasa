import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';

export const NeonButton = ({title, onPress, style, textStyle, variant = 'primary', disabled}) => {
  const {isDark} = useThemeStore();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {toValue: 0.95, useNativeDriver: true}).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true}).start();
  };

  const isPrimary = variant === 'primary';

  return (
    <Animated.View style={[{transform: [{scale: scaleAnim}]}, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.neon.lime,
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disabled: {opacity: 0.5},
  text: {fontSize: 16, fontWeight: '600'},
  primaryText: {color: '#000000'},
  secondaryText: {color: '#FFFFFF'},
});
