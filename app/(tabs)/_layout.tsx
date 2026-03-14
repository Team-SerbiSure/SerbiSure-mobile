import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.accent,
        tabBarInactiveTintColor: Theme.colors.muted,
        tabBarStyle: {
          backgroundColor: Theme.colors.navBg,
          borderTopColor: Theme.colors.cardBorder,
        },
        headerStyle: {
          backgroundColor: Theme.colors.navBg,
        },
        headerTitleStyle: {
          color: Theme.colors.text,
          fontWeight: '700',
        },
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          href: isWorker ? null : '/',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Dashboard',
          href: !isWorker ? null : '/explore',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="grid" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          href: isWorker ? null : '/services',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="construct" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history/index"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="time" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
