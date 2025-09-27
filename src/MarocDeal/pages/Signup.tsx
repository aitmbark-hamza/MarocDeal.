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
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ShoppingBag, UserPlus, Globe, Shield, CheckCircle, ArrowLeft, Send } from 'lucide-react';

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupForm>({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'signup' | 'verification' | 'success'>('signup');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
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

  const sendVerificationCode = async () => {
    setIsSendingCode(true);
    try {
      // Simulate sending verification code
      const res = await fetch("http://localhost:5000/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      if (res.ok) {
        toast({
          title: t('auth.verificationSent'),
          description: t('auth.checkEmail'),
        });
        setCurrentStep('verification');
      } else {
        toast({
          title: t('common.error'),
          description: t('auth.verificationFailed'),
          variant: 'destructive'
        });
      }
    } catch (err) {
      // For demo purposes, always succeed
      toast({
        title: t('auth.verificationSent'),
        description: t('auth.checkEmail'),
      });
      setCurrentStep('verification');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: t('common.error'),
        description: t('auth.invalidCode'),
        variant: 'destructive'
      });
      setIsVerifying(false);
      return;
    }

    try {
      // Simulate code verification
      const res = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          code: verificationCode 
        })
      });

      if (res.ok || verificationCode === '123456') { // Demo: accept 123456
        toast({
          title: t('auth.verificationSuccess'),
          description: t('auth.identityVerified'),
        });
        setCurrentStep('success');
        // Proceed with account creation
        await createAccount();
      } else {
        toast({
          title: t('common.error'),
          description: t('auth.wrongCode'),
          variant: 'destructive'
        });
      }
    } catch (err) {
      // For demo, accept 123456
      if (verificationCode === '123456') {
        toast({
          title: t('auth.verificationSuccess'),
          description: t('auth.identityVerified'),
        });
        setCurrentStep('success');
        await createAccount();
      } else {
        toast({
          title: t('common.error'),
          description: t('auth.wrongCode'),
          variant: 'destructive'
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const createAccount = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username,
          email: formData.email, 
          password: formData.password,
          verified: true
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Store authentication data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('username', formData.username);
        
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.accountCreated'),
        });
        
        // Navigate to profile after a short delay
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      // For demo purposes, always succeed
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('username', formData.username);
      
      toast({
        title: t('auth.signupSuccess'),
        description: t('auth.accountCreated'),
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: t('common.error'),
        description: t('auth.fillAllFields'),
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    // Send verification code instead of creating account directly
    await sendVerificationCode();
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center px-4 py-8 ${isRTL ? 'font-arabic' : ''}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
                {t('auth.createAccount')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('auth.signupDescription')}
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

        {/* Right side - Signup Form */}
        <div className={`w-full max-w-md mx-auto ${isRTL ? 'lg:order-1' : ''}`}>
          {/* Language Switcher */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm">
              {[
                { code: 'ar', name: 'العربية', flag: '🇲🇦' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
                { code: 'en', name: 'English', flag: '🇺🇸' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                    i18n.language === lang.code
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              {/* Mobile logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-xl">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                {t('auth.createAccount')}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {t('auth.signupDescription')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Signup Form */}
              {currentStep === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      {t('auth.username')}
                    </Label>
                    <div className="relative group">
                      <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors`} />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={t('auth.usernamePlaceholder')}
                        value={formData.username}
                        onChange={handleChange}
                        className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200 border-border/50 hover:border-border`}
                        required
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>

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
                    disabled={isLoading || isSendingCode}
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading || isSendingCode ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t('auth.sendingVerification')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t('auth.sendVerification')}
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: Verification */}
              {currentStep === 'verification' && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t('auth.verifyIdentity')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('auth.verificationCodeSent')} <strong>{formData.email}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('auth.demoCode')}: <code className="bg-muted px-2 py-1 rounded">123456</code>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={verifyCode} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode" className="text-sm font-medium">
                        {t('auth.verificationCode')}
                      </Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-12 text-center text-lg tracking-widest focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('signup')}
                        className="flex-1 h-12"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isVerifying}
                        className="flex-1 h-12 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium"
                      >
                        {isVerifying ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t('auth.verifying')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t('auth.verify')}
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={sendVerificationCode}
                      disabled={isSendingCode}
                      className="text-sm text-primary hover:text-primary-hover underline"
                    >
                      {isSendingCode ? t('common.loading') : t('auth.resendCode')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {currentStep === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">{t('auth.verificationSuccess')}</h3>
                    <p className="text-muted-foreground mb-4">{t('auth.accountCreated')}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span>{t('auth.redirecting')}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <p className="text-sm text-muted-foreground text-center">
                {t('auth.haveAccount')}{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                >
                  {t('auth.login')}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
