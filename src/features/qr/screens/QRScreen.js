import React, {useEffect, useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Share
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import QRCode from 'react-native-qrcode-svg';

import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';
import {NeonButton} from '../../shared/components/NeonButton';
import {supabase} from '../../services/supabase/client';

export const QRScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const theme = isDark ? colors.dark : colors.light;

  const [profile, setProfile] = useState(null);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const {data} = await supabase
      .from('profiles')
      .select('sasa_id, username')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setQrValue(JSON.stringify({
        type: 'sasa_contact',
        sasa_id: data.sasa_id,
        username: data.username,
      }));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Add me on Sasa! My ID: ${profile?.sasa_id || ''}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{fontSize: 24}}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.text}]}>{t('myQR')}</Text>
        <View style={{width: 40}} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.instruction, {color: theme.textSecondary}]}>
          Let others scan this to add you
        </Text>

        <GlassCard style={styles.qrCard}>
          <View style={styles.qrContainer}>
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={220}
                color={isDark ? '#FFFFFF' : '#000000'}
                backgroundColor="transparent"
                logo={require('../../../assets/images/sasa_logo.png')}
                logoSize={40}
                logoBackgroundColor="transparent"
              />
            ) : (
              <View style={[styles.qrPlaceholder, {backgroundColor: theme.inputBg}]} />
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.username, {color: theme.text}]}>
              {profile?.username || 'User'}
            </Text>
            <Text style={[styles.sasaId, {color: theme.textSecondary}]}>
              {t('sasaID')}: {profile?.sasa_id || ''}
            </Text>
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <NeonButton
            title="Share Sasa ID"
            onPress={handleShare}
            style={styles.actionBtn}
          />
          <NeonButton
            title={t('scanQR')}
            onPress={() => navigation.navigate('QRScanner')}
            variant="secondary"
            style={styles.actionBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {padding: 4},
  title: {fontSize: 18, fontWeight: '600'},
  content: {flex: 1, alignItems: 'center', paddingHorizontal: 24},
  instruction: {fontSize: 14, marginBottom: 24, marginTop: 20},
  qrCard: {
    width: '100%',
    alignItems: 'center',
    padding: 32,
  },
  qrContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  qrPlaceholder: {width: 220, height: 220, borderRadius: 12},
  userInfo: {alignItems: 'center'},
  username: {fontSize: 20, fontWeight: 'bold', marginBottom: 4},
  sasaId: {fontSize: 14, letterSpacing: 1},
  actions: {width: '100%', marginTop: 32, gap: 12},
  actionBtn: {width: '100%'},
});
