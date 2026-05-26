import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/v1/auth/me', {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const userData = data.data || data;
          setUser(userData);
          console.log('AuthContext: User loaded', userData);
        } else {
          console.log('AuthContext: No user found');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Error fetching user', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role?.toLowerCase(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};