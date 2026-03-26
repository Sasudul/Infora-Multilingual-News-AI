import { View, Text } from 'react-native';

export default function NewsCard({ item }: any) {
  return (
    <View
      style={{
        backgroundColor: '#131A2A',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <Text style={{ color: '#FFF', fontWeight: '600' }}>
        {item.title}
      </Text>

      <Text style={{ color: '#888', fontSize: 12, marginTop: 5 }}>
        {item.summary}
      </Text>

      <Text style={{ color: '#7DBDEC', fontSize: 11, marginTop: 8 }}>
        {item.source}
      </Text>
    </View>
  );
}