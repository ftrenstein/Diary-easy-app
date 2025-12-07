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
  email: string;
  icon?: string;
  useremail?: string;
}

export const addNote = async ({
  text,
  email,
  data,
  title,
  icon,
  useremail,
}: Note) => {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      text,
      email,
      data: serverTimestamp(),
      title,
      icon,
      useremail,
    });
    console.log('Заметка добавлена с ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Ошибка добавления заметки:', error);
    throw error;
  }
};

// Получить все заметки пользователя
export const getUserNotes = async (userEmail: string) => {
  try {
    const q = query(
      collection(db, 'notes'),
      // where('email', '==', userEmail),
      orderBy('data', 'desc')
    );
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

// Удалить заметку
export const deleteNote = async (noteId: string) => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
    console.log('Заметка удалена:', noteId);
  } catch (error) {
    console.error('Ошибка удаления заметки:', error);
    throw error;
  }
};

// Обновить заметку
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
