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
import * as Clipboard from 'expo-clipboard';

// Динамический импорт для native
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin =
      require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
      offlineAccess: true,
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
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // No need to call login() - onAuthStateChanged will handle it
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

      // Native: use @react-native-google-signin
      if (GoogleSignin) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken;

        // Extract and save name
        const displayName =
          userInfo.user?.name || userInfo.user?.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        await saveUserProfile(firstName || '', lastName || '');

        console.log('Имя:', firstName);
        console.log('Фамилия:', lastName);
        console.log('Email:', userInfo.user?.email);

        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          // No need to call login() - onAuthStateChanged will handle it
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Google Sign-In not configured');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code !== '12501') {
        // User cancelled
        Alert.alert(
          'Sign-in error',
          error.message || 'Failed to sign in with Google'
        );
      }
    } finally {
      setIsInProgress(false);
    }
  };
  const handleGithubAuth = async () => {
    try {
      setIsInProgress(true);

      if (Platform.OS === 'web') {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
        router.replace('/(tabs)');
        return;
      }

      // Native: GitHub OAuth Device Flow (no backend required)
      const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
      if (!clientId) {
        Alert.alert('Config error', 'Missing EXPO_PUBLIC_GITHUB_CLIENT_ID');
        return;
      }

      // 1) Start device flow (GitHub expects form-encoded)
      const codeBody = new URLSearchParams({
        client_id: clientId,
        scope: 'read:user user:email',
      });
      const codeRes = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: codeBody.toString(),
      });
      if (!codeRes.ok) {
        const errText = await codeRes.text();
        console.log('GitHub device code error:', codeRes.status, errText);
        throw new Error('Failed to start GitHub device flow');
      }
      const codeJson = await codeRes.json();
      const {
        device_code,
        user_code,
        verification_uri,
        verification_uri_complete,
        interval,
      } = codeJson;

      // 2) Show code and let user open GitHub when ready
      const urlToOpen = verification_uri_complete || verification_uri;

      await new Promise<void>((resolve) => {
        Alert.alert(
          'GitHub Login',
          `Your code:\n\n${user_code}\n\nTap OK to open GitHub and enter this code`,
          [
            {
              text: 'OK',
              onPress: async () => {
                await WebBrowser.openBrowserAsync(urlToOpen);
                resolve();
              },
            },
            { text: 'Cancel', style: 'cancel', onPress: () => resolve() },
          ],
          { cancelable: false }
        );
      });

      // 3) Poll for access token
      const pollIntervalMs = Math.max(5, interval || 5) * 1000;
      let accessToken: string | null = null;
      const maxAttempts = 24; // ~2 minutes
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((r) => setTimeout(r, pollIntervalMs));
        const tokenBody = new URLSearchParams({
          client_id: clientId,
          device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        });
        const tokenRes = await fetch(
          'https://github.com/login/oauth/access_token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            body: tokenBody.toString(),
          }
        );
        if (!tokenRes.ok) {
          const errText = await tokenRes.text();
          console.log('GitHub access token error:', tokenRes.status, errText);
          continue;
        }
        const tokenJson = await tokenRes.json();
        if (tokenJson.error) {
          if (tokenJson.error === 'authorization_pending') continue;
          if (tokenJson.error === 'slow_down') {
            // wait one more interval
            continue;
          }
          throw new Error(
            tokenJson.error_description || 'GitHub device flow error'
          );
        }
        accessToken = tokenJson.access_token;
        break;
      }

      if (!accessToken) {
        throw new Error('Timed out waiting for GitHub authorization');
      }

      // Fetch user info from GitHub to get name
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

      // 4) Sign in to Firebase with GitHub access token
      const credential = GithubAuthProvider.credential(accessToken);
      await signInWithCredential(auth, credential);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('GitHub sign-in error:', error);
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
