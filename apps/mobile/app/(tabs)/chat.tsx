import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { text: 'Latest news in Sri Lanka', icon: 'newspaper' as const },
  { text: 'How to apply for a passport?', icon: 'book' as const },
  { text: 'NIC application process', icon: 'card' as const },
  { text: 'Government services guide', icon: 'business' as const },
];

function getDemo(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('news') || q.includes('latest'))
    return 'Here are the latest headlines:\n\n📰 Central Bank Maintains Policy Rates (Daily News)\n📰 IT Exports Reach $1.7B (Ada Derana)\n📰 Cricket Squad Announced (NewsFirst)\n\nAll sourced from verified Sri Lankan media outlets.';
  if (q.includes('passport'))
    return '🛂 Passport Application Guide:\n\n1️⃣ Get form K35A (new) or K35B (renewal)\n2️⃣ Fill in BLOCK CAPITALS\n3️⃣ Get JP/Attorney certification\n4️⃣ Attach NIC, birth cert, photos\n5️⃣ Submit at Battaramulla or Regional Office\n6️⃣ Fee: LKR 3,500 (normal)\n\nSource: immigration.gov.lk';
  if (q.includes('nic') || q.includes('identity'))
    return '🪪 NIC Registration Guide:\n\n1️⃣ Get form from GN/Divisional Secretariat\n2️⃣ Attach birth certificate + photos\n3️⃣ Submit at Divisional Secretariat\n4️⃣ Processing: 2-4 weeks\n5️⃣ Fee: LKR 100 (first issue)\n\nSource: drp.gov.lk';
  return "I can help you with Sri Lankan news, government services, and general info! Try asking about:\n\n• Latest news\n• Passport application\n• NIC registration\n• Driving license\n• Business registration";
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1000));

    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getDemo(text) };
    setTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const isEmpty = messages.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14,
          borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(125,189,236,0.15)',
            alignItems: 'center', justifyContent: 'center', marginRight: 12,
          }}>
            <Ionicons name="sparkles" size={18} color="#7DBDEC" />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>Infora AI</Text>
            <Text style={{ fontSize: 10, color: '#22C55E' }}>● Online</Text>
          </View>
        </View>

        {/* Messages */}
        {isEmpty ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(125,189,236,0.15)',
                alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Ionicons name="sparkles" size={26} color="#7DBDEC" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 6 }}>
                Welcome to Infora
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                Ask me anything about Sri Lankan news or government services
              </Text>
            </View>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s.text}
                onPress={() => send(s.text)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14,
                  backgroundColor: '#131A2A', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
                  marginBottom: 8,
                }}
              >
                <Ionicons name={s.icon} size={18} color="#7DBDEC" />
                <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.text}</Text>
                <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.15)" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={{
                maxWidth: '85%', marginBottom: 12,
                alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <View style={{
                  paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18,
                  backgroundColor: item.role === 'user' ? '#7DBDEC' : '#131A2A',
                  borderBottomRightRadius: item.role === 'user' ? 6 : 18,
                  borderBottomLeftRadius: item.role === 'user' ? 18 : 6,
                }}>
                  <Text style={{
                    fontSize: 14, lineHeight: 22,
                    color: item.role === 'user' ? '#0A0D14' : 'rgba(255,255,255,0.75)',
                  }}>
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={typing ? (
              <View style={{
                alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, borderBottomLeftRadius: 6,
                backgroundColor: '#131A2A', flexDirection: 'row', gap: 4,
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
              </View>
            ) : null}
          />
        )}

        {/* Input */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 14,
          borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Infora..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            style={{
              flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
              color: '#FFF', fontSize: 14,
            }}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 14,
              backgroundColor: input.trim() ? '#7DBDEC' : 'rgba(255,255,255,0.05)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="send" size={18} color={input.trim() ? '#0A0D14' : 'rgba(255,255,255,0.2)'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
