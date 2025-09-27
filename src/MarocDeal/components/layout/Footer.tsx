import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:contact@electrocompare.ma"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:text-primary" />
                <span>hamzahamzahh12345678@gmail.com</span>
              </a>
              <a 
                href="tel:+212522123456"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:text-primary" />
                <span>+212 624782877</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/7_amzaa_hz/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/mester.hamza.549"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Mr178898Mr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
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
            <p className="text-sm text-muted-foreground">
              {t('footer.privacy')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;