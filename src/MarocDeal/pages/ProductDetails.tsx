import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Share2, MapPin, Eye, ExternalLink, ArrowLeft, ShoppingCart } from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { useFavorites } from '@/contexts/FavoritesContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'limited':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-destructive text-destructive-foreground';
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/search">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square rounded overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleFavorite(product.id)}
                    className={isFavorite(product.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-4">
                {product.brand} • {product.model}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                  {product.discount && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className={getConditionColor(product.condition)}>
                  {t(`product.${product.condition}`)}
                </Badge>
                <Badge className={getAvailabilityColor(product.availability)}>
                  {t(`product.${product.availability}`)}
                </Badge>
                <Badge variant="outline">
                  {product.source}
                </Badge>
              </div>

              {/* Location and Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t(`cities.${product.location.city}`)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Eye className="w-4 h-4 mr-2" />
                  {product.views} views
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" variant="hero" asChild>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('product.viewOnSite', { site: product.source })}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('product.viewOnSite', { site: product.source })}
                  </a>
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Compare Prices
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">{t('product.description')}</TabsTrigger>
            <TabsTrigger value="specifications">{t('product.specifications')}</TabsTrigger>
            <TabsTrigger value="price-history">{t('product.priceHistory')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('product.description')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
                
                {/* Seller Info */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">{t('product.seller')}</h4>
                  <div className="flex items-center justify-between">
                    <span>{product.seller.name}</span>
                    {product.seller.rating && (
                      <Badge variant="secondary">
                        ⭐ {product.seller.rating}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('product.specifications')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-muted rounded">
                      <span className="font-medium capitalize">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
                
                {product.warranty && (
                  <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-medium">Warranty:</span>
                      <span className="ml-2">{product.warranty}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="price-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('product.priceHistory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={product.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value} MAD`}
                      />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value) => [`${value} MAD`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;