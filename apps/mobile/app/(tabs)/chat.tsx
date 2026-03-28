import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, FlatList,
  Modal, ScrollView, Linking, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../lib/auth';
import { chatApi } from '../../lib/api';
import { COLORS } from '../../styles/colors';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: any[];
}

interface ChatSessionInfo {
  id: string;
  messages: any[];
  createdAt: string;
}

export default function ChatScreen() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSessionInfo[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user) loadSessions();
  }, [user]);

  const loadSessions = async () => {
    try {
      const data = await chatApi.getSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('Failed to load sessions:', e);
    }
  };

  const loadSession = async (id: string) => {
    try {
      const data = await chatApi.getSession(id);
      setSessionId(data.id);
      setMessages(
        (data.messages || []).map((m: any) => ({
          id: Math.random().toString(),
          role: m.role,
          content: m.content,
          cards: m.cards || [],
        }))
      );
      setShowSidebar(false);
    } catch (e) {
      console.log('Failed to load session:', e);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setShowSidebar(false);
  };

  const deleteSession = async (id: string) => {
    try {
      await chatApi.deleteSession(id);
      if (sessionId === id) startNewChat();
      loadSessions();
    } catch (e) {
      console.log('Failed to delete session:', e);
    }
  };

  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await chatApi.sendMessage(text, sessionId || undefined, lang);

      if (res.sessionId && !sessionId) {
        setSessionId(res.sessionId);
        loadSessions();
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply?.content || 'Sorry, I couldn\'t generate a response.',
        cards: res.cards || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log('Chat error:', error);
      const errMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '❌ Failed to connect to server. Please check your connection.',
      };
      setMessages((prev) => [...prev, errMsg]);
    }

    setTyping(false);
  };

  const getCardTitle = (card: any) => {
    if (lang === 'si') return card.titleSi || card.title || '';
    if (lang === 'ta') return card.titleTa || card.title || '';
    return card.title || '';
  };

  const getCardDesc = (card: any) => {
    if (lang === 'si') return card.descriptionSi || card.description || '';
    if (lang === 'ta') return card.descriptionTa || card.description || '';
    return card.description || '';
  };

  const isEmpty = messages.length === 0;

  const SUGGESTIONS = [
    lang === 'si' ? 'ශ්‍රී ලංකා පුවත්' : lang === 'ta' ? 'இலங்கை செய்திகள்' : 'Latest news in Sri Lanka',
    lang === 'si' ? 'ගමන් බලපත්‍ර අයදුම්පත' : lang === 'ta' ? 'கடவுச்சீட்டு' : 'Passport application guide',
    lang === 'si' ? 'NIC ලියාපදිංචිය' : lang === 'ta' ? 'NIC பதிவு' : 'How to get NIC',
    lang === 'si' ? 'විනිමය අනුපාත' : lang === 'ta' ? 'மாற்று விகிதங்கள்' : 'Exchange rates today',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {user && (
              <TouchableOpacity onPress={() => setShowSidebar(true)}>
                <Ionicons name="menu" size={22} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            )}
            <View style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: 'rgba(125,189,236,0.15)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="sparkles" size={16} color={COLORS.primary} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>Infora AI</Text>
              <Text style={{ fontSize: 10, color: '#22C55E' }}>● Online</Text>
            </View>
          </View>

          <TouchableOpacity onPress={startNewChat}>
            <View style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
              backgroundColor: COLORS.primary + '15', flexDirection: 'row', alignItems: 'center', gap: 4,
            }}>
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>{t('newChat')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {isEmpty ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
              {t('askAnything')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13, marginBottom: 24 }}>
              {t('noMessages')}
            </Text>

            {/* Suggestion chips */}
            <View style={{ gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => send(s)}
                  style={{
                    backgroundColor: '#131A2A', paddingHorizontal: 16, paddingVertical: 12,
                    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 14 }}>
                {/* Bubble */}
                <View style={{
                  maxWidth: '85%',
                  alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <View style={{
                    padding: 12, borderRadius: 16,
                    backgroundColor: item.role === 'user' ? COLORS.primary : '#131A2A',
                  }}>
                    <Text style={{
                      color: item.role === 'user' ? '#0A0D14' : 'rgba(255,255,255,0.85)',
                      fontSize: 14, lineHeight: 20,
                    }}>
                      {item.content}
                    </Text>
                  </View>
                </View>

                {/* Response Cards */}
                {item.cards && item.cards.length > 0 && (
                  <ScrollView
                    horizontal showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 8 }}
                    contentContainerStyle={{ gap: 8, paddingRight: 16 }}
                  >
                    {item.cards.map((card: any, ci: number) => (
                      <TouchableOpacity
                        key={ci}
                        onPress={() => card.sourceUrl && Linking.openURL(card.sourceUrl)}
                        style={{
                          width: 220, backgroundColor: '#1A1F2E', borderRadius: 12,
                          padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Ionicons
                            name={card.type === 'news' ? 'newspaper' : 'briefcase'}
                            size={12} color={card.type === 'news' ? '#22D3EE' : '#F59E0B'}
                          />
                          <Text style={{ color: card.type === 'news' ? '#22D3EE' : '#F59E0B', fontSize: 10, fontWeight: '600' }}>
                            {(card.type || 'info').toUpperCase()}
                          </Text>
                          {card.verified && <Ionicons name="checkmark-circle" size={10} color="#22C55E" />}
                        </View>
                        <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 12 }} numberOfLines={2}>
                          {getCardTitle(card)}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }} numberOfLines={2}>
                          {getCardDesc(card)}
                        </Text>
                        {card.source && (
                          <Text style={{ color: COLORS.primary, fontSize: 10, marginTop: 6 }}>
                            {card.source}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
            ListFooterComponent={
              typing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}>
                  <ActivityIndicator color={COLORS.primary} size="small" />
                  <Text style={{ color: '#888', fontSize: 12 }}>{t('typing')}</Text>
                </View>
              ) : null
            }
          />
        )}

        {/* Input */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8,
          borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
          backgroundColor: COLORS.background,
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t('ask')}
            placeholderTextColor="#555"
            style={{
              flex: 1, backgroundColor: '#131A2A', color: '#FFF',
              borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14,
            }}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={{
              backgroundColor: input.trim() ? COLORS.primary : '#1A1F2E',
              padding: 11, borderRadius: 12,
            }}
          >
            <Ionicons name="send" size={18} color={input.trim() ? '#000' : '#555'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Sessions Sidebar Modal */}
      <Modal visible={showSidebar} animationType="slide" transparent>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{
            width: '75%', backgroundColor: '#0D1117',
            borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.06)',
          }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                <TouchableOpacity
                  onPress={startNewChat}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                    paddingVertical: 12, borderRadius: 12,
                    backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary + '30',
                  }}
                >
                  <Ionicons name="add" size={18} color={COLORS.primary} />
                  <Text style={{ color: COLORS.primary, fontWeight: '600' }}>{t('newChat')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
                {sessions.length === 0 ? (
                  <Text style={{ color: '#555', textAlign: 'center', marginTop: 30 }}>{t('noSessions')}</Text>
                ) : (
                  sessions.map((s) => {
                    const firstMsg = s.messages?.[0]?.content || 'New Chat';
                    const snippet = firstMsg.length > 35 ? firstMsg.substring(0, 35) + '...' : firstMsg;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => loadSession(s.id)}
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          padding: 12, borderRadius: 10, marginBottom: 4,
                          backgroundColor: sessionId === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                          <Ionicons name="chatbubble" size={14} color="rgba(255,255,255,0.3)" />
                          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }} numberOfLines={1}>
                            {snippet}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteSession(s.id)}>
                          <Ionicons name="trash-outline" size={16} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </SafeAreaView>
          </View>

          {/* Tap outside to close */}
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setShowSidebar(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
