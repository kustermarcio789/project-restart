import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="border-t border-border py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">Decolando</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('footer.description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#hero" className="hover:text-foreground transition-colors">{t('nav.home')}</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">{t('nav.services')}</a></li>
              <li><a href="#destinations" className="hover:text-foreground transition-colors">{t('nav.destinations')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contato@decolando.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +55 (11) 9999-9999</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> São Paulo, Brasil</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Decolando em Viagens. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};
