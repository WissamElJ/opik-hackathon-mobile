import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'Chat',
        }}
      />
      <Tabs.Screen
        name="interatctions"
        options={{
          title: 'Messages',
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
