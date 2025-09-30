import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Load user-specific favorites
  useEffect(() => {
    const loadUserFavorites = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      
      if (isAuthenticated && userEmail) {
        const userFavoritesKey = `favorites_${userEmail}`;
        const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');
        setFavorites(storedFavorites);
      } else {
        setFavorites([]);
      }
    };

    loadUserFavorites();
    
    // Listen for auth changes
    const handleStorageChange = () => {
      loadUserFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };

  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated()) {
      toast({
        title: t('favorites.loginRequired'),
        description: t('favorites.loginRequiredDesc'),
        variant: 'destructive'
      });
      
      // Redirect to login page immediately
      window.location.href = '/login';
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [productId, ...favorites]; // Add new favorites at the top
    
    setFavorites(updatedFavorites);
    
    // Store favorites with user-specific key
    const userFavoritesKey = `favorites_${userEmail}`;
    localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));

    // Show feedback
    const isAdding = !favorites.includes(productId);
    toast({
      title: isAdding ? t('favorites.added') : t('favorites.removed'),
      description: isAdding 
        ? t('favorites.addedDesc')
        : t('favorites.removedDesc'),
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};