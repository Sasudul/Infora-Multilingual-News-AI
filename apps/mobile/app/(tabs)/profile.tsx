import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { setLanguage, t } from '../../i18n';

// 🔐 Firebase functions
const login = async () => {
  await signInWithEmailAndPassword(auth, "test@mail.com", "123456");
};

const saveUser = async () => {
  await addDoc(collection(db, "users"), {
    name: "Branjana",
    email: "test@mail.com",
  });
};

// 🌍 Languages
const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'si', native: 'සිංහල' },
  { code: 'ta', native: 'தமிழ்' },
];

// 📋 Menu
const MENU_ITEMS = [
  { icon: 'person-circle', label: 'Edit Profile', color: '#7DBDEC' },
  { icon: 'globe', label: 'Language', color: '#A78BFA' },
  { icon: 'notifications', label: 'Notifications', color: '#F59E0B' },
  { icon: 'shield-checkmark', label: 'Privacy & Security', color: '#10B981' },
  { icon: 'help-circle', label: 'Help & Support', color: '#22D3EE' },
  { icon: 'information-circle', label: 'About Infora', color: '#EC4899' },
];

export default function ProfileScreen() {
  const [selectedLang, setSelectedLang] = useState<'en' | 'si' | 'ta'>('en');
  const [, setRefresh] = useState(0); // 🔥 for UI refresh

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 20 }}>
          {t('profile')}
        </Text>

        {/* Avatar Card */}
        <View style={{
          alignItems: 'center',
          marginBottom: 20,
          backgroundColor: '#131A2A',
          padding: 20,
          borderRadius: 16,
        }}>
          <Image
            source={require('../../assets/images/reporter.png')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
              borderWidth: 2,
              borderColor: '#7DBDEC',
            }}
          />

          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
            Infora User
          </Text>

          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            user@infora.lk
          </Text>

          {/* Language Switch */}
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            {LANGUAGES.map((l, i) => (
              <TouchableOpacity
                key={l.code}
                onPress={() => {
                  setSelectedLang(l.code as any);
                  setLanguage(l.code as any);
                  setRefresh(prev => prev + 1); // 🔥 force UI update
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  marginRight: i !== LANGUAGES.length - 1 ? 8 : 0,
                  backgroundColor:
                    selectedLang === l.code ? '#7DBDEC' : '#222',
                  borderRadius: 10,
                }}
              >
                <Text style={{
                  color: selectedLang === l.code ? '#000' : '#FFF',
                  fontWeight: '600',
                  fontSize: 12,
                }}>
                  {l.native}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={{
          backgroundColor: '#131A2A',
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: 'row',
                padding: 15,
                alignItems: 'center',
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: '#222',
              }}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text style={{ color: '#FFF', marginLeft: 10 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={login}
          style={{
            marginTop: 20,
            backgroundColor: '#7DBDEC',
            padding: 12,
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#000', fontWeight: '600' }}>
            Login (Test)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={saveUser}
          style={{
            marginTop: 10,
            backgroundColor: '#22C55E',
            padding: 12,
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#000', fontWeight: '600' }}>
            Save User
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>
            Sign Out
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
