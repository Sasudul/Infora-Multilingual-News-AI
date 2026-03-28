import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../lib/auth';
import { newsApi } from '../../lib/api';
import { getValidImage } from '../../lib/helpers';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [trending, setTrending] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const FEATURES = [
    { icon: 'newspaper', title: t('verifiedNews'), desc: 'Sri Lankan sources', color: '#22D3EE' },
    { icon: 'briefcase', title: t('govServices'), desc: 'Step-by-step guides', color: '#F59E0B' },
    { icon: 'chatbubbles', title: t('aiChat'), desc: 'In your language', color: '#7DBDEC' },
    { icon: 'globe', title: t('multilingual'), desc: 'SI / TA / EN', color: '#A78BFA' },
  ];

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const data = await newsApi.getLatest(5);
      setTrending(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (e) {
      console.log('Failed to load trending:', e);
    } finally {
      setLoadingNews(false);
    }
  };

  const getTitle = (item: any) => {
    if (lang === 'si') return item.titleSi || item.titleEn || item.title || 'No title';
    if (lang === 'ta') return item.titleTa || item.titleEn || item.title || 'No title';
    return item.titleEn || item.title || 'No title';
  };

  const getFallback = (item: any) => {
    if (!item) return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop';
    const cat = (item?.category || '').toLowerCase();
    if (cat.includes('economy')) return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop';
    if (cat.includes('technology')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop';
    if (cat.includes('sports')) return 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop';
    if (cat.includes('politics')) return 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop';
    return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>
              Infora <Text style={{ color: COLORS.primary }}>AI</Text>
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
              {t('welcome')}
            </Text>
          </View>
          {user && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <View style={{
                width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '20',
                alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '40',
              }}>
                {user.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                ) : (
                  <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 16 }}>
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Card */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chat')}
          activeOpacity={0.85}
          style={{
            marginHorizontal: SPACING.lg, marginVertical: SPACING.md,
            borderRadius: 20, backgroundColor: COLORS.card,
            borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg,
          }}
        >
          <View style={{
            width: 48, height: 48, borderRadius: 14,
            backgroundColor: 'rgba(125,189,236,0.15)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Ionicons name="sparkles" size={24} color={COLORS.primary} />
          </View>

          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>
            {t('askAnything')}
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 20 }}>
            {t('askDesc')}
          </Text>

          <View style={{
            flexDirection: 'row', alignItems: 'center', marginTop: 16,
            backgroundColor: 'rgba(125,189,236,0.1)', paddingHorizontal: 16,
            paddingVertical: 10, borderRadius: 12,
          }}>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.primary, fontWeight: '600' }}>
              {t('startChatting')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Features Grid */}
        <View style={{ paddingHorizontal: SPACING.lg }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>
            {t('features')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {FEATURES.map((f) => (
              <View
                key={f.title}
                style={{
                  width: (width - 50) / 2, padding: SPACING.md, borderRadius: 16,
                  backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
                }}
              >
                <Ionicons name={f.icon as any} size={22} color={f.color} />
                <Text style={{ color: COLORS.text, fontWeight: '600', marginTop: 8, fontSize: 13 }}>
                  {f.title}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trending News (Live from API) */}
        <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: COLORS.text, fontWeight: '700' }}>{t('trending')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/news')}>
              <Text style={{ color: COLORS.primary, fontSize: 13 }}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {loadingNews ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : trending.length === 0 ? (
            <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginTop: 20 }}>
              {t('noNews')}
            </Text>
          ) : (
            trending.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  backgroundColor: COLORS.card, padding: SPACING.md,
                  borderRadius: 14, marginBottom: 8, flexDirection: 'row', gap: 12,
                }}
                onPress={() => router.push('/(tabs)/news')}
              >
                <Image
                  source={{ uri: getValidImage(item.imageUrl, getFallback(item)) }}
                  style={{ width: 60, height: 60, borderRadius: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: COLORS.text, fontWeight: '600', fontSize: 13 }} numberOfLines={2}>
                    {getTitle(item)}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ color: COLORS.primary, fontSize: 10 }}>{item.source || ''}</Text>
                    <Text style={{ color: COLORS.textSecondary, fontSize: 10 }}>{item.district || ''}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
