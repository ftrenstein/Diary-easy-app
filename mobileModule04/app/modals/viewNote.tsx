import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { deleteNote } from '@/services/notesService';

const MOODS: { [key: string]: string } = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢',
};

export default function ViewNoteModal() {
  const params = useLocalSearchParams();
  const note = {
    id: params.id as string,
    title: params.title as string,
    text: params.text as string,
    icon: params.icon as string,
    data: params.data as string,
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleDeletePress = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteNote(note.id);
      setShowDeleteConfirm(false);
      router.back();
    } catch (error) {
      console.error('Error deleting note:', error);
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Note Details</Text>
        <TouchableOpacity
          onPress={handleDeletePress}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.moodSection}>
          <Text style={styles.label}>Mood</Text>
          <View style={styles.moodDisplay}>
            <Text style={styles.moodEmoji}>
              {MOODS[note.icon] || note.icon || '😊'}
            </Text>
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Date</Text>
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>
              {note.data
                ? new Date(note.data).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Today'}
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.titleDisplay}>
            <Text style={styles.titleText}>{note.title}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note</Text>
          <View style={styles.textDisplay}>
            <Text style={styles.noteText}>{note.text}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🗑️</Text>
            <Text style={styles.modalTitle}>Delete Note</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </Text>

            {deleting ? (
              <ActivityIndicator
                size="large"
                color="#ef4444"
                style={styles.loader}
              />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelDelete}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteConfirmButton]}
                  onPress={handleConfirmDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  moodSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5f5f5f',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  moodDisplay: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    boxShadow: '0 4px 10px rgba(29, 58, 88, 0.05)',
  },
  moodEmoji: {
    fontSize: 48,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5f5f5f',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  dateChip: {
    backgroundColor: '#00ffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  titleDisplay: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    boxShadow: '0 4px 10px rgba(29, 58, 88, 0.05)',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 24,
  },
  textDisplay: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    elevation: 2,
    boxShadow: '0 4px 10px rgba(29, 58, 88, 0.05)',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#5f5f5f',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  loader: {
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  deleteConfirmButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
