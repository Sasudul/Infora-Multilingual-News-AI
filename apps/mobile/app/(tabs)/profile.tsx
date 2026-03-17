import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

const MENU_ITEMS = [
  { icon: 'person-circle' as const, label: 'Edit Profile', color: '#7DBDEC' },
  { icon: 'globe' as const, label: 'Language', color: '#A78BFA' },
  { icon: 'notifications' as const, label: 'Notifications', color: '#F59E0B' },
  { icon: 'shield-checkmark' as const, label: 'Privacy & Security', color: '#10B981' },
  { icon: 'help-circle' as const, label: 'Help & Support', color: '#22D3EE' },
  { icon: 'information-circle' as const, label: 'About Infora', color: '#EC4899' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 24 }}>
          Profile
        </Text>

        {/* Avatar Card */}
        <View style={{
          backgroundColor: '#131A2A', borderRadius: 20, padding: 24, marginBottom: 20,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center',
        }}>
          <View style={{
            width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(125,189,236,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Ionicons name="person" size={36} color="#7DBDEC" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 2 }}>
            Infora User
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>user@infora.lk</Text>

          {/* Language Selector */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: l.code === 'en' ? 'rgba(125,189,236,0.15)' : 'rgba(255,255,255,0.04)',
                  borderWidth: 1,
                  borderColor: l.code === 'en' ? 'rgba(125,189,236,0.3)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <Text style={{
                  fontSize: 12, fontWeight: '600',
                  color: l.code === 'en' ? '#7DBDEC' : 'rgba(255,255,255,0.4)',
                }}>
                  {l.native}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Conversations', value: '12' },
            { label: 'Articles Read', value: '47' },
            { label: 'Services Used', value: '3' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: '#131A2A', borderRadius: 14, padding: 14,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', alignItems: 'center',
            }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#7DBDEC' }}>{stat.value}</Text>
              <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: 'center' }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={{
          backgroundColor: '#131A2A', borderRadius: 18, overflow: 'hidden',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
        }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.6}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 16,
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <View style={{
                width: 34, height: 34, borderRadius: 10, backgroundColor: `${item.color}15`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.12)" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={{
            marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: 'rgba(239,68,68,0.08)',
            borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)', alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.15)', marginTop: 20 }}>
          Infora AI v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
