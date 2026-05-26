import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Check if we're on a master route
        const isMasterRoute = window.location.pathname.startsWith('/master');
        
        const endpoint = isMasterRoute ? '/api/v1/auth/master/me' : '/api/v1/auth/me';
        
        const response = await fetch(endpoint, {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const userData = data.data || data;
          setUser(userData);
          setRole(userData.role?.toLowerCase());
          setIsMaster(isMasterRoute || userData.role === 'superadmin');
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRole();
  }, []);

  return { user, role, loading, isMaster };
};