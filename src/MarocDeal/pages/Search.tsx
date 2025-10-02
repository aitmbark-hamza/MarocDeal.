import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/common/ProductCard';
import { Filter, Search as SearchIcon } from 'lucide-react';
import { mockProducts, categories, cities } from '@/data/mockData';

const Search = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = mockProducts.filter(product => {
    const matchesQuery = !filters.query || 
      product.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      product.brand.toLowerCase().includes(filters.query.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesCategory = !filters.category || filters.category === '' || product.category === filters.category;
    const matchesCity = !filters.city || filters.city === '' || product.location.city === filters.city;
    
    const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);

    return matchesQuery && matchesCategory && matchesCity && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div id="search-main-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('search.results')}
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input
                variant="search"
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12"
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('search.filters')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('search.filters')}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t('search.clearFilters')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('search.category')}
                  </label>
                  <Select 
                    value={filters.category === '' ? 'all' : filters.category} 
                    onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {t(`categories.${category.id}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

               
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder={t('search.minPrice')}
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder={t('search.maxPrice')}
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('search.sortBy')}
                  </label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('search.sortNewest')}</SelectItem>
                      <SelectItem value="priceLow">{t('search.sortPriceLow')}</SelectItem>
                      <SelectItem value="priceHigh">{t('search.sortPriceHigh')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
                {filters.query && ` for "${filters.query}"`}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{t('search.noResults')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse our categories.
                  </p>
                  <Button onClick={clearFilters}>
                    {t('search.clearFilters')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;