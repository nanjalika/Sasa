import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';
import {NeonButton} from '../../shared/components/NeonButton';
import {NeonInput} from '../../shared/components/NeonInput';
import {GlassCard} from '../../shared/components/GlassCard';
import {useAuth} from './hooks/useAuth';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;
  const {signInWithEmail, signInWithGoogle, signInWithApple, loading} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'

  const handleLogin = async () => {
    if (activeTab === 'email') {
      await signInWithEmail(email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.text}]}>{t('welcome')}</Text>
          <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
            {t('appName')} — {t('login')}
          </Text>
        </View>

        <GlassCard style={styles.card}>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.activeTab]}
              onPress={() => setActiveTab('email')}
            >
              <Text style={[styles.tabText, {color: activeTab === 'email' ? colors.neon.lime : theme.textMuted}]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
              onPress={() => setActiveTab('phone')}
            >
              <Text style={[styles.tabText, {color: activeTab === 'phone' ? colors.neon.lime : theme.textMuted}]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'email' ? (
            <>
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
            </>
          ) : (
            <>
              <NeonInput
                placeholder={t('phone')}
                value={email}
                onChangeText={setEmail}
                keyboardType="phone-pad"
                icon="call-outline"
              />
              <NeonInput
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed-outline"
              />
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.forgotText, {color: colors.neon.lime}]}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          <NeonButton
            title={t('signIn')}
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, {backgroundColor: theme.border}]} />
            <Text style={[styles.dividerText, {color: theme.textMuted}]}>{t('or')}</Text>
            <View style={[styles.dividerLine, {backgroundColor: theme.border}]} />
          </View>

          <NeonButton
            title={t('continueWithGoogle')}
            onPress={signInWithGoogle}
            variant="secondary"
            style={styles.socialButton}
            disabled={loading}
          />
          <NeonButton
            title={t('continueWithApple')}
            onPress={signInWithApple}
            variant="secondary"
            style={styles.socialButton}
            disabled={loading}
          />
        </GlassCard>

        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: theme.textSecondary}]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, {color: colors.neon.lime}]}>{t('signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(204, 255, 0, 0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  forgotText: {
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
    fontSize: 13,
  },
  button: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
  },
  socialButton: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
