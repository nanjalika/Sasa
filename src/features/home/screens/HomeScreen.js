import React, {useEffect, useState, useRef} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  FlatList, Dimensions, Animated, Image, SafeAreaView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';
import {NeonInput} from '../../shared/components/NeonInput';
import {supabase} from '../../services/supabase/client';

const {width} = Dimensions.get('window');

const AD_CARDS = [
  {id: '1', title: 'Premium Chat', subtitle: 'Experience the future', emoji: '💬'},
  {id: '2', title: 'Neon Glow', subtitle: 'Stand out always', emoji: '✨'},
  {id: '3', title: 'Secure', subtitle: 'End-to-end encrypted', emoji: '🔒'},
  {id: '4', title: 'Global', subtitle: 'Connect worldwide', emoji: '🌍'},
  {id: '5', title: 'Instant', subtitle: 'Real-time messaging', emoji: '⚡'},
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {profile} = useAuthStore();
  const theme = isDark ? colors.dark : colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchSuggestedUsers();
    fetchRecentChats();
  }, []);

  const fetchSuggestedUsers = async () => {
    const {data} = await supabase
      .from('profiles')
      .select('id, username, avatar_url, sasa_id')
      .limit(5);
    if (data) setSuggestedUsers(data);
  };

  const fetchRecentChats = async () => {
    // Fetch recent chats logic
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderAdCard = ({item, index}) => {
    const inputRange = [
      (index - 1) * (width * 0.7 + 16),
      index * (width * 0.7 + 16),
      (index + 1) * (width * 0.7 + 16),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.adCardContainer, {transform: [{scale}]}]}>
        <GlassCard style={styles.adCard}>
          <Text style={styles.adEmoji}>{item.emoji}</Text>
          <Text style={[styles.adTitle, {color: theme.text}]}>{item.title}</Text>
          <Text style={[styles.adSubtitle, {color: theme.textSecondary}]}>{item.subtitle}</Text>
        </GlassCard>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, {color: theme.textSecondary}]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.appName, {color: colors.neon.lime}]}>
              {t('appName')}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={{fontSize: 22}}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <NeonInput
          placeholder={t('search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
          style={{marginHorizontal: 16, marginBottom: 16}}
        />

        {/* Suggested Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>{t('suggested')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedScroll}>
            {suggestedUsers.map((user) => (
              <TouchableOpacity key={user.id} style={styles.suggestedItem}>
                <View style={[styles.avatar, {backgroundColor: colors.neon.limeDim}]}>
                  <Text style={styles.avatarText}>{user.username?.[0]?.toUpperCase() || '?'}</Text>
                </View>
                <Text style={[styles.suggestedName, {color: theme.text}]} numberOfLines={1}>
                  {user.username}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ad Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Featured</Text>
          <Animated.FlatList
            data={AD_CARDS}
            renderItem={renderAdCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.adList}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true}
            )}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>{t('recent')}</Text>
          {recentChats.length === 0 && (
            <GlassCard style={styles.emptyCard}>
              <Text style={[styles.emptyText, {color: theme.textMuted}]}>
                {t('noMessages')}
              </Text>
              <TouchableOpacity 
                style={styles.startChatBtn}
                onPress={() => navigation.navigate('Chat')}
              >
                <Text style={[styles.startChatText, {color: colors.neon.lime}]}>
                  Start Chatting
                </Text>
              </TouchableOpacity>
            </GlassCard>
          )}
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
  greeting: {fontSize: 14, marginBottom: 4},
  appName: {fontSize: 28, fontWeight: 'bold', letterSpacing: 2},
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neon.lime,
  },
  section: {marginTop: 24, paddingHorizontal: 16},
  sectionTitle: {fontSize: 18, fontWeight: '700', marginBottom: 12},
  suggestedScroll: {marginHorizontal: -4},
  suggestedItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarText: {fontSize: 20, fontWeight: 'bold', color: colors.neon.lime},
  suggestedName: {fontSize: 12, textAlign: 'center'},
  adList: {paddingHorizontal: 8, paddingVertical: 8},
  adCardContainer: {width: width * 0.7, marginHorizontal: 8},
  adCard: {padding: 20, alignItems: 'center'},
  adEmoji: {fontSize: 40, marginBottom: 12},
  adTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 4},
  adSubtitle: {fontSize: 13},
  emptyCard: {alignItems: 'center', padding: 24},
  emptyText: {fontSize: 14, marginBottom: 12},
  startChatBtn: {paddingVertical: 8, paddingHorizontal: 16},
  startChatText: {fontSize: 14, fontWeight: '600'},
});
