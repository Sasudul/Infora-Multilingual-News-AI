import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { sendMessage } from "../../lib/helpers";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await sendMessage(text);

      console.log("BACKEND RESPONSE:", res); // 🔥 debug

      const replyText =
        res?.data?.reply?.content || "⚠️ No response from server";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log("ERROR:", error);

      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "❌ Failed to connect to server",
      };

      setMessages((prev) => [...prev, errMsg]);
    }

    setTyping(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0D14" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.06)",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(125,189,236,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="sparkles" size={18} color="#7DBDEC" />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFF" }}>
              Infora AI
            </Text>
            <Text style={{ fontSize: 10, color: "#22C55E" }}>● Online</Text>
          </View>
        </View>

        {/* Messages */}
        {isEmpty ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Ask anything about Sri Lankan news or services 🇱🇰
            </Text>
          </ScrollView>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 20 }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                style={{
                  maxWidth: "85%",
                  marginBottom: 12,
                  alignSelf:
                    item.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    backgroundColor:
                      item.role === "user" ? "#7DBDEC" : "#131A2A",
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.role === "user"
                          ? "#0A0D14"
                          : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              typing ? (
                <Text style={{ color: "#888" }}>Typing...</Text>
              ) : null
            }
          />
        )}

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.06)",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Infora..."
            placeholderTextColor="#666"
            style={{
              flex: 1,
              backgroundColor: "#131A2A",
              color: "#FFF",
              borderRadius: 10,
              padding: 10,
            }}
            onSubmitEditing={() => send(input)}
          />

          <TouchableOpacity
            onPress={() => send(input)}
            style={{
              marginLeft: 10,
              backgroundColor: "#7DBDEC",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Ionicons name="send" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
