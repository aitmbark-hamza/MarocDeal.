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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header - Enhanced with gradient and animations */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-r from-primary/10 via-background to-primary/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
          <CardHeader className="relative text-center py-6 sm:py-8">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary via-primary-hover to-primary/80 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-hover rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-300" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-2">
              {username || userEmail.split('@')[0]}
            </CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">{userEmail}</p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="text-xl sm:text-2xl font-bold text-primary">{favoritesCount}</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="text-xl sm:text-2xl font-bold text-primary">{activities.length}</div>
                <div className="text-xs text-muted-foreground">Activities</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-muted-foreground">Joined</div>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </Button>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Activities */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Add New Activity */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="w-5 h-5 text-primary" />
                  Add Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addActivity} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="activity" className="text-sm font-medium">
                      What's happening?
                    </Label>
                    <Input
                      id="activity"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Share your activity..."
                      className="resize-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transform hover:scale-[1.02] transition-all duration-200"
                    disabled={!newActivity.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Activities List */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activities
                  <Badge variant="secondary" className="ml-auto">
                    {activities.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No activities yet. Add your first activity!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="group flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/20"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground break-words">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(activity.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Favorites */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Heart className="w-6 h-6 text-red-500" />
                  Your Favorites
                  <Badge variant="secondary" className="ml-auto text-sm">
                    {favoritesCount} items
                  </Badge>
                </CardTitle>
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
        </div>
      </div>
    </div>;
};
export default Profile;