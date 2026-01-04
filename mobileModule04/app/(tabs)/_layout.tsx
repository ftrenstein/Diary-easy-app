import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import GradientButton from '@/components/GradientButton';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Custom tab bar icon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome
      size={props.size || 24}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

// Custom add button component
function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <GradientButton
      onPress={onPress}
      style={styles.addButtonContainer}
      gradientStyle={styles.addButton}
    >
      <FontAwesome
        name="plus"
        size={22}
        color="#fff"
        // backgroundColor="#6366f1"
      />
    </GradientButton>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const handleAddEntry = () => {
    console.log('Add new entry from tab bar');
    router.push('/modals/addNote');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: () => <AddButton onPress={handleAddEntry} />,
          tabBarButton: () => (
            <View style={styles.tabButtonWrapper}>
              <AddButton onPress={handleAddEntry} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color="#ccc" />
          ),
          tabBarButton: () => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.3,
              }}
            >
              <TabBarIcon name="calendar" color="#ccc" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButtonWrapper: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    // Стили для GradientButton будут применены автоматически
  },
  addButton: {
    width: 50,
    height: 50,
  },
});
