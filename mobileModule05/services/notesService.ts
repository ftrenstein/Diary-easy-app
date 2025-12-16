import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Note {
  data: any;
  title: string;
  text: string;
  icon?: string;
  email: string;
}

export const addNote = async ({ text, data, title, icon, email }: Note) => {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      text,
      data: serverTimestamp(),
      title,
      icon,
      email,
    });
    console.log('Заметка добавлена с ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Ошибка добавления заметки:', error);
    throw error;
  }
};

export const getMoodStatistics = async (email: string) => {
  try {
    const q = query(
      collection(db, 'notes')
      // where("email", "==", email),
    );

    const querySnapshot = await getDocs(q);
    const notes = querySnapshot.docs.map((doc) => doc.data());

    // Count mood occurrences
    const moodCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      const mood = note.icon || 'neutral';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    console.log('Mood statistics:', moodCounts);
    return moodCounts;
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
};

export const getUserNotes = async (email: string) => {
  try {
    const q = query(collection(db, 'notes'), orderBy('data', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Ошибка получения заметок:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
    console.log('Заметка удалена:', noteId);
  } catch (error) {
    console.error('Ошибка удаления заметки:', error);
    throw error;
  }
};

export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  try {
    await updateDoc(doc(db, 'notes', noteId), {
      ...updates,
      data: serverTimestamp(),
    });
    console.log('Заметка обновлена:', noteId);
  } catch (error) {
    console.error('Ошибка обновления заметки:', error);
    throw error;
  }
};
