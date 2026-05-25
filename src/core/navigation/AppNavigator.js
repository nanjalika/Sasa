import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import {HomeScreen} from '../../features/home/screens/HomeScreen';
import {ChatListScreen} from '../../features/chat/screens/ChatListScreen';
import {ChatRoomScreen} from '../../features/chat/screens/ChatRoomScreen';
import {ProfileScreen} from '../../features/profile/screens/ProfileScreen';
import {SettingsScreen} from '../../features/settings/screens/SettingsScreen';
import {QRScreen} from '../../features/qr/screens/QRScreen';
import {QRScannerScreen} from '../../features/qr/screens/QRScannerScreen';
import {CreateGroupScreen} from '../../features/chat/screens/CreateGroupScreen';
import {NewChatScreen} from '../../features/chat/screens/NewChatScreen';
import {useThemeStore} from '../store/themeStore';
import {colors} from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const GlassmorphicTabBar = ({state, descriptors, navigation}) => {
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;

  const icons = {
    Home: '🏠',
    Chat: '💬',
    Profile: '👤',
  };

  return (
    <View style={styles.tabContainer}>
      <View style={[styles.tabBar, {backgroundColor: theme.glass, borderColor: theme.glassBorder}]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const icon = icons[route.name] || '●';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <Text style={[styles.tabIcon, {color: isFocused ? colors.neon.lime : theme.textMuted}]}>
                  {icon}
                </Text>
                {isFocused && <View style={styles.glowDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassmorphicTabBar {...props} />}
      screenOptions={{headerShown: false}}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="QR" component={QRScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="NewChat" component={NewChatScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    shadowColor: colors.neon.lime,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
    position: 'relative',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
  },
  tabIcon: {fontSize: 22},
  glowDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neon.lime,
    alignSelf: 'center',
  },
});
