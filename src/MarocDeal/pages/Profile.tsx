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
  return <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {username || userEmail.split('@')[0]}
            </CardTitle>
            <p className="text-muted-foreground">{userEmail}</p>
            
            {/* Logout Button - positioned under email */}
            <div className="pt-4">
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                {t('auth.logout')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Add New Activity */}
        <Card>
          
          
        </Card>

        {/* Favorites Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Favorites
              <Badge variant="secondary" className="ml-2">
                {favoritesCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteProducts.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No favorite items yet. Start adding items to your favorites!</p>
              </div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteProducts.map(product => <div key={product.id} className="relative group bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200">
                    {/* Remove from Favorites Button */}
                    <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFromFavorites(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Product Image */}
                    <Link to={`/product/${product.id}`}>
                      <img src={product.images[0]} alt={product.title} className="w-full h-32 object-cover rounded-md mb-3 cursor-pointer hover:opacity-90 transition-opacity" />
                    </Link>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <Badge variant={product.condition === 'new' ? 'default' : 'secondary'} className="text-xs">
                          {product.condition === 'new' ? 'New' : 'Used'}
                        </Badge>
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.location.city}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          
          
        </Card>
      </div>
    </div>;
};
export default Profile;