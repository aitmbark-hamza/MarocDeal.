import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Plus, Trash2, Activity, Heart, MapPin, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockProducts } from '@/data/mockData';
import { Link } from 'react-router-dom';
interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
}
const Profile = () => {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [newActivity, setNewActivity] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const {
    favorites: favoriteIds,
    toggleFavorite,
    favoritesCount
  } = useFavorites();

  // Get the actual product objects from the favorite IDs
  const favoriteProducts = mockProducts.filter(product => favoriteIds.includes(product.id));

  // Check authentication and load user data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data
    const storedEmail = localStorage.getItem('userEmail') || '';
    const storedUsername = localStorage.getItem('username') || '';
    setUserEmail(storedEmail);
    setUsername(storedUsername);

    // Load activities from localStorage
    const storedActivities = localStorage.getItem('userActivities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('userActivities');
    toast({
      title: t('auth.loggedOut'),
      description: t('auth.loggedOutSuccess')
    });
    navigate('/');
  };
  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;
    const activity: ActivityItem = {
      id: Date.now().toString(),
      description: newActivity.trim(),
      timestamp: new Date().toISOString()
    };
    const updatedActivities = [activity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('userActivities', JSON.stringify(updatedActivities));
    setNewActivity('');
    toast({
      title: 'Activity Added',
      description: 'Your activity has been recorded successfully.'
    });
  };
  const removeActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem('userActivities', JSON.stringify(updatedActivities));
    toast({
      title: 'Activity Removed',
      description: 'Activity has been deleted successfully.'
    });
  };
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };
  const removeFromFavorites = (productId: string) => {
    toggleFavorite(productId);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header - Premium Design */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardHeader className="relative text-center py-12 px-8">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20 dark:ring-slate-700/30 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {username || userEmail.split('@')[0]}
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium mb-2">Premium Member</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{userEmail}</p>
            
            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{favoritesCount}</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Saved Products</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {new Date().getFullYear()}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Member Since</div>
              </div>
            </div>
            
            {/* Premium Logout Button */}
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              size="lg"
              className="flex items-center gap-3 px-8 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('auth.logout')}</span>
            </Button>
          </CardHeader>
        </Card>

        {/* Favorites Section - Full Width */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500" />
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                        Your Favorites Collection
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">Discover your saved products</p>
                    </div>
                  </div>
                  <Badge className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm rounded-full shadow-lg">
                    {favoritesCount} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-6 opacity-30 text-red-500" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-sm max-w-sm mx-auto">
                      Start exploring and add items to your favorites to see them here!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {favoriteProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="group relative bg-card rounded-xl border border-border/50 p-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Remove from Favorites Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 rounded-full"
                          onClick={() => removeFromFavorites(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        {/* Product Image */}
                        <Link to={`/product/${product.id}`} className="relative block">
                          <div className="relative overflow-hidden rounded-lg mb-4">
                            <img 
                              src={product.images[0]} 
                              alt={product.title} 
                              className="w-full h-40 sm:h-48 object-cover transition-all duration-300 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="relative space-y-3">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primary cursor-pointer transition-colors duration-200">
                              {product.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                              {formatPrice(product.price, product.currency)}
                            </span>
                            <Badge 
                              variant={product.condition === 'new' ? 'default' : 'secondary'} 
                              className="text-xs font-medium"
                            >
                              {product.condition === 'new' ? 'New' : 'Used'}
                            </Badge>
                          </div>

                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{product.location.city}</span>
                          </div>

                          <div className="pt-2">
                            <Link to={`/product/${product.id}`} className="block">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-[1.02]"
                              >
                                <ExternalLink className="w-3 h-3 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
      </div>
    </div>;
};
export default Profile;