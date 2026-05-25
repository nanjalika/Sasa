import React, {useEffect, useState, useCallback} from 'react';
import {StatusBar, View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

import {AppNavigator} from './src/core/navigation/AppNavigator';
import {AuthNavigator} from './src/core/navigation/AuthNavigator';
import {useAuthStore} from './src/core/store/authStore';
import {useThemeStore} from './src/core/store/themeStore';
import {useLanguageStore} from './src/core/store/languageStore';
import {supabase} from './src/services/supabase/client';
import {colors} from './src/core/theme/colors';
import './src/localization/i18n';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const {session, setSession, setUser, initialized, setInitialized} = useAuthStore();
  const {isDark} = useThemeStore();
  const {initLanguage} = useLanguageStore();
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initLanguage();

        const {data: {session}} = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          setUser(session.user);
        }
        setInitialized(true);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
        setAppReady(true);
      }
    }
    prepare();

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady || loading) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: isDark ? colors.dark.background : colors.light.background}]}>
        <ActivityIndicator size="large" color={colors.neon.lime} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={isDark ? colors.dark.background : colors.light.background}
          />
          {session ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
