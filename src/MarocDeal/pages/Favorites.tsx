import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Trash2, ShoppingCart } from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/contexts/FavoritesContext';

const Favorites = () => {
  const { t } = useTranslation();
  const { favorites: favoriteIds, toggleFavorite, favoritesCount } = useFavorites();
  
  // Get the actual product objects from the favorite IDs
  const favorites = mockProducts.filter(product => favoriteIds.includes(product.id));

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const removeFromFavorites = (productId: string) => {
    toggleFavorite(productId);
  };

  const getConditionColor = (condition: string) => {
    return condition === 'new' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground';
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {t('favorites.title')}
          </h1>
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              {t('favorites.empty')}
            </p>
            <Button asChild>
              <Link to="/search">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('favorites.startShopping')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {t('favorites.title')}
          </h1>
          <Badge variant="secondary" className="text-sm">
            {t('favorites.count', { count: favoritesCount })}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-hover">
              <div className="relative">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                    -{product.discount}%
                  </Badge>
                )}

                {/* Remove from Favorites Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeFromFavorites(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                {/* Source Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute bottom-2 left-2 text-xs"
                >
                  {product.source}
                </Badge>
              </div>

              <CardContent className="p-4">
                {/* Title */}
                <Link 
                  to={`/product/${product.id}`}
                  className="block mb-2 hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                {/* Brand */}
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand}
                </p>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Condition and Location */}
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getConditionColor(product.condition)}>
                    {t(`product.${product.condition}`)}
                  </Badge>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {t(`cities.${product.location.city}`)}
                  </div>
                </div>

                {/* Actions */}
                <Button 
                  className="w-full" 
                  size="sm"
                  asChild
                >
                  <Link to={`/product/${product.id}`}>
                    {t('product.comparePrice')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;