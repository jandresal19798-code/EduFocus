import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { tutorAPI } from '../../services/api';

const TutorScreen = () => {
  const { colors } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Matemáticas');
  const scrollRef = useRef();

  const subjects = ['Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Lengua'];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await tutorAPI.getConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const startNewConversation = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const response = await tutorAPI.createConversation({
        subject,
        topic: message.substring(0, 50),
        initialMessage: message
      });
      
      setMessages([
        { role: 'user', content: message },
        { role: 'tutor', content: response.data.tutorResponse }
      ]);
      setActiveConversation(response.data.conversation);
      setMessage('');
      loadConversations();
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeConversation) return;
    
    const userMsg = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    try {
      const response = await tutorAPI.sendMessage(activeConversation.id, userMsg);
      setMessages(prev => [
        ...prev,
        { role: 'tutor', content: response.data.reply }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tutor Inteligente</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Pregunta, aprende, resuelve
        </Text>
      </View>

      <ScrollView 
        style={styles.subjectContainer} 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectsRow}
      >
        {subjects.map((subj) => (
          <TouchableOpacity
            key={subj}
            style={[
              styles.subjectChip,
              { 
                backgroundColor: subject === subj ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
            onPress={() => setSubject(subj)}
          >
            <Text style={[
              styles.subjectText,
              { color: subject === subj ? '#FFFFFF' : colors.text }
            ]}>
              {subj}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeConversation ? (
        <>
          <ScrollView 
            ref={scrollRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, index) => (
              <View 
                key={index}
                style={[
                  styles.messageBubble,
                  { 
                    backgroundColor: msg.role === 'user' ? colors.primary : colors.surface,
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    borderBottomLeftRadius: msg.role === 'tutor' ? 4 : 16,
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 16
                  }
                ]}
              >
                <Text style={[
                  styles.messageText,
                  { color: msg.role === 'user' ? '#FFFFFF' : colors.text }
                ]}>
                  {msg.content}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text 
              }]}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor={colors.gray}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.newConversationCard}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.icon, { color: colors.primary }]}>💡</Text>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            ¿Tienes alguna duda?
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Escribe tu pregunta y el tutor te ayudará a resolverla paso a paso
          </Text>
          
          <TextInput
            style={[styles.questionInput, { 
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            placeholder="Ej: ¿Cómo resuelvo una ecuación de segundo grado?"
            placeholderTextColor={colors.gray}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={startNewConversation}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.startButtonText}>Comenzar Chat</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  subjectContainer: { marginBottom: 16 },
  subjectsRow: { paddingHorizontal: 20 },
  subjectChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  subjectText: { fontSize: 14, fontWeight: '500' },
  chatContainer: { flex: 1, paddingHorizontal: 16 },
  messagesContent: { paddingVertical: 16 },
  messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 16, marginBottom: 12 },
  messageText: { fontSize: 15, lineHeight: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { fontSize: 18, color: '#FFFFFF', marginLeft: 2 },
  newConversationCard: { flex: 1, margin: 20, padding: 24, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 40 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  questionInput: { width: '100%', borderRadius: 12, padding: 16, marginBottom: 16, minHeight: 80 },
  startButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  startButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});

export default TutorScreen;
