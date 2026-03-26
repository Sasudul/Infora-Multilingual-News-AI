import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../../lib/helpers';
import { t } from '../../i18n';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'politics', label: 'Politics' },
  { id: 'economy', label: 'Economy' },
  { id: 'technology', label: 'Tech' },
  { id: 'sports', label: 'Sports' },
  { id: 'local', label: 'Local' },
];

export default function NewsScreen() {
  const [news, setNews] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Load news
  const loadNews = async () => {
    try {
      const data = await fetchNews();
      setNews(data || []);
    } catch (err) {
      console.log(err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // 🔄 Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews().then(() => setRefreshing(false));
  }, []);

  // 🔍 Filter
  const filtered = news.filter((item) => {
    const matchCategory =
      category === 'all' || item.category === category;

    const matchSearch =
      !search ||
      item.title?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF' }}>
          News <Text style={{ color: '#7DBDEC' }}>Feed</Text>
        </Text>

        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          {t('news')}
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#131A2A',
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        >
          <Ionicons name="search" size={16} color="#777" />

          <TextInput
            placeholder={t('search')}
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: '#FFF', padding: 10 }}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, paddingLeft: 20 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setCategory(cat.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              marginRight: 8,
              backgroundColor:
                category === cat.id ? '#7DBDEC' : '#1A1F2E',
            }}
          >
            <Text
              style={{
                color: category === cat.id ? '#000' : '#AAA',
                fontSize: 12,
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView
        style={{ marginTop: 10 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7DBDEC"
          />
        }
      >

        {/* Loading */}
        {loading ? (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            Loading news...
          </Text>
        ) : (
          <>
            {filtered.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#131A2A',
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '600' }}>
                  {item.title || 'No title'}
                </Text>

                <Text style={{ color: '#888', fontSize: 12, marginTop: 5 }}>
                  {item.summary || 'No summary'}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: '#7DBDEC', fontSize: 11 }}>
                    {item.source || 'Unknown'}
                  </Text>

                  <Text style={{ color: '#555', fontSize: 10 }}>
                    {item.publishedAt || ''}
                  </Text>
                </View>
              </View>
            ))}

            {filtered.length === 0 && (
              <Text style={{ color: '#777', textAlign: 'center', marginTop: 20 }}>
                No news found
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
