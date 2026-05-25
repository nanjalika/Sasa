import React, {useEffect, useState, useCallback} from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  RefreshControl, SafeAreaView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {useChatStore} from '../../core/store/chatStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';
import {supabase} from '../../services/supabase/client';

export const ChatListScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const {chats, setChats} = useChatStore();
  const theme = isDark ? colors.dark : colors.light;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const {data, error} = await supabase
        .from('chat_participants')
        .select(`
          chat_id,
          chats:chat_id(id, name, is_group, created_at, last_message, last_message_at)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedChats = data?.map(item => ({
        ...item.chats,
        chat_id: item.chat_id,
      })) || [];

      setChats(formattedChats);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChats();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const renderChatItem = ({item}) => {
    const isOnline = false; // Will be connected to presence
    const time = item.last_message_at 
      ? new Date(item.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      : '';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatRoom', {chatId: item.id, chatName: item.name || 'Chat'})}
        activeOpacity={0.7}
      >
        <GlassCard style={styles.chatCard}>
          <View style={styles.chatRow}>
            <View style={[styles.avatar, {backgroundColor: colors.neon.limeDim}]}>
              <Text style={styles.avatarText}>
                {(item.name || 'C')[0].toUpperCase()}
              </Text>
              {isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, {color: theme.text}]} numberOfLines={1}>
                  {item.name || 'Unknown'}
                </Text>
                <Text style={[styles.chatTime, {color: theme.textMuted}]}>{time}</Text>
              </View>
              <Text style={[styles.lastMessage, {color: theme.textSecondary}]} numberOfLines={1}>
                {item.last_message || t('noMessages')}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.text}]}>{t('messages')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.navigate('NewChat')}
          >
            <Text style={{fontSize: 20}}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={{fontSize: 20}}>👥</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.neon.lime} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.textMuted}]}>
              {t('noMessages')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
              <Text style={[styles.emptyAction, {color: colors.neon.lime}]}>
                {t('newChat')}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerActions: {flexDirection: 'row'},
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  list: {padding: 16, paddingBottom: 100},
  chatCard: {marginBottom: 12},
  chatRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {fontSize: 20, fontWeight: 'bold', color: colors.neon.lime},
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.semantic.online,
    borderWidth: 2,
    borderColor: '#000',
  },
  chatInfo: {flex: 1, marginLeft: 14},
  chatHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4},
  chatName: {fontSize: 16, fontWeight: '600', flex: 1},
  chatTime: {fontSize: 12, marginLeft: 8},
  lastMessage: {fontSize: 14},
  emptyContainer: {alignItems: 'center', marginTop: 60},
  emptyText: {fontSize: 16, marginBottom: 12},
  emptyAction: {fontSize: 16, fontWeight: '600'},
});
