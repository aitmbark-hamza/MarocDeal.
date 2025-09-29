import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ui/theme-provider';
import { Search, Menu, X, Sun, Moon, Globe, Smartphone, ChevronDown, User, Heart, Home, MapPin } from 'lucide-react';
import { categories, mockProducts, type Product } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/contexts/FavoritesContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeProductIndex, setActiveProductIndex] = useState(-1);

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { favoritesCount } = useFavorites();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('userEmail') !== null;
      setIsAuthenticated(authStatus);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setFilteredProducts(filtered);
      setShowResults(filtered.length > 0);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
    setActiveProductIndex(-1);
  }, [searchQuery]);

  const focusableElements = useCallback(() => {
    if (!mobileMenuRef.current) return [];
    return Array.from(
      mobileMenuRef.current.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showResults) {
          setShowResults(false);
          setActiveProductIndex(-1);
        }
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showResults, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const elements = focusableElements();
      if (elements.length > 0) {
        (elements[0] as HTMLElement).focus();
        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            const firstElement = elements[0] as HTMLElement;
            const lastElement = elements[elements.length - 1] as HTMLElement;
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };
        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
      }
    }
  }, [isOpen, focusableElements]);

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.favorites'), href: '/favorites', icon: Heart }
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const selectedCategories = categories.slice(0, 5);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveProductIndex(prev => prev < filteredProducts.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveProductIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeProductIndex >= 0) handleProductClick(filteredProducts[activeProductIndex]);
        else if (searchQuery.trim()) handleSearchSubmit(e);
        break;
    }
  };

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105" aria-label="MarocDeals Home">
              <img 
                src="/logo.png" 
                alt="MarocDeals Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg shadow-card group-hover:shadow-hover transition-all duration-200" 
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden xs:inline">MarocDeals</span>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent xs:hidden">MarocDeals</span>
            </Link>
          </div>

          {/* Center Section - Search Bar & Categories */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-4 xl:mx-8">
            <div className="relative flex-1 max-w-lg">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 pointer-events-none" />
                  <Input
                    variant="search"
                    ref={searchInputRef}
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-12"
                    onFocus={() => { navigate('/search'); if (searchQuery) setShowResults(true); }}
                    onBlur={() => { setTimeout(() => setShowResults(false), 200); }}
                    aria-label="Search products"
                    aria-expanded={showResults}
                    aria-haspopup="listbox"
                    role="combobox"
                  />
                </div>
              </form>

              {/* Search Results */}
              {showResults && filteredProducts.length > 0 && (
                <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-hover z-50 max-h-80 overflow-y-auto" role="listbox" aria-label="Product search results">
                  {filteredProducts.map((product, index) => (
                    <button key={product.id} onClick={() => handleProductClick(product)} className={`w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors duration-150 border-b border-border last:border-b-0 ${index === activeProductIndex ? 'bg-accent text-accent-foreground' : ''}`} role="option" aria-selected={index === activeProductIndex}>
                      <div className="flex items-center space-x-3">
                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.title}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold text-primary">{product.price.toLocaleString()} {product.currency}</span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {product.location.city}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Product categories">
                  {t('nav.categories')} <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-popover border-border shadow-hover z-50 p-2" sideOffset={4}>
                {selectedCategories.map((category, index) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/categories/${category.id}`} className="flex items-center justify-center px-4 py-3 mb-2 last:mb-0 rounded-lg border border-transparent transition-all duration-300 ease-out hover:shadow-sm hover:-translate-y-0.5 text-center font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {t(`categories.${category.id}`)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-shrink-0">
            <div className="flex items-center space-x-1 mr-4">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button variant={location.pathname === item.href ? "default" : "ghost"} size="sm" className="flex items-center gap-2 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-current={location.pathname === item.href ? 'page' : undefined}>
                    {item.href === '/favorites' ? (
                      <div className="relative">
                        <item.icon className="w-4 h-4" />
                        {favoritesCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs min-w-4 rounded-full">{favoritesCount}</Badge>}
                      </div>
                    ) : <item.icon className="w-4 h-4" />}
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Select language">
                  <Globe className="w-4 h-4 mr-2" />
                  {languages.find(lang => lang.code === i18n.language)?.flag || '🌍'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-hover">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)} className="flex items-center space-x-2 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <span aria-hidden="true">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex items-center gap-2 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{t('auth.login')}</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="flex items-center gap-2 max-w-32 truncate" title={localStorage.getItem('username') || localStorage.getItem('userEmail') || ''} onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline truncate">{localStorage.getItem('username') || localStorage.getItem('userEmail')}</span>
              </Button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="sm" onClick={() => navigate('/search')} className="p-2 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Search">
              <Search className="w-4 h-4" />
            </Button>

            {/* Mobile Favorites */}
            <Link to="/favorites">
              <Button variant="ghost" size="sm" className="relative p-2 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label={`Favorites ${favoritesCount > 0 ? `(${favoritesCount})` : ''}`}>
                <Heart className="w-4 h-4" />
                {favoritesCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs min-w-4 rounded-full">{favoritesCount}</Badge>}
              </Button>
            </Link>

            {/* Mobile User/Auth */}
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/profile')} aria-label="Profile">
                <User className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/login')} aria-label="Login">
                <User className="w-4 h-4" />
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu} 
              className="p-2 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2" 
              aria-label={isOpen ? 'Close menu' : 'Open menu'} 
              aria-expanded={isOpen} 
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Tablet Controls (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 flex-shrink-0">
            {/* Tablet Search */}
            <div className="relative flex-1 max-w-xs">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
                  <Input
                    variant="search"
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-10 h-9 text-sm"
                    onFocus={() => { navigate('/search'); if (searchQuery) setShowResults(true); }}
                    onBlur={() => { setTimeout(() => setShowResults(false), 200); }}
                    aria-label="Search products"
                  />
                </div>
              </form>
            </div>

            {/* Tablet Navigation */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button variant={location.pathname === item.href ? "default" : "ghost"} size="sm" className="flex items-center gap-1 p-2" aria-current={location.pathname === item.href ? 'page' : undefined}>
                    {item.href === '/favorites' ? (
                      <div className="relative">
                        <item.icon className="w-4 h-4" />
                        {favoritesCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center text-xs min-w-3 rounded-full">{favoritesCount}</Badge>}
                      </div>
                    ) : <item.icon className="w-4 h-4" />}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Tablet Controls */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2" aria-label="Select language">
                    <Globe className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-hover">
                  {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)} className="flex items-center space-x-2">
                      <span aria-hidden="true">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {!isAuthenticated ? (
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex items-center gap-1 p-2">
                  <User className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="flex items-center gap-1 p-2 max-w-24 truncate" title={localStorage.getItem('username') || localStorage.getItem('userEmail') || ''} onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 flex-shrink-0" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile slide-over menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div ref={mobileMenuRef} id="mobile-menu" className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-background border-l border-border shadow-featured z-50 lg:hidden animate-in slide-in-from-right duration-300" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">MarocDeals</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="p-2 transition-all duration-200" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                {/* Mobile Search */}
                <div className="mb-4">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
                      <Input
                        variant="search"
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        className="pl-10 h-10"
                        onFocus={() => { navigate('/search'); if (searchQuery) setShowResults(true); }}
                        onBlur={() => { setTimeout(() => setShowResults(false), 200); }}
                        aria-label="Search products"
                      />
                    </div>
                  </form>
                </div>

                {/* Categories */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-3">{t('nav.categories')}</h3>
                  <div className="space-y-1">
                    {selectedCategories.map((category) => (
                      <Link key={category.id} to={`/categories/${category.id}`} className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200" onClick={() => setIsOpen(false)}>
                        {t(`categories.${category.id}`)}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                {navigation.map((item) => (
                  <Link key={item.name} to={item.href} className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === item.href ? 'bg-primary text-primary-foreground shadow-card' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`} onClick={() => setIsOpen(false)} aria-current={location.pathname === item.href ? 'page' : undefined}>
                    {item.href === '/favorites' ? (
                      <div className="relative mr-3">
                        <item.icon className="w-5 h-5" />
                        {favoritesCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs min-w-4 rounded-full">{favoritesCount}</Badge>}
                      </div>
                    ) : <item.icon className="w-5 h-5 mr-3" />}
                    {item.name}
                  </Link>
                ))}

                {/* Auth Section */}
                {!isAuthenticated ? (
                  <Link to="/login" className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200" onClick={() => setIsOpen(false)}>
                    <User className="w-5 h-5 mr-3" />
                    {t('auth.login')}
                  </Link>
                ) : (
                  <Link to="/profile" className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200" onClick={() => setIsOpen(false)}>
                    <User className="w-5 h-5 mr-3" />
                    <span className="truncate">{localStorage.getItem('username') || localStorage.getItem('userEmail')}</span>
                  </Link>
                )}
              </div>

              {/* Footer */}
              <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-border space-y-3 sm:space-y-4">
                {/* Theme Toggle */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }} 
                  className="w-full flex justify-center gap-2 h-10"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="text-sm">{theme === 'light' ? t('nav.dark_mode') : t('nav.light_mode')}</span>
                </Button>

                {/* Language Selector */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground px-2">{t('nav.language')}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={i18n.language === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsOpen(false);
                        }}
                        className="w-full flex justify-start gap-2 h-10"
                      >
                        <span aria-hidden="true">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
