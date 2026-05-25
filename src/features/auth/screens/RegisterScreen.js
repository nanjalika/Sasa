import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';
import {NeonButton} from '../../shared/components/NeonButton';
import {NeonInput} from '../../shared/components/NeonInput';
import {GlassCard} from '../../shared/components/GlassCard';
import {useAuth} from '../hooks/useAuth';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;
  const {signUpWithEmail, loading} = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return;
    }
    await signUpWithEmail(email, password, username);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.text}]}>{t('signUp')}</Text>
          <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
            Create your {t('appName')} account
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <NeonInput
            placeholder={t('username')}
            value={username}
            onChangeText={setUsername}
            icon="person-outline"
            autoCapitalize="words"
          />
          <NeonInput
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <NeonInput
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />
          <NeonInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="shield-checkmark-outline"
          />

          <NeonButton
            title={t('signUp')}
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          />
        </GlassCard>

        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.textSecondary}]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, {color: colors.neon.lime}]}>{t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {flexGrow: 1, justifyContent: 'center', padding: 24},
  header: {alignItems: 'center', marginBottom: 32},
  title: {fontSize: 32, fontWeight: 'bold', marginBottom: 8},
  subtitle: {fontSize: 16},
  card: {width: '100%'},
  button: {marginTop: 8},
  footer: {flexDirection: 'row', justifyContent: 'center', marginTop: 24},
  footerText: {fontSize: 14},
  footerLink: {fontSize: 14, fontWeight: '600'},
});
