import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {useAuthStore} from '../../core/store/authStore';
import {useChatStore} from '../../core/store/chatStore';
import {colors} from '../../core/theme/colors';
import {supabase} from '../../services/supabase/client';

export const ChatRoomScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const {user} = useAuthStore();
  const {messages, addMessage, setMessages, setActiveChat} = useChatStore();
  const theme = isDark ? colors.dark : colors.light;

  const {chatId, chatName} = route.params;
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const channelRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const {data, error} = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', {ascending: true})
        .limit(100);

      if (error) throw error;
      setMessages(chatId, data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
    setActiveChat({id: chatId, name: chatName});

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        addMessage(chatId, payload.new);
        setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      setActiveChat(null);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    const text = inputText.trim();
    setInputText('');

    try {
      const {error} = await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: user.id,
        content: text,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update last message in chat
      await supabase.from('chats').update({
        last_message: text,
        last_message_at: new Date().toISOString(),
      }).eq('id', chatId);

    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({item}) => {
    const isMe = item.sender_id === user?.id;
    const time = new Date(item.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <View style={[
          styles.messageBubble,
          isMe ? [styles.myBubble, {backgroundColor: colors.neon.lime}] : [styles.theirBubble, {backgroundColor: theme.surfaceElevated}]
        ]}>
          <Text style={[styles.messageText, {color: isMe ? '#000' : theme.text}]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, {color: isMe ? 'rgba(0,0,0,0.5)' : theme.textMuted}]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  const chatMessages = messages[chatId] || [];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View style={[styles.header, {borderBottomColor: theme.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{fontSize: 24}}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, {color: theme.text}]} numberOfLines={1}>
            {chatName}
          </Text>
          <Text style={[styles.headerStatus, {color: colors.semantic.online}]}>
            {t('online')}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Text style={{fontSize: 20}}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.neon.lime} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: false})}
        />
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, {backgroundColor: theme.surface, borderTopColor: theme.border}]}>
          <TouchableOpacity style={styles.inputAction}>
            <Text style={{fontSize: 22}}>😊</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, {color: theme.text, backgroundColor: theme.inputBg}]}
            placeholder={t('typeMessage')}
            placeholderTextColor={theme.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
          >
            <Text style={{fontSize: 18}}>➤</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {padding: 4},
  headerInfo: {flex: 1, marginLeft: 8},
  headerTitle: {fontSize: 17, fontWeight: '600'},
  headerStatus: {fontSize: 12, marginTop: 2},
  headerAction: {padding: 8},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  messagesList: {padding: 16, paddingBottom: 20},
  messageContainer: {marginBottom: 12, maxWidth: '80%'},
  myMessage: {alignSelf: 'flex-end'},
  theirMessage: {alignSelf: 'flex-start'},
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubble: {
    borderBottomRightRadius: 4,
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  theirBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {fontSize: 15, lineHeight: 20},
  messageTime: {fontSize: 10, marginTop: 4, alignSelf: 'flex-end'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  inputAction: {padding: 8},
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neon.lime,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  sendBtnDisabled: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
});
