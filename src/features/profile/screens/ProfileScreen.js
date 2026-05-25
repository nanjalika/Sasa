import React, {useEffect, useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, 
  SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';
import {NeonButton} from '../../shared/components/NeonButton';
import {useAuth} from '../auth/hooks/useAuth';
import {supabase} from '../../services/supabase/client';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const {signOut} = useAuth();
  const theme = isDark ? colors.dark : colors.light;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <ActivityIndicator color={colors.neon.lime} style={{marginTop: 100}} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.text}]}>{t('profile')}</Text>
          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={{fontSize: 22}}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, {borderColor: colors.neon.lime}]}>
            <View style={[styles.avatar, {backgroundColor: colors.neon.limeDim}]}>
              <Text style={styles.avatarText}>
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <Text style={[styles.username, {color: theme.text}]}>
            {profile?.username || 'User'}
          </Text>
          <Text style={[styles.sasaId, {color: theme.textSecondary}]}>
            {t('sasaID')}: {profile?.sasa_id || 'N/A'}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={20} color={colors.neon.lime} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, {color: theme.textMuted}]}>Email</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {profile?.email || user?.email || 'Not set'}
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="call-outline" size={20} color={colors.neon.lime} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, {color: theme.textMuted}]}>Phone</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {profile?.phone || user?.phone || 'Not set'}
                </Text>
              </View>
            </View>
          </GlassCard>

          <TouchableOpacity onPress={() => navigation.navigate('QR')}>
            <GlassCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={{fontSize: 18}}>🔲</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: theme.textMuted}]}>My QR Code</Text>
                  <Text style={[styles.infoValue, {color: theme.text}]}>
                    Share to add contacts
                  </Text>
                </View>
                <Text style={{fontSize: 18}}>→</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
            <GlassCard style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={{fontSize: 18}}>📷</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: theme.textMuted}]}>Scan QR</Text>
                  <Text style={[styles.infoValue, {color: theme.text}]}>
                    Add contacts by scanning
                  </Text>
                </View>
                <Text style={{fontSize: 18}}>→</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <TouchableOpacity>
            <Text style={[styles.termsText, {color: theme.textMuted}]}>
              {t('termsOfUse')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.dot, {color: theme.textMuted}]}> • </Text>
          <TouchableOpacity>
            <Text style={[styles.termsText, {color: theme.textMuted}]}>
              {t('privacyPolicy')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <NeonButton
            title={t('logout')}
            onPress={signOut}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {fontSize: 28, fontWeight: 'bold'},
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.neon.lime,
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarText: {fontSize: 40, fontWeight: 'bold', color: colors.neon.lime},
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.semantic.online,
    borderWidth: 3,
    borderColor: '#000',
  },
  username: {fontSize: 24, fontWeight: 'bold', marginBottom: 4},
  sasaId: {fontSize: 14, letterSpacing: 1},
  infoSection: {paddingHorizontal: 16, gap: 12},
  infoCard: {marginBottom: 12},
  infoRow: {flexDirection: 'row', alignItems: 'center'},
  infoTextContainer: {flex: 1, marginLeft: 14},
  infoLabel: {fontSize: 12, marginBottom: 2},
  infoValue: {fontSize: 15, fontWeight: '500'},
  termsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  termsText: {fontSize: 13},
  dot: {fontSize: 13},
  logoutSection: {paddingHorizontal: 16, marginBottom: 40},
});
