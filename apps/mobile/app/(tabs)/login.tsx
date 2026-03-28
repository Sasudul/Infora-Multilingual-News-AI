import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/auth';
import { COLORS } from '../../styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      Alert.alert('Success', isSignUp ? 'Account created!' : 'Logged in!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background }}>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Ionicons name="sparkles" size={40} color={COLORS.primary} />
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#FFF', marginTop: 10 }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: '#131A2A', padding: 14,
          borderRadius: 12, color: '#FFF', marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: '#131A2A', padding: 14,
          borderRadius: 12, color: '#FFF', marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleAuth}
        disabled={loading}
        style={{
          backgroundColor: COLORS.primary, padding: 14,
          borderRadius: 12, alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={{ fontWeight: '700', color: '#000' }}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={{ color: COLORS.primary, fontSize: 13 }}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}