import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
     Alert.alert("Success", "Login successful ✅");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#0A0D14' }}>
      
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#FFF', marginBottom: 20 }}>
        Login
      </Text>

      {/* Email */}
      <TextInput
        placeholder="Enter email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: '#131A2A',
          padding: 14,
          borderRadius: 10,
          color: '#FFF',
          marginBottom: 12,
        }}
      />

      {/* Password */}
      <TextInput
        placeholder="Enter password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: '#131A2A',
          padding: 14,
          borderRadius: 10,
          color: '#FFF',
          marginBottom: 20,
        }}
      />

      {/* Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#7DBDEC',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: '600', color: '#000' }}>Login</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}