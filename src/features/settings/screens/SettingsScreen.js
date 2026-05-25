import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useLanguageStore} from '../../core/store/languageStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const {isDark, toggleTheme} = useThemeStore();
  const {language, setLanguage} = useLanguageStore();
  const theme = isDark ? colors.dark : colors.light;

  const languages = [
    {code: 'en', label: t('english')},
    {code: 'sw', label: t('swahili')},
    {code: 'zh', label: t('chinese')},
  ];

  const settingsSections = [
    {
      title: t('account'),
      items: [
        {icon: 'person-outline', label: 'Edit Profile', action: () => {}},
        {icon: 'shield-checkmark-outline', label: 'Privacy', action: () => {}},
        {icon: 'notifications-outline', label: t('notifications'), action: () => {}},
      ],
    },
    {
      title: t('settings'),
      items: [
        {icon: 'language-outline', label: t('language'), action: null, isLanguage: true},
        {icon: 'moon-outline', label: t('theme'), action: null, isTheme: true},
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{fontSize: 24}}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, {color: theme.text}]}>{t('settings')}</Text>
          <View style={{width: 40}} />
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}]}>{t('language')}</Text>
          <GlassCard>
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  index < languages.length - 1 && {borderBottomWidth: 1, borderBottomColor: theme.border},
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[styles.languageText, {color: theme.text}]}>{lang.label}</Text>
                {language === lang.code && (
                  <Icon name="checkmark" size={20} color={colors.neon.lime} />
                )}
              </TouchableOpacity>
            ))}
          </GlassCard>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}]}>{t('theme')}</Text>
          <GlassCard>
            <View style={styles.themeRow}>
              <View style={styles.themeInfo}>
                <Icon 
                  name={isDark ? "moon-outline" : "sunny-outline"} 
                  size={22} 
                  color={colors.neon.lime} 
                />
                <Text style={[styles.themeText, {color: theme.text, marginLeft: 12}]}>
                  {isDark ? t('dark') : t('light')} Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{false: '#767577', true: colors.neon.limeDim}}
                thumbColor={isDark ? colors.neon.lime : '#f4f3f4'}
              />
            </View>
          </GlassCard>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}]}>{t('account')}</Text>
          <GlassCard>
            {settingsSections[0].items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingItem,
                  index < settingsSections[0].items.length - 1 && {borderBottomWidth: 1, borderBottomColor: theme.border},
                ]}
                onPress={item.action}
              >
                <View style={styles.settingLeft}>
                  <Icon name={item.icon} size={20} color={colors.neon.lime} />
                  <Text style={[styles.settingText, {color: theme.text, marginLeft: 12}]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{fontSize: 18}}>→</Text>
              </TouchableOpacity>
            ))}
          </GlassCard>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}]}>Legal</Text>
          <GlassCard>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={{fontSize: 18}}>📄</Text>
                <Text style={[styles.settingText, {color: theme.text, marginLeft: 12}]}>
                  {t('termsOfUse')}
                </Text>
              </View>
              <Text style={{fontSize: 18}}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, {borderTopWidth: 1, borderTopColor: theme.border}]}>
              <View style={styles.settingLeft}>
                <Icon name="lock-closed-outline" size={20} color={colors.neon.lime} />
                <Text style={[styles.settingText, {color: theme.text, marginLeft: 12}]}>
                  {t('privacyPolicy')}
                </Text>
              </View>
              <Text style={{fontSize: 18}}>→</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>

        <Text style={[styles.version, {color: theme.textMuted}]}>Sasa v1.0.0</Text>
      </ScrollView>
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
    marginBottom: 8,
  },
  backBtn: {padding: 4},
  title: {fontSize: 18, fontWeight: '600'},
  section: {marginBottom: 24, paddingHorizontal: 16},
  sectionTitle: {fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8},
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  languageText: {fontSize: 15, fontWeight: '500'},
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  themeInfo: {flexDirection: 'row', alignItems: 'center'},
  themeText: {fontSize: 15, fontWeight: '500'},
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  settingLeft: {flexDirection: 'row', alignItems: 'center'},
  settingText: {fontSize: 15, fontWeight: '500'},
  version: {textAlign: 'center', fontSize: 12, marginBottom: 40},
});
