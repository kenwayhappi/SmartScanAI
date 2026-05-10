import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text, TextInput, IconButton, useTheme, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Assurez-vous de configurer votre clé API dans un fichier d'environnement (.env)
// Pour ce projet Expo, utilisez: EXPO_PUBLIC_GEMINI_API_KEY=votre_cle
const GEMINI_API_KEY = 'AIzaSyD514t2os-S3gFG_8_xxM8YWpqxDDmIblA';

export default function ChatBotScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis l'IA de Smart Cacao. Comment puis-je vous aider avec votre plantation aujourd'hui ?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Tu es un expert agricole spécialisé dans la culture du cacao. Réponds de manière concise, précise et encourageante. Question: ${userMessage.text}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris la réponse de l'API.";
      
      setMessages(prev => [...prev, { id: Date.now(), text: botReply, sender: 'bot' }]);
    } catch (error) {
      console.error("Erreur Gemini:", error);
      setMessages(prev => [...prev, { id: Date.now(), text: "Désolé, une erreur de connexion à l'IA Google s'est produite. Vérifiez votre clé API.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 60 }}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      <ScrollView 
        style={styles.chatArea}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.messageText, msg.sender === 'user' && styles.userText]}>{msg.text}</Text>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageBubble, styles.botBubble]}>
            <ActivityIndicator animating={true} color={theme.colors.primary} size="small" />
          </View>
        )}
      </ScrollView>

      <Surface style={styles.inputContainer} elevation={4}>
        <TextInput
          mode="outlined"
          placeholder="Posez votre question..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          outlineColor="transparent"
          activeOutlineColor={theme.colors.primary}
          multiline
          disabled={isLoading}
        />
        <IconButton
          icon="send"
          iconColor={theme.colors.primary}
          size={28}
          onPress={sendMessage}
          disabled={!input.trim() || isLoading}
        />
      </Surface>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E8F5E9', // theme.colors.primary (light variant)
    borderBottomRightRadius: 0,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userText: {
    color: '#2E7D32',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    maxHeight: 100,
  }
});
