import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const hasEntry = (day: number | null) => {
    // Mock data - replace with real entry checking logic
    return day && [5, 12, 18, 25].includes(day);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>Track your diary entries</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>

          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendar}>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {dayNames.map((dayName) => (
              <Text key={dayName} style={styles.dayHeader}>
                {dayName}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.daysGrid}>
            {generateCalendarDays().map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isToday(day) && styles.todayCell,
                  hasEntry(day) ? styles.entryCell : null,
                ]}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        isToday(day) && styles.todayText,
                        hasEntry(day) ? styles.entryText : null,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasEntry(day) && <View style={styles.entryDot} />}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Entry Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>This Month</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Streak Days</Text>
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
    backgroundColor: "#f3f3f3",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButtonText: {
    fontSize: 24,
    color: "#6366f1",
    fontWeight: "bold",
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  calendar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "rgba(29, 58, 88, 0.05)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: (width - 80) / 7,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  todayCell: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
  },
  todayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  entryCell: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
  },
  entryText: {
    color: "#0369a1",
    fontWeight: "600",
  },
  entryDot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0369a1",
  },
  summarySection: {
    marginTop: 24,
    marginBottom: 100,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "rgba(29, 58, 88, 0.05)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
