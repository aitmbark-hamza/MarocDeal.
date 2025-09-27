import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShoppingBag, Heart, Zap, Shield, Users, Star } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">MarocDeals</h2>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('footer.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.contact')}
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:hamzahamzahh12345678@gmail.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">hamzahamzahh12345678@gmail.com</span>
              </a>
              <a 
                href="tel:+212624782877"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+212 624782877</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/7_amzaa_hz/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/mester.hamza.549"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Mr178898Mr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('footer.about')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>in Morocco</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;