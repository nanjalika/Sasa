import {create} from 'zustand';

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: {},
  activeChat: null,
  typingUsers: {},
  onlineUsers: new Set(),

  setChats: (chats) => set({chats}),
  addChat: (chat) => set((state) => ({chats: [chat, ...state.chats]})),
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(c => c.id === chatId ? {...c, ...updates} : c)
  })),

  setMessages: (chatId, messages) => set((state) => ({
    messages: {...state.messages, [chatId]: messages}
  })),
  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message]
    }
  })),

  setActiveChat: (chat) => set({activeChat: chat}),
  setTyping: (chatId, userId, isTyping) => set((state) => ({
    typingUsers: {...state.typingUsers, [`${chatId}_${userId}`]: isTyping}
  })),

  setOnlineStatus: (userId, isOnline) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    if (isOnline) newSet.add(userId);
    else newSet.delete(userId);
    return {onlineUsers: newSet};
  }),
}));
