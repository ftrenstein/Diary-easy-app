import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/components/AuthContext';
import CustomButton from '@/components/CustomButton';
import { navigate } from 'expo-router/build/global-state/routing';

export default function DashboardScreen() {
  const { logout } = useAuth();

  const handleAddEntry = () => {
    // Logic for adding new entry
    console.log('Add new entry');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Text style={styles.greeting}>Hello, John Doe</Text>
          <Text style={styles.question}>How are you doing today?</Text>
        </View>

        {/* Recently Added Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently added</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Entry Cards */}
          <View style={styles.entryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.entryIcon} />
              <View style={styles.dateChip}>
                <Text style={styles.dateText}>28 May 21</Text>
              </View>
            </View>
            <Text style={styles.entryTitle}>First day in work</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreText}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.entryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.entryIcon} />
              <View style={styles.dateChip}>
                <Text style={styles.dateText}>27 May 21</Text>
              </View>
            </View>
            <Text style={styles.entryTitle}>Weekend thoughts</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreText}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your feel for your 7 entries</Text>
          <View style={styles.statsCard}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>📊 Mood Chart</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, { backgroundColor: '#4CAF50' }]}
                  />
                  <Text style={styles.statText}>50%</Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, { backgroundColor: '#2196F3' }]}
                  />
                  <Text style={styles.statText}>20%</Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, { backgroundColor: '#FF9800' }]}
                  />
                  <Text style={styles.statText}>15%</Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, { backgroundColor: '#F44336' }]}
                  />
                  <Text style={styles.statText}>10%</Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, { backgroundColor: '#9C27B0' }]}
                  />
                  <Text style={styles.statText}>5%</Text>
                </View>
              </View>
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
    width: 14,
    height: 14,
    backgroundColor: '#6366f1',
    borderRadius: 7,
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
});
