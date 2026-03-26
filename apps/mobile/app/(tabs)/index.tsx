import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 🔥 Import styles
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: 'newspaper', title: 'Verified News', desc: 'Sri Lankan sources', color: '#22D3EE' },
  { icon: 'briefcase', title: 'Gov Services', desc: 'Step-by-step guides', color: '#F59E0B' },
  { icon: 'chatbubbles', title: 'AI Chat', desc: 'In your language', color: '#7DBDEC' },
  { icon: 'globe', title: 'Multilingual', desc: 'SI / TA / EN', color: '#A78BFA' },
];

const TRENDING = [
  { title: 'Central Bank Maintains Policy Interest Rates', source: 'Daily News', time: '2h ago' },
  { title: 'IT/BPO Exports Reach $1.7B Milestone', source: 'Ada Derana', time: '4h ago' },
  { title: 'Cricket Squad for Upcoming Test Series', source: 'NewsFirst', time: '5h ago' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>
            Infora <Text style={{ color: COLORS.primary }}>AI</Text>
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
            Your Sri Lankan AI Assistant
          </Text>
        </View>

        {/* Hero Card */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chat')}
          activeOpacity={0.9}
          style={{
            marginHorizontal: SPACING.lg,
            marginVertical: SPACING.md,
            borderRadius: 20,
            backgroundColor: COLORS.card,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.lg,
          }}
        >
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: 'rgba(125,189,236,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Ionicons name="sparkles" size={24} color={COLORS.primary} />
          </View>

          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>
            Ask Infora Anything
          </Text>

          <Text style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            marginTop: 6,
            lineHeight: 20,
          }}>
            News, government services, or any question — in Sinhala, Tamil, or English
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            backgroundColor: 'rgba(125,189,236,0.1)',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
          }}>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.primary, fontWeight: '600' }}>
              Start Chatting
            </Text>
          </View>
        </TouchableOpacity>

        {/* Features */}
        <View style={{ paddingHorizontal: SPACING.lg }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>
            What Infora Can Do
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {FEATURES.map((f) => (
              <View
                key={f.title}
                style={{
                  width: (width - 50) / 2,
                  padding: SPACING.md,
                  borderRadius: 16,
                  backgroundColor: COLORS.card,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Ionicons name={f.icon as any} size={22} color={f.color} />
                <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 8 }}>
                  {f.title}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                  {f.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.lg }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <Text style={{ color: COLORS.text, fontWeight: '700' }}>
              Trending Now
            </Text>

            <TouchableOpacity onPress={() => router.push('/(tabs)/news')}>
              <Text style={{ color: COLORS.primary }}>See All</Text>
            </TouchableOpacity>
          </View>

          {TRENDING.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                backgroundColor: COLORS.card,
                padding: SPACING.md,
                borderRadius: 14,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: COLORS.text, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 11 }}>
                {item.source} • {item.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


