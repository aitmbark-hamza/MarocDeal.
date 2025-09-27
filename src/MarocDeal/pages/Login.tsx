import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, Globe, Eye, EyeOff, Sparkles, ShoppingBag } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  // RTL support
  const isRTL = i18n.language === 'ar';
  
  useEffect(() => {
    // Set document direction for RTL support
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: t('common.error'),
        description: t('auth.fillAllFields'),
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Store token & email like before
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Only set username if it doesn't exist (preserve signup username)
        const existingUsername = localStorage.getItem('username');
        if (!existingUsername) {
          localStorage.setItem('username', data.username || formData.email.split('@')[0]);
        }

        toast({
          title: t('auth.loginSuccess'),
          description: t('auth.welcomeBack'),
        });

        navigate('/profile'); // redirect after login
      } else {
        toast({
          title: t('common.error'),
          description: data.message || 'Login failed',
          variant: 'destructive'
        });
      }

    } catch (err) {
      toast({
        title: t('common.error'),
        description: 'Server error',
        variant: 'destructive'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center px-4 py-8 ${isRTL ? 'font-arabic' : ''}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding & Info */}
        <div className={`hidden lg:block space-y-8 ${isRTL ? 'lg:order-2' : ''}`}>
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  MarocDeals
                </h1>
                <p className="text-sm text-muted-foreground">{t('home.subtitle')}</p>
              </div>
            </div>

            {/* Welcome message */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {t('auth.welcomeBack')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('auth.loginDescription')}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('home.secure.title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('home.secure.description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('home.multilang.title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('home.multilang.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className={`w-full max-w-md mx-auto ${isRTL ? 'lg:order-1' : ''}`}>
          {/* Language Switcher */}
         

          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              {/* Mobile logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-xl">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                {t('auth.login')}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {t('auth.loginDescription')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('auth.email')}
                  </Label>
                  <div className="relative group">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleChange}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200 border-border/50 hover:border-border`}
                      required
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('auth.password')}
                  </Label>
                  <div className="relative group">
                    <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={formData.password}
                      onChange={handleChange}
                      className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} h-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200 border-border/50 hover:border-border`}
                      required
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('common.loading')}</span>
                    </div>
                  ) : (
                    t('auth.login')
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <p className="text-sm text-muted-foreground text-center">
                {t('auth.noAccount')}{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                >
                  {t('auth.createOne')}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
