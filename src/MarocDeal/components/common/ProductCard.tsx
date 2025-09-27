import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Eye, ExternalLink } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    return condition === 'new' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground';
  };


  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-hover ${
      featured ? 'shadow-featured' : 'shadow-card'
    }`}>
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

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
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
          <h3 className={`font-semibold line-clamp-2 ${
            featured ? 'text-lg' : 'text-sm'
          }`}>
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
            <span className={`font-bold text-primary ${
              featured ? 'text-xl' : 'text-lg'
            }`}>
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
        <div className="space-y-2">
          <Button 
            className="w-full" 
            size="sm"
            variant={featured ? "hero" : "default"}
            asChild
          >
            <Link to={`/product/${product.id}`}>
              {t('View Details')}
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            asChild
          >
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('product.viewOnSite', { site: product.source })}
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              {t('product.viewOnSite', { site: product.source })}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;