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
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react-native';
import { useAuth } from '@/components/AuthContext';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';

// Динамический импорт для native
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin =
      require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
  } catch (e) {
    console.log('Google Sign-In not available');
  }
}

const AuthScreen = () => {
  const { login } = useAuth();
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

        // Извлекаем имя и фамилию
        const displayName = user.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        console.log('Имя:', firstName);
        console.log('Фамилия:', lastName);
        console.log('Email:', user.email);
        router.replace('/(tabs)');
        return;
      }

      // Native: use @react-native-google-signin
      if (GoogleSignin) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken;

        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          // No need to call login() - onAuthStateChanged will handle it
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert(
          'Info',
          'Установите @react-native-google-signin/google-signin для native build'
        );
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

      // Native: GitHub auth пока не реализован
      Alert.alert(
        'Info',
        'GitHub authentication для native будет доступен в следующей версии'
      );
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
              <View style={styles.googleIcon}>
                <IconBrandGoogle size={20} color="#4285f4" />
              </View>
              <Text style={[styles.authButtonText, styles.googleText]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.githubButton]}
              onPress={handleGithubAuth}
              disabled={isInProgress}
            >
              <View style={styles.githubIcon}>
                <IconBrandGithub size={20} color="#fff" />
              </View>
              <Text style={styles.authButtonText}>Continue with GitHub</Text>
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
