import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/components/AuthContext';
import CustomButton from '@/components/CustomButton';
import { navigate } from 'expo-router/build/global-state/routing';
import { getUserNotes, getMoodStatistics } from '@/services/notesService';
import { useFocusEffect } from 'expo-router';


const MOODS: { [key: string]: string } = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢',
};

export default function DashboardScreen() {
  const { logout, user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [moodStats, setMoodStats] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);


  const loadNotes = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const userNotes = await getUserNotes(user.email);
      setNotes(userNotes);
      
      // Load mood statistics
      const stats = await getMoodStatistics(user.email);
      setMoodStats(stats);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Reload notes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTopMoods = () => {
    return Object.entries(moodStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Diary</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            Hello, {useAuth().firstName} {useAuth().lastName}
          </Text>
          <Text style={styles.question}>How are you doing today?</Text>
        </View>

        {/* Recently Added Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently added</Text>
            <TouchableOpacity onPress={() => navigate('/modals/allNotes')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
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
            notes.slice(0, 3).map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.entryCard}
                onPress={() => {
                  navigate({
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
                  } as any);
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
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreText}>⋯</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your mood statistics</Text>
          <View style={styles.statsCard}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>📊 Top Moods</Text>
              {Object.keys(moodStats).length === 0 ? (
                <Text style={styles.emptyStats}>No mood data yet</Text>
              ) : (
                <View style={styles.statsRow}>
                  {getTopMoods().map(([mood, count]) => (
                    <View key={mood} style={styles.statItem}>
                      <Text style={styles.moodEmoji}>
                        {MOODS[mood] || mood}
                      </Text>
                      <Text style={styles.statValue}>{count}</Text>
                      <Text style={styles.statLabel}>
                        {mood.replace('_', ' ')}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: 'rgba(29, 58, 88, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#5f5f5f',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: '#080808',
    lineHeight: 28,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5f5f5f',
    letterSpacing: 0.2,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.1,
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
    position: 'relative',
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
  },
  moreButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 3,
    shadowColor: 'rgba(29, 58, 88, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartText: {
    fontSize: 24,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'capitalize',
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  emptyStats: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5f5f5f',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
