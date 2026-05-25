import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';

export const SplashScreen = () => {
  const navigation = useNavigation();
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;

  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
        Animated.timing(scaleAnim, {toValue: 1, duration: 1000, useNativeDriver: true}),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {toValue: 1, duration: 1500, useNativeDriver: true}),
          Animated.timing(glowAnim, {toValue: 0.3, duration: 1500, useNativeDriver: true}),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Animated.View style={[styles.logoContainer, {opacity: fadeAnim, transform: [{scale: scaleAnim}]}]}>
        <Animated.View style={[styles.glowRing, {opacity: glowAnim}]} />
        <View style={styles.logoInner}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </Animated.View>
      <Animated.Text style={[styles.appName, {opacity: fadeAnim}]}>Sasa</Animated.Text>
      <Animated.Text style={[styles.tagline, {opacity: fadeAnim}]}>Connect. Chat. Glow.</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoContainer: {width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 24},
  glowRing: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: colors.neon.limeGlow,
    shadowColor: colors.neon.lime, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8, shadowRadius: 20,
  },
  logoInner: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: colors.neon.lime,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.neon.lime, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 10,
  },
  logoText: {fontSize: 48, fontWeight: 'bold', color: '#000000'},
  appName: {fontSize: 36, fontWeight: 'bold', color: colors.neon.lime, letterSpacing: 4, marginTop: 16},
  tagline: {fontSize: 14, color: '#666', marginTop: 8, letterSpacing: 2},
});
