import React, {useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';
import {NeonButton} from '../../shared/components/NeonButton';
import {NeonInput} from '../../shared/components/NeonInput';
import {GlassCard} from '../../shared/components/GlassCard';
import {useAuth} from '../hooks/useAuth';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;
  const {resetPassword, loading} = useAuth();

  const [email, setEmail] = useState('');

  const handleReset = async () => {
    await resetPassword(email);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.text}]}>{t('forgotPassword')}</Text>
          <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
            Enter your email to receive a reset link
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <NeonInput
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <NeonButton
            title="Send Reset Link"
            onPress={handleReset}
            style={styles.button}
            disabled={loading}
          />
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {flexGrow: 1, justifyContent: 'center', padding: 24},
  header: {alignItems: 'center', marginBottom: 32},
  title: {fontSize: 28, fontWeight: 'bold', marginBottom: 8},
  subtitle: {fontSize: 14, textAlign: 'center'},
  card: {width: '100%'},
  button: {marginTop: 8},
});
