import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigation from './src/navigation/AppNavigation';
import useAuthStore from './src/contexts/AuthContext';

function AppContent() {
  const { initialize, isLoading } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return null;
  }

  return <AppNavigation />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
