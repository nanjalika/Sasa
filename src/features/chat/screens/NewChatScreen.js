import React, {useState} from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {colors} from '../../core/theme/colors';
import {NeonInput} from '../../shared/components/NeonInput';
import {GlassCard} from '../../shared/components/GlassCard';
import {supabase} from '../../services/supabase/client';

export const NewChatScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const theme = isDark ? colors.dark : colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select('id, username, sasa_id, avatar_url')
        .or(`username.ilike.%${query}%,sasa_id.ilike.%${query}%`)
        .neq('id', user.id)
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (otherUser) => {
    try {
      // Check if chat already exists
      const {data: existing} = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', user.id)
        .in('chat_id', supabase
          .from('chat_participants')
          .select('chat_id')
          .eq('user_id', otherUser.id)
        );

      if (existing && existing.length > 0) {
        navigation.navigate('ChatRoom', {
          chatId: existing[0].chat_id,
          chatName: otherUser.username,
        });
        return;
      }

      // Create new chat
      const {data: chat, error: chatError} = await supabase
        .from('chats')
        .insert({name: otherUser.username, is_group: false})
        .select()
        .single();

      if (chatError) throw chatError;

      // Add participants
      await supabase.from('chat_participants').insert([
        {chat_id: chat.id, user_id: user.id},
        {chat_id: chat.id, user_id: otherUser.id},
      ]);

      navigation.navigate('ChatRoom', {
        chatId: chat.id,
        chatName: otherUser.username,
      });
    } catch (err) {
      console.error('Error starting chat:', err);
    }
  };

  const renderUser = ({item}) => (
    <TouchableOpacity onPress={() => startChat(item)} activeOpacity={0.7}>
      <GlassCard style={styles.userCard}>
        <View style={styles.userRow}>
          <View style={[styles.avatar, {backgroundColor: colors.neon.limeDim}]}>
            <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, {color: theme.text}]}>{item.username}</Text>
            <Text style={[styles.userId, {color: theme.textMuted}]}>ID: {item.sasa_id}</Text>
          </View>
          <Text style={{fontSize: 18}}>→</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{fontSize: 24}}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, {color: theme.text}]}>{t('newChat')}</Text>
          <View style={{width: 40}} />
        </View>

        <NeonInput
          placeholder={`${t('search')} by username or Sasa ID...`}
          value={searchQuery}
          onChangeText={searchUsers}
          icon="search-outline"
          style={{marginHorizontal: 16, marginBottom: 12}}
        />

        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searchQuery.length >= 2 ? (
              <Text style={[styles.emptyText, {color: theme.textMuted}]}>
                {loading ? 'Searching...' : 'No users found'}
              </Text>
            ) : null
          }
        />
      </KeyboardAvoidingView>
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
  list: {padding: 16, paddingBottom: 100},
  userCard: {marginBottom: 10},
  userRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 18, fontWeight: 'bold', color: colors.neon.lime},
  userInfo: {flex: 1, marginLeft: 12},
  userName: {fontSize: 15, fontWeight: '600'},
  userId: {fontSize: 12, marginTop: 2},
  emptyText: {textAlign: 'center', marginTop: 40, fontSize: 14},
});
