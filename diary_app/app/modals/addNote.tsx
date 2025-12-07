import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/components/AuthContext';
import { addNote } from '@/services/notesService';

const MOODS = [
  { emoji: '😊', value: 'happy', label: 'Happy' },
  { emoji: '😌', value: 'calm', label: 'Calm' },
  { emoji: '😐', value: 'neutral', label: 'Neutral' },
  { emoji: '😔', value: 'sad', label: 'Sad' },
  { emoji: '😢', value: 'very_sad', label: 'Very Sad' },
];

export default function AddNoteModal() {
  const { user, firstName, lastName } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    if (!selectedMood) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }

    try {
      await addNote({
        title: title.trim(),
        text: text.trim(),
        email: user?.email || '',
        icon: selectedMood,
        useremail: user?.email || '',
        data: null, // serverTimestamp will be used in addNote
      });

      // Clear form
      setTitle('');
      setText('');
      setSelectedMood('');

      // Close modal first
      router.back();

      // Show success message after a short delay
      setTimeout(() => {
        Alert.alert('Success', 'Note added successfully!');
      }, 300);
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter title..."
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your thoughts</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your note here..."
            placeholderTextColor="#9ca3af"
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9fafb',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9fafb',
    minHeight: 150,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  moodButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
});
