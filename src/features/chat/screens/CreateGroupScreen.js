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
import {NeonButton} from '../../shared/components/NeonButton';
import {GlassCard} from '../../shared/components/GlassCard';
import {supabase} from '../../services/supabase/client';

export const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const theme = isDark ? colors.dark : colors.light;

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const searchUsers = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    const {data} = await supabase
      .from('profiles')
      .select('id, username, sasa_id')
      .ilike('username', `%${query}%`)
      .neq('id', user.id)
      .limit(20);
    setUsers(data || []);
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    try {
      const {data: chat, error} = await supabase
        .from('chats')
        .insert({name: groupName.trim(), is_group: true})
        .select()
        .single();

      if (error) throw error;

      const participants = [
        {chat_id: chat.id, user_id: user.id, is_admin: true},
        ...selectedUsers.map(id => ({chat_id: chat.id, user_id: id, is_admin: false})),
      ];

      await supabase.from('chat_participants').insert(participants);
      navigation.navigate('ChatRoom', {chatId: chat.id, chatName: groupName.trim()});
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const renderUser = ({item}) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleUser(item.id)} activeOpacity={0.7}>
        <GlassCard style={[styles.userCard, isSelected && styles.selectedCard]}>
          <View style={styles.userRow}>
            <View style={[styles.avatar, {backgroundColor: colors.neon.limeDim}]}>
              <Text style={styles.avatarText}>{item.username[0].toUpperCase()}</Text>
            </View>
            <Text style={[styles.userName, {color: theme.text, flex: 1}]}>{item.username}</Text>
            <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
              {isSelected && <Text style={{fontSize: 14}}>✓</Text>}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

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
          <Text style={[styles.title, {color: theme.text}]}>{t('newGroup')}</Text>
          <View style={{width: 40}} />
        </View>

        <NeonInput
          placeholder={t('groupName')}
          value={groupName}
          onChangeText={setGroupName}
          icon="people-outline"
          style={{marginHorizontal: 16, marginBottom: 8}}
        />

        <NeonInput
          placeholder={`${t('search')} ${t('addMember')}...`}
          value={searchQuery}
          onChangeText={searchUsers}
          icon="search-outline"
          style={{marginHorizontal: 16, marginBottom: 12}}
        />

        <Text style={[styles.selectedCount, {color: theme.textSecondary}]}>
          {selectedUsers.length} {t('members')} selected
        </Text>

        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />

        <View style={styles.footer}>
          <NeonButton
            title={t('confirm')}
            onPress={createGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0}
          />
        </View>
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
  selectedCount: {fontSize: 13, marginHorizontal: 20, marginBottom: 8},
  list: {padding: 16, paddingBottom: 100},
  userCard: {marginBottom: 10},
  selectedCard: {borderColor: colors.neon.lime, borderWidth: 1},
  userRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {fontSize: 16, fontWeight: 'bold', color: colors.neon.lime},
  userName: {fontSize: 15, fontWeight: '600'},
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: colors.neon.lime,
    borderColor: colors.neon.lime,
  },
  footer: {padding: 16, paddingBottom: 30},
});
