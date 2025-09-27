import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/common/ProductCard';
import { mockProducts, categories } from '@/data/mockData';
const Categories = () => {
  const {
    t
  } = useTranslation();
  const {
    categoryId
  } = useParams();

  // If categoryId is provided, filter products by that category
  const filteredProducts = categoryId ? mockProducts.filter(product => product.category === categoryId) : mockProducts;
  const categoryTitle = categoryId ? t(`categories.${categoryId}`) : t('nav.categories');
  return <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {categoryTitle}
          </h1>
          
          {!categoryId && <p className="text-muted-foreground">
              Browse electronics by category
            </p>}
        </div>

        {/* All Categories Grid (if no specific category selected) */}
        {!categoryId && <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">All Categories</h2>
            
          </div>}

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {categoryId ? 'Products' : 'All Products'} ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div> : <Card>
              <CardHeader>
                <CardTitle>No Products Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No products found in this category. Try browsing other categories.
                </p>
              </CardContent>
            </Card>}
        </div>
      </div>
    </div>;
};
export default Categories;