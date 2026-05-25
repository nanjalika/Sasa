import {useState} from 'react';
import {supabase} from '../../services/supabase/client';
import {useAuthStore} from '../../core/store/authStore';
import Toast from 'react-native-toast-message';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const {setSession, setUser, logout} = useAuthStore();

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const {data, error} = await supabase.auth.signInWithPassword({email, password});
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      Toast.show({type: 'success', text1: 'Welcome back!'});
      return data;
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, username) => {
    setLoading(true);
    try {
      const {data, error} = await supabase.auth.signUp({
        email, password,
        options: {data: {username}},
      });
      if (error) throw error;
      if (data.user) {
        const sasaId = 'SA' + Math.random().toString(36).substr(2, 8).toUpperCase();
        await supabase.from('profiles').insert({
          id: data.user.id, username, sasa_id: sasaId,
          email, created_at: new Date().toISOString(),
        });
      }
      Toast.show({type: 'success', text1: 'Account created! Please verify your email.'});
      return data;
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone, password) => {
    setLoading(true);
    try {
      const {data, error} = await supabase.auth.signInWithPassword({phone, password});
      if (error) throw error;
      setSession(data.session);
      setUser(data.user);
      return data;
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      Toast.show({type: 'success', text1: 'Password reset link sent!'});
    } catch (error) {
      Toast.show({type: 'error', text1: error.message});
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
    Toast.show({type: 'success', text1: 'Logged out successfully'});
  };

  return {
    loading, signInWithEmail, signUpWithEmail, signInWithPhone,
    resetPassword, signOut,
  };
};
