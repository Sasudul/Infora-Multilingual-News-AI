import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: 'newspaper' as const, title: 'Verified News', desc: 'Sri Lankan sources', color: '#22D3EE' },
  { icon: 'briefcase' as const, title: 'Gov Services', desc: 'Step-by-step guides', color: '#F59E0B' },
  { icon: 'chatbubbles' as const, title: 'AI Chat', desc: 'In your language', color: '#7DBDEC' },
  { icon: 'globe' as const, title: 'Multilingual', desc: 'SI / TA / EN', color: '#A78BFA' },
];

const TRENDING = [
  { title: 'Central Bank Maintains Policy Interest Rates', source: 'Daily News', time: '2h ago' },
  { title: 'IT/BPO Exports Reach $1.7B Milestone', source: 'Ada Derana', time: '4h ago' },
  { title: 'Cricket Squad for Upcoming Test Series', source: 'NewsFirst', time: '5h ago' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#FFF' }}>
            InFora <Text style={{ color: '#7DBDEC' }}>AI</Text>
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Your Sri Lankan AI Assistant
          </Text>
        </View>

        {/* Hero Card */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chat')}
          activeOpacity={0.9}
          style={{
            marginHorizontal: 20,
            marginVertical: 16,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#131A2A',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <View style={{
            padding: 24,
            background: 'linear-gradient(135deg, #7DBDEC20, #131A2A)',
          }}>
            <View style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: 'rgba(125,189,236,0.15)',
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Ionicons name="sparkles" size={24} color="#7DBDEC" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 6 }}>
              Ask Infora Anything
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 20 }}>
              News, government services, or any question — in Sinhala, Tamil, or English
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', marginTop: 16,
              backgroundColor: 'rgba(125,189,236,0.1)', paddingHorizontal: 16, paddingVertical: 10,
              borderRadius: 12, borderWidth: 1, borderColor: 'rgba(125,189,236,0.2)',
            }}>
              <Ionicons name="arrow-forward" size={16} color="#7DBDEC" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#7DBDEC', marginLeft: 8 }}>
                Start Chatting
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Features Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 14 }}>
            What Infora Can Do
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {FEATURES.map((f) => (
              <View
                key={f.title}
                style={{
                  width: (width - 50) / 2, padding: 16, borderRadius: 16,
                  backgroundColor: '#131A2A', borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <Ionicons name={f.icon} size={22} color={f.color} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFF', marginTop: 10 }}>
                  {f.title}
                </Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                  {f.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trending News */}
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>Trending Now</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/news')}>
              <Text style={{ fontSize: 12, color: '#7DBDEC', fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
          </View>
          {TRENDING.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14,
                backgroundColor: '#131A2A', borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
                marginBottom: 8, gap: 12,
              }}
            >
              <View style={{
                width: 8, height: 8, borderRadius: 4, backgroundColor: '#22D3EE',
              }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFF' }} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  {item.source} • {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
