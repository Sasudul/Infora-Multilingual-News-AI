import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'globe' as const },
  { id: 'politics', label: 'Politics', icon: 'flag' as const },
  { id: 'economy', label: 'Economy', icon: 'trending-up' as const },
  { id: 'technology', label: 'Tech', icon: 'hardware-chip' as const },
  { id: 'sports', label: 'Sports', icon: 'football' as const },
  { id: 'local', label: 'Local', icon: 'location' as const },
];

const DEMO_NEWS = [
  { id: '1', title: 'Central Bank Maintains Policy Interest Rates Unchanged', summary: 'CBSL maintains SDFR and SLFR citing stable inflation.', source: 'Daily News', time: '2h', category: 'economy', verified: true },
  { id: '2', title: 'Sri Lanka IT/BPO Exports Reach $1.7 Billion Milestone', summary: "IT sector becomes 5th largest forex earner.", source: 'Ada Derana', time: '4h', category: 'technology', verified: true },
  { id: '3', title: 'Cricket Squad Announced for Upcoming Test Series', summary: '18-member squad announced with young talent.', source: 'NewsFirst', time: '5h', category: 'sports', verified: true },
  { id: '4', title: 'Parliament Approves Education Ordinance Amendment', summary: 'Digital literacy introduced to national curriculum.', source: 'Daily Mirror', time: '6h', category: 'politics', verified: true },
  { id: '5', title: 'Colombo Port Records Highest Container Throughput', summary: 'Key transhipment hub in the Indian Ocean.', source: 'Sunday Times', time: '8h', category: 'economy', verified: true },
  { id: '6', title: 'Solar Power Expansion in Southern Province', summary: 'CEB expands capacity in Hambantota and Matara.', source: 'Daily News', time: '1d', category: 'local', verified: true },
];

export default function NewsScreen() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = DEMO_NEWS.filter((n) => {
    const matchCat = category === 'all' || n.category === category;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF' }}>
          News <Text style={{ color: '#7DBDEC' }}>Feed</Text>
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
          Verified Sri Lankan sources only
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        }}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.25)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search news..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: '#FFF', fontSize: 14 }}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 12, maxHeight: 44 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setCategory(cat.id)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8,
              backgroundColor: category === cat.id ? 'rgba(125,189,236,0.15)' : 'rgba(255,255,255,0.04)',
              borderWidth: 1,
              borderColor: category === cat.id ? 'rgba(125,189,236,0.3)' : 'rgba(255,255,255,0.06)',
            }}
          >
            <Ionicons name={cat.icon} size={14} color={category === cat.id ? '#7DBDEC' : 'rgba(255,255,255,0.4)'} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: category === cat.id ? '#7DBDEC' : 'rgba(255,255,255,0.4)' }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7DBDEC" />}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        {filtered.map((article) => (
          <TouchableOpacity
            key={article.id}
            activeOpacity={0.7}
            style={{
              backgroundColor: '#131A2A', borderRadius: 16, padding: 16, marginBottom: 10,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFF', marginBottom: 6, lineHeight: 22 }}>
              {article.title}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12, lineHeight: 18 }}>
              {article.summary}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="newspaper" size={12} color="#7DBDEC" />
                <Text style={{ fontSize: 11, color: '#7DBDEC', fontWeight: '600' }}>{article.source}</Text>
                {article.verified && <Ionicons name="checkmark-circle" size={13} color="#22C55E" />}
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{article.time} ago</Text>
            </View>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 40, fontSize: 14 }}>
            No articles found
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
