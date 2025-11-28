// App/screens/ChatTutorScreen.js
// ==========================================================
// Pantalla de chat con Tutor IA (híbrido)
// ==========================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { tutorMessageAI } from "../services/ai/tutorAI";

export default function ChatTutorScreen({ route }) {
  const [messages, setMessages] = useState([
    { id: "1", from: "bot", text: "Hola 👋 Soy tu tutor InsQUIZ. ¿En qué parte tienes dudas?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput("");

    const userMsg = { id: Date.now().toString(), from: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);

    setSending(true);
    try {
      const reply = await tutorMessageAI(userText);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.warn(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "bot",
          text: "Lo siento, tuve un problema procesando tu mensaje. Intenta de nuevo.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.from === "user" ? styles.bubbleUser : styles.bubbleBot,
      ]}
    >
      <Text style={styles.bubbleText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu duda..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>{sending ? "..." : "Enviar"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#6a0dad",
  },
  bubbleBot: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  bubbleText: {
    color: "#fff",
  },
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    color: "#000",
  },
  sendBtn: {
    backgroundColor: "#6a0dad",
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});
