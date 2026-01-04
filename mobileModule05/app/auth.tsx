import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/components/AuthContext';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';

let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin =
      require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
      offlineAccess: false, // Не сохранять токены
      forceCodeForRefreshToken: false,
    });
  } catch (e) {
    console.log('Google Sign-In not available');
  }
}

const AuthScreen = () => {
  const { login, saveUserProfile } = useAuth();
  const [isInProgress, setIsInProgress] = React.useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsInProgress(true);

      // Web: use Firebase popup
      if (Platform.OS === 'web') {
        // Clear Firebase session storage on web before login
        try {
          sessionStorage.clear();
          localStorage.removeItem(
            'firebase:authUser:AIzaSyB5bIKiZ9_P3AxvuXG0Lq_KTSL2QTUZ6hs:[DEFAULT]'
          );
        } catch (e) {
          console.log('Web storage clear error:', e);
        }

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Extract and save name
        const displayName = user.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        await saveUserProfile(firstName || '', lastName || '');

        router.replace('/(tabs)');
        return;
      }

      // Mobile: use Google Sign-In SDK
      if (GoogleSignin) {
        // Выход перед входом для очистки сохраненного аккаунта
        await GoogleSignin.signOut();

        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        const userInfo = await GoogleSignin.signIn();

        // Extract and save name
        const displayName =
          userInfo.user?.name || userInfo.user?.givenName || '';
        const firstName = userInfo.user?.givenName || '';
        const lastName = userInfo.user?.familyName || '';
        await saveUserProfile(firstName, lastName);

        console.log('Имя:', firstName);
        console.log('Фамилия:', lastName);
        console.log('Email:', userInfo.user?.email);

        // Get ID token and sign in to Firebase
        const idToken = userInfo.data?.idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          router.replace('/(tabs)');
        } else {
          throw new Error('No ID token received');
        }
      } else {
        Alert.alert('Error', 'Google Sign-In not available on this platform');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === '12501' || error.code === 'ERROR_CANCELED') {
        // User cancelled - don't show error
        return;
      }
      Alert.alert(
        'Sign-in error',
        error.message ||
          'Failed to sign in with Google. Please check your internet connection.'
      );
    } finally {
      setIsInProgress(false);
    }
  };
  const handleGithubAuth = async () => {
    try {
      setIsInProgress(true);

      if (Platform.OS === 'web') {
        // Clear Firebase session storage on web before login
        try {
          sessionStorage.clear();
          localStorage.removeItem(
            'firebase:authUser:AIzaSyB5bIKiZ9_P3AxvuXG0Lq_KTSL2QTUZ6hs:[DEFAULT]'
          );
        } catch (e) {
          console.log('Web storage clear error:', e);
        }

        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
        router.replace('/(tabs)');
        return;
      }

      // Native: GitHub OAuth through browser
      const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
      if (!clientId) {
        Alert.alert('Config error', 'Missing EXPO_PUBLIC_GITHUB_CLIENT_ID');
        return;
      }

      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'diaryapp',
      });

      const authUrl =
        `https://github.com/login/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
        `scope=read:user%20user:email&` +
        `response_type=code&` +
        `prompt=login`; // Force login each time

      // Open browser
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type !== 'success') {
        throw new Error('Authorization cancelled');
      }

      // Parse code from URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for access token
      const tokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: redirectUrl,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      const accessToken = tokenData.access_token;

      // Fetch user info from GitHub
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          const displayName = userData.name || '';
          const [firstName, ...lastNameParts] = displayName.split(' ');
          const lastName = lastNameParts.join(' ');
          await saveUserProfile(firstName || '', lastName || '');
        }
      } catch (err) {
        console.log('Failed to fetch GitHub user info:', err);
      }

      // Sign in to Firebase with GitHub access token
      const credential = GithubAuthProvider.credential(accessToken);
      await signInWithCredential(auth, credential);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('GitHub sign-in error:', error);
      if (error.message === 'Authorization cancelled') {
        return; // User cancelled - don't show error
      }
      Alert.alert(
        'Sign-in error',
        error.message || 'Failed to sign in with GitHub'
      );
    } finally {
      setIsInProgress(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header and navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Authorization</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.description}>Sign in to continue</Text>

          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.authButton, styles.googleButton]}
              onPress={handleGoogleAuth}
              disabled={isInProgress}
            >
              <Text style={[styles.authButtonText, styles.googleText]}>
                🔵 Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.githubButton]}
              onPress={handleGithubAuth}
              disabled={isInProgress}
            >
              <Text style={styles.authButtonText}>⚫ Continue with GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
    marginRight: 40, // Compensate for back button
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    marginBottom: 60,
  },
  authButtons: {
    width: '100%',
    gap: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 6,
    paddingHorizontal: 20,
    position: 'relative',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  githubButton: {
    backgroundColor: '#24292e',
  },
  googleIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#4285f4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  githubIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authButtonText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  googleText: {
    color: '#000',
  },
  loginLink: {
    marginTop: 40,
  },
  loginLinkText: {
    fontSize: 14,
    textAlign: 'center',
  },
  haveAccount: {
    color: 'rgba(11, 10, 17, 0.4)',
  },
  login: {
    color: '#0063f5',
  },
});

export default AuthScreen;
