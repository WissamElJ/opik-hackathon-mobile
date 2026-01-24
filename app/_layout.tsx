import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { agenticApi } from '@/services/agenticApi';

export default function RootLayout() {
  useEffect(() => {
    console.log('🔐 Setting up auth state listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth event:', event);
        console.log('👤 Session user:', session?.user?.email || 'No user');

        if (event === 'INITIAL_SESSION') {
          console.log('🚀 Initial session loaded:', session?.user?.email || 'No session');
          if (session?.user) {
            console.log('📋 User metadata:', session.user.user_metadata);
          }
        }

        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in:', session?.user?.email);
          console.log('📋 User metadata:', session?.user?.user_metadata);
          console.log('🆕 Is new user:', session?.user?.created_at === session?.user?.last_sign_in_at);

          // Sync user metadata to Agentic API
          if (session?.user?.user_metadata) {
             agenticApi.syncUser(session.user.user_metadata).then((success) => {
               if (!success) {
                 Toast.show({
                   type: 'error',
                   text1: 'Error',
                   text2: 'Something went wrong.',
                   position: 'bottom',
                 });
               }
             });
          }
        }

        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
        }

        if (event === 'USER_UPDATED') {
          console.log('🔄 User profile updated:', session?.user?.email);
          console.log('📋 Updated metadata:', session?.user?.user_metadata);
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed for:', session?.user?.email);
        }

        if (event === 'PASSWORD_RECOVERY') {
          console.log('🔑 Password recovery initiated for:', session?.user?.email);
        }

        if (event === 'MFA_CHALLENGE_VERIFIED') {
          console.log('🔐 MFA challenge verified for:', session?.user?.email);
        }
      }
    );

    return () => {
      console.log('🔐 Cleaning up auth state listener...');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade',
        }}
      />
      <Toast />
    </>
  );
}
