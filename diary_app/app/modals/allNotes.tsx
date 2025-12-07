import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/components/AuthContext';
import { getUserNotes } from '@/services/notesService';

const MOODS: { [key: string]: string } = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢',
};

export default function AllNotesModal() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const userNotes = await getUserNotes(user.email);
      setNotes(userNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Notes</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first entry
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.entryCard}
              onPress={() => {
                router.push({
                  pathname: '/modals/viewNote',
                  params: {
                    id: note.id,
                    title: note.title,
                    text: note.text,
                    icon: note.icon,
                    data: note.data?.toDate
                      ? note.data.toDate().toISOString()
                      : new Date().toISOString(),
                  },
                });
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.entryIcon}>
                  {MOODS[note.icon] || note.icon || '😊'}
                </Text>
                <View style={styles.dateChip}>
                  <Text style={styles.dateText}>
                    {note.data?.toDate
                      ? new Date(note.data.toDate()).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          }
                        )
                      : 'Today'}
                  </Text>
                </View>
              </View>
              <Text style={styles.entryTitle}>{note.title}</Text>
              <Text style={styles.entryText} numberOfLines={2}>
                {note.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5f5f5f',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: 'rgba(29, 58, 88, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateChip: {
    backgroundColor: '#00ffff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 20,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 22,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  entryText: {
    fontSize: 14,
    color: '#5f5f5f',
    lineHeight: 20,
  },
});
