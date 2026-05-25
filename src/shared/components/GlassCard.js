import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BlurView} from 'expo-blur';
import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';

export const GlassCard = ({children, style}) => {
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.container, style]}>
      <BlurView
        style={styles.blur}
        intensity={isDark ? 40 : 60}
        tint={isDark ? 'dark' : 'light'}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 16,
    zIndex: 1,
  },
});
