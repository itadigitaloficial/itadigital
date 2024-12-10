import React, { useEffect } from 'react';
import { AppRoutes } from './routes';
import { useAuthStore } from './lib/store';
import { initializeAuth } from './lib/auth';

function App() {
  const { user, userType } = useAuthStore();

  useEffect(() => {
    // Initialize authentication
    const unsubscribe = initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return <AppRoutes />;
}

export default App;