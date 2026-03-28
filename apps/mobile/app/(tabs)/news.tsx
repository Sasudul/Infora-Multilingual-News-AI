import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  RefreshControl, Image, Modal, Dimensions, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n';
import { newsApi } from '../../lib/api';
import { getValidImage } from '../../lib/helpers';
import { COLORS } from '../../styles/colors';

const { width: SCREEN_W } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'politics', label: 'Politics' },
  { id: 'economy', label: 'Economy' },
  { id: 'technology', label: 'Tech' },
  { id: 'sports', label: 'Sports' },
  { id: 'local', label: 'Local' },
  { id: 'crime', label: 'Crime' },
  { id: 'health', label: 'Health' },
];

export default function NewsScreen() {
  const { t, lang } = useI18n();
  const [news, setNews] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const loadNews = async () => {
    try {
      let data: any[];
      if (category === 'all') {
        data = await newsApi.getLatest(30);
      } else {
        data = await newsApi.getByCategory(category, 30);
      }
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Failed to load news:', err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadNews();
  }, [category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews().then(() => setRefreshing(false));
  }, [category]);

  const getTitle = (item: any) => {
    if (lang === 'si') return item.titleSi || item.titleEn || item.title || '';
    if (lang === 'ta') return item.titleTa || item.titleEn || item.title || '';
    return item.titleEn || item.title || '';
  };

  const getSummary = (item: any) => {
    if (lang === 'si') return item.summarySi || item.summaryEn || item.summary || '';
    if (lang === 'ta') return item.summaryTa || item.summaryEn || item.summary || '';
    return item.summaryEn || item.summary || '';
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

  const filtered = news.filter((item) => {
    if (!search) return true;
    const title = getTitle(item).toLowerCase();
    return title.includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF' }}>
          {t('newsFeed').split(' ')[0]}{' '}
          <Text style={{ color: COLORS.primary }}>{t('newsFeed').split(' ').slice(1).join(' ') || 'Feed'}</Text>
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
          {t('news')}
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#131A2A', borderRadius: 12, paddingHorizontal: 12,
        }}>
          <Ionicons name="search" size={16} color="#777" />
          <TextInput
            placeholder={t('search')}
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: '#FFF', padding: 12, fontSize: 14 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12, maxHeight: 42 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setCategory(cat.id)}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 8,
              backgroundColor: category === cat.id ? COLORS.primary : '#1A1F2E',
            }}
          >
            <Text style={{ color: category === cat.id ? '#000' : '#AAA', fontSize: 12, fontWeight: '600' }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView
        style={{ marginTop: 10, flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#777', textAlign: 'center', marginTop: 40 }}>{t('noNews')}</Text>
        ) : (
          filtered.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              onPress={() => setSelectedNews(item)}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#131A2A', borderRadius: 14, marginBottom: 12,
                overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <Image
                source={{ uri: getValidImage(item.imageUrl, getFallback(item)) }}
                style={{ width: '100%', height: 160 }}
                resizeMode="cover"
              />
              <View style={{ padding: 14 }}>
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14, lineHeight: 20 }} numberOfLines={2}>
                  {getTitle(item)}
                </Text>
                <Text style={{ color: '#888', fontSize: 12, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>
                  {getSummary(item)}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {item.verified && <Ionicons name="checkmark-circle" size={12} color="#22C55E" />}
                    <Text style={{ color: COLORS.primary, fontSize: 11 }}>{item.source || ''}</Text>
                  </View>
                  <Text style={{ color: '#555', fontSize: 10 }}>{item.district || ''}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* News Detail Modal */}
      <Modal visible={!!selectedNews} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setSelectedNews(null)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}
              >
                <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.5)" />
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{t('back')}</Text>
              </TouchableOpacity>

              <Image
                source={{ uri: getValidImage(selectedNews?.imageUrl, getFallback(selectedNews)) }}
                style={{ width: '100%', height: 220, borderRadius: 16, marginBottom: 16 }}
                resizeMode="cover"
              />

              <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700', lineHeight: 28 }}>
                {selectedNews && getTitle(selectedNews)}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
                {selectedNews?.verified && <Ionicons name="checkmark-circle" size={14} color="#22C55E" />}
                <Text style={{ color: COLORS.primary, fontSize: 12 }}>{selectedNews?.source}</Text>
                {selectedNews?.district && (
                  <Text style={{ color: '#555', fontSize: 11 }}>• {selectedNews.district}</Text>
                )}
              </View>

              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 20, lineHeight: 24 }}>
                {selectedNews && getSummary(selectedNews)}
              </Text>

              {selectedNews?.sourceUrl && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(selectedNews.sourceUrl)}
                  style={{
                    marginTop: 20, backgroundColor: COLORS.primary + '15',
                    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Ionicons name="open-outline" size={16} color={COLORS.primary} />
                  <Text style={{ color: COLORS.primary, fontWeight: '600' }}>{t('readMore')}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
