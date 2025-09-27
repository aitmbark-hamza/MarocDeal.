import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/ProductCard';
import { TrendingUp, LogIn, Search } from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import HeroCarousel from '@/components/common/HeroCarousel';

// Counter Component مع format K/M
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const duration = 2000; // مدة الأنيميشن 2 ثواني
    const stepTime = Math.max(Math.floor(duration / end), 1);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M+";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K+";
    return num + "+";
  };

  return <div className="text-3xl font-bold text-primary mb-2">{formatNumber(count)}</div>;
}

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const featuredProducts = mockProducts.slice(0, 8);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setCurrentUserName(user.username || user.email || 'User');
    }
  }, []);

  const handleRequireAuth = (action: 'login' | 'register') => {
    if (action === 'login') navigate('/login');
    else navigate('/signup');
  };

  const handleSubmitReview = (review: any) => {
    console.log('Review submitted:', review);
    toast({
      title: t('reviews.reviewSubmitted'),
      description: t('reviews.reviewThankYou'),
    });
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{t('home.featuredProducts')}</h2>
              <div className="flex items-center text-muted-foreground">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Best deals this week</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/search">{t('home.viewAll')}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} featured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section مع Counter */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Counter target={76} />
              <div className="text-muted-foreground">Products</div>
            </div>
            <div>
              <Counter target={50} />
              <div className="text-muted-foreground">Retailers</div>
            </div>
            <div>
              <Counter target={250} />
              <div className="text-muted-foreground">Price Comparisons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Price Monitoring</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
