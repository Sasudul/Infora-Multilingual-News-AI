import {
  View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useI18n, LangCode } from '../../i18n';
import { useAuth } from '../../lib/auth';
import { Platform } from 'react-native';
import { userApi } from '../../lib/api';
import { COLORS } from '../../styles/colors';

const LANGUAGES: { code: LangCode; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'si', native: 'සිංහල' },
  { code: 'ta', native: 'தமிழ்' },
];

export default function ProfileScreen() {
  const { t, lang, setLang } = useI18n();
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      Alert.alert('Success', isSignUp ? 'Account created!' : 'Logged in!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLanguageChange = async (code: LangCode) => {
    setLang(code);
    if (user) {
      try {
        await userApi.updateLanguage(user.uid, code);
      } catch (e) {
        // Silently fail
      }
    }
  };

  const handleSignOut = async () => {
    Alert.alert(t('logout'), 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  // Not logged in — show login/signup form
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView contentContainerStyle={{ padding: 20, justifyContent: 'center', flexGrow: 1 }}>
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{
              width: 70, height: 70, borderRadius: 20,
              backgroundColor: COLORS.primary + '20',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Ionicons name="sparkles" size={32} color={COLORS.primary} />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFF' }}>
              Infora <Text style={{ color: COLORS.primary }}>AI</Text>
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 13 }}>
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </Text>
          </View>

          {/* Form */}
          <TextInput
            placeholder={t('email')}
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: '#131A2A', padding: 14,
              borderRadius: 12, color: '#FFF', marginBottom: 12,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
              fontSize: 14,
            }}
          />

          <TextInput
            placeholder={t('password')}
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              backgroundColor: '#131A2A', padding: 14,
              borderRadius: 12, color: '#FFF', marginBottom: 20,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
              fontSize: 14,
            }}
          />

          <TouchableOpacity
            onPress={handleAuth}
            disabled={authLoading}
            style={{
              backgroundColor: COLORS.primary, padding: 14,
              borderRadius: 12, alignItems: 'center',
            }}
          >
            {authLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={{ fontWeight: '700', color: '#000', fontSize: 15 }}>
                {isSignUp ? 'Sign Up' : t('login')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <Text style={{ color: 'rgba(255,255,255,0.3)', marginHorizontal: 12, fontSize: 12 }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            onPress={async () => {
              setAuthLoading(true);
              try {
                await signInWithGoogle();
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Google Sign-In failed');
              } finally {
                setAuthLoading(false);
              }
            }}
            style={{
              backgroundColor: '#FFF', padding: 14,
              borderRadius: 12, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>G</Text>
            <Text style={{ fontWeight: '600', color: '#333', fontSize: 15 }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 13 }}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Logged in — show profile
  const MENU_ITEMS = [
    { icon: 'person-circle', label: t('editProfile'), color: '#7DBDEC' },
    { icon: 'globe', label: t('language'), color: '#A78BFA' },
    { icon: 'notifications', label: t('notifications'), color: '#F59E0B' },
    { icon: 'shield-checkmark', label: t('privacy'), color: '#10B981' },
    { icon: 'help-circle', label: t('help'), color: '#22D3EE' },
    { icon: 'information-circle', label: t('about'), color: '#EC4899' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>

        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 20 }}>
          {t('profile')}
        </Text>

        {/* Avatar Card */}
        <View style={{
          alignItems: 'center', marginBottom: 20,
          backgroundColor: '#131A2A', padding: 24, borderRadius: 18,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
        }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            borderWidth: 2.5, borderColor: COLORS.primary,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 12, overflow: 'hidden',
          }}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary + '30', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, fontWeight: '700', color: COLORS.primary }}>
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
            {user.email}
          </Text>

          {/* Language Switch */}
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                onPress={() => handleLanguageChange(l.code)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: lang === l.code ? COLORS.primary : '#222',
                }}
              >
                <Text style={{
                  color: lang === l.code ? '#000' : '#FFF',
                  fontWeight: '600', fontSize: 12,
                }}>
                  {l.native}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={{
          backgroundColor: '#131A2A', borderRadius: 14, overflow: 'hidden',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
        }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: 'row', padding: 16, alignItems: 'center',
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <View style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: `${item.color}15`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={{ color: '#FFF', marginLeft: 12, flex: 1, fontSize: 14 }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.15)" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            marginTop: 20, paddingVertical: 14, borderRadius: 12,
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
          }}
        >
          <Text style={{ color: '#EF4444', textAlign: 'center', fontWeight: '600', fontSize: 14 }}>
            {t('logout')}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
