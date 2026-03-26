import { View, Text } from 'react-native';

export default function MessageBubble({ message }: any) {
  const isUser = message.role === 'user';

  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#7DBDEC' : '#131A2A',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: isUser ? '#000' : '#FFF' }}>
        {message.content}
      </Text>
    </View>
  );
}