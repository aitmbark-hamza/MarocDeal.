import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, ShoppingCart, Zap, Target } from 'lucide-react';
// import heroSlide1 from '../../assets/hero-slide-1.jpg';
export default function HeroCarousel() {
  const {
    t
  } = useTranslation();
  return <div className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75 dark:from-background/90 dark:via-background/80 dark:to-background/60" />
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <Badge variant="secondary" className="mb-6 animate-slide-in-left inline-flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                {t('home.hero.badge')}
              </Badge>
              
              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-in-left animation-delay-200">
                {t('home.hero.title')}
                <span className="text-primary block mt-2 animate-slide-in-left animation-delay-400">{t('home.hero.titleHighlight')}</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed animate-slide-in-left animation-delay-600 max-w-2xl">
                {t('home.hero.subtitle')}
              </p>
              
              {/* Platform Icons */}
              <div className="flex justify-center lg:justify-start items-center gap-4 mb-8 animate-slide-in-left animation-delay-800">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-primary" />
                  <span>{t('home.hero.stats.products')}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>{t('home.hero.stats.realtime')}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <span>{t('home.hero.stats.deals')}</span>
                </div>
              </div>
              
            </div>

            {/* Right Side - 3D Floating Elements */}
            <div className="hidden lg:flex justify-center items-center relative animate-slide-in-right animation-delay-300">
              <div className="relative w-80 h-80">
                {/* Main 3D Comparison Icon */}
                <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
                
                {/* Floating Cards */}
                <div className="absolute top-8 left-8 bg-card border border-border rounded-lg p-4 shadow-card animate-float-1 animate-slide-in-right animation-delay-500 transform hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-12 bg-gradient-primary rounded opacity-80 flex items-center justify-center">
                    <img src="/avito.png" alt="Avito" className="w-12 h-8 object-contain" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Avito</div>
                  <div className="text-sm font-semibold text-primary">299 MAD</div>
                </div>
                
                <div className="absolute top-16 right-12 bg-card border border-border rounded-lg p-4 shadow-card animate-float-2 animate-slide-in-right animation-delay-700 transform hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-12 bg-gradient-card rounded opacity-80 flex items-center justify-center">
                    <img src="/Jumia.png" alt="Jumia" className="w-12 h-8 object-contain" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Jumia</div>
                  <div className="text-sm font-semibold text-success">279 MAD</div>
                </div>
                
                <div className="absolute bottom-12 left-12 bg-card border border-border rounded-lg p-4 shadow-card animate-float-3 animate-slide-in-right animation-delay-900 transform hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-12 bg-gradient-hero rounded opacity-80 flex items-center justify-center">
                    <img src="/marjane.png" alt="Marjane" className="w-12 h-8 object-contain" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Marjane</div>
                  <div className="text-sm font-semibold text-warning">289 MAD</div>
                </div>

                {/* Central Comparison Symbol */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-featured animate-bounce-slow animate-scale-in animation-delay-1100">
                  <Search className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full rotate-45 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full -rotate-45 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 -translate-y-full rotate-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        
      </div>
    </div>;
}