/**
 * API Client for Favorites Management
 * Handles JWT authentication and offline sync
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FavoriteItem {
  itemId: string;
  itemData: any;
}

interface FavoriteResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

/**
 * Get JWT token from localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Set JWT token in localStorage
 */
const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove JWT token from localStorage
 */
const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic JWT expiration check (you might want to decode and verify)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

/**
 * Base API request function with authentication
 */
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Handle 401 unauthorized - clear token and redirect to login
  if (response.status === 401) {
    removeToken();
    // You might want to dispatch a logout action here
    // or redirect to login page
    window.location.href = '/login';
  }

  return response;
};

/**
 * Favorites API functions
 */
export const favoritesApi = {
  /**
   * Get user's favorites with pagination
   */
  async getFavorites(limit = 50, skip = 0): Promise<FavoriteResponse> {
    try {
      const response = await apiRequest(
        `/api/favorites?limit=${limit}&skip=${skip}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch favorites');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  /**
   * Add item to favorites
   */
  async addFavorite(itemId: string, itemData: any): Promise<FavoriteResponse> {
    try {
      const response = await apiRequest('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ itemId, itemData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add favorite');
      }

      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  /**
   * Remove favorite by ID
   */
  async removeFavorite(favoriteId: string): Promise<FavoriteResponse> {
    try {
      const response = await apiRequest(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove favorite');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  /**
   * Check if item is favorited
   */
  async checkFavorite(itemId: string): Promise<FavoriteResponse> {
    try {
      const response = await apiRequest(`/api/favorites/check/${itemId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to check favorite status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw error;
    }
  },
};

/**
 * Offline sync queue for favorites
 */
class OfflineSyncQueue {
  private queue: Array<{
    id: string;
    action: 'add' | 'remove';
    itemId: string;
    itemData?: any;
    timestamp: number;
  }> = [];

  private readonly STORAGE_KEY = 'favorites_sync_queue';
  private readonly MAX_QUEUE_SIZE = 100;
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.loadQueue();
    this.setupEventListeners();
  }

  /**
   * Add action to sync queue
   */
  addToQueue(action: 'add' | 'remove', itemId: string, itemData?: any): void {
    const queueItem = {
      id: `${action}_${itemId}_${Date.now()}`,
      action,
      itemId,
      itemData,
      timestamp: Date.now(),
    };

    this.queue.push(queueItem);
    this.trimQueue();
    this.saveQueue();
  }

  /**
   * Process sync queue when online
   */
  async processQueue(): Promise<void> {
    if (!this.isOnline || this.syncInProgress || this.queue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const itemsToProcess = [...this.queue];
      const successfulItems: string[] = [];

      for (const item of itemsToProcess) {
        try {
          if (item.action === 'add' && item.itemData) {
            await favoritesApi.addFavorite(item.itemId, item.itemData);
          } else if (item.action === 'remove') {
            // For remove, we need to find the favorite ID first
            // This is a simplified version - you might need to adjust based on your needs
            const favorites = await favoritesApi.getFavorites(1000, 0);
            const favorite = favorites.data?.find((f: any) => f.itemId === item.itemId);
            if (favorite) {
              await favoritesApi.removeFavorite(favorite._id);
            }
          }
          successfulItems.push(item.id);
        } catch (error) {
          console.error(`Failed to sync ${item.action} for ${item.itemId}:`, error);
          // Don't remove from queue if sync fails - will retry later
        }
      }

      // Remove successfully synced items
      this.queue = this.queue.filter(item => !successfulItems.includes(item.id));
      this.saveQueue();

      if (successfulItems.length > 0) {
        console.log(`Successfully synced ${successfulItems.length} favorites`);
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if item is in queue
   */
  isInQueue(itemId: string, action?: 'add' | 'remove'): boolean {
    return this.queue.some(item =>
      item.itemId === itemId && (!action || item.action === action)
    );
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  private trimQueue(): void {
    if (this.queue.length > this.MAX_QUEUE_SIZE) {
      // Remove oldest items
      this.queue.sort((a, b) => a.timestamp - b.timestamp);
      this.queue = this.queue.slice(0, this.MAX_QUEUE_SIZE);
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
}

// Create singleton instance
export const offlineSyncQueue = new OfflineSyncQueue();

// Export auth utilities
export const auth = {
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
};

// Export API base URL for use in other parts of the app
export { API_BASE_URL };
