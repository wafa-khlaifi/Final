import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

export default function AskGPTScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi 👋 I’m your smart maintenance assistant. Ask me a technical question.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const api_key = "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";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const payload = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: "You are an expert in industrial maintenance. Respond in short, clear, and direct answers (maximum 3 lines).",
        },
        ...updatedMessages,
      ],
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://kaggle.com',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "Sorry, no response received.";
      console.log('API Response:', data);

      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "An error occurred during the request. Please try again."
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const suggestedQuestions = [
    "What does error code E104 mean?",
    "How to reset the compressor?",
    "Why is the motor overheating?",
    "How to check lubrication system?",
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Header title="Smart Assistant" navigation={navigation} />

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={{ padding: 16 }}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.assistantBubble}>
            <ActivityIndicator size="small" color="#007BFF" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your question..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Suggested Questions */}
      <View style={styles.suggestionsContainer}>
        {suggestedQuestions.map((q, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setInput(q);
              setTimeout(() => sendMessage(), 100);
            }}
            style={styles.suggestionButton}
          >
            <Text style={{ fontSize: 13 }}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  chatContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f2f5',
    borderRadius: 25,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
});
