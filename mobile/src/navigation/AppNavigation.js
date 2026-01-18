import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import useAuthStore from '../contexts/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import HomeScreen from '../screens/home/HomeScreen';
import TutorScreen from '../screens/tutor/TutorScreen';
import FocusScreen from '../screens/focus/FocusScreen';
import PlannerScreen from '../screens/planner/PlannerScreen';
import ProfileScreen from '../screens/home/ProfileScreen';

import ChildDashboard from '../screens/parent/ChildDashboard';
import ParentSchedule from '../screens/parent/ParentSchedule';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StudentTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Tutor': iconName = focused ? 'school' : 'school-outline'; break;
            case 'Focus': iconName = focused ? 'timer' : 'timer-outline'; break;
            case 'Planner': iconName = focused ? 'calendar' : 'calendar-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tutor" component={TutorScreen} />
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
    </Tab.Navigator>
  );
};

const ParentTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused ? 'people' : 'people-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: { backgroundColor: colors.surface }
      }}
    >
      <Tab.Screen name="Dashboard" component={ChildDashboard} />
      <Tab.Screen name="Schedule" component={ParentSchedule} />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  const { user } = useAuthStore();
  const { isDark } = useTheme();

  const colors = {
    primary: isDark ? '#7C4DFF' : '#5C6BC0',
    background: isDark ? '#121212' : '#FAFAFA',
    surface: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#212121',
    border: isDark ? '#333333' : '#E0E0E0'
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user.role === 'PARENT' ? (
          <>
            <Stack.Screen name="ParentMain" component={ParentTabs} />
            <Stack.Screen name="ChildProgress" component={ChildDashboard} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={StudentTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
