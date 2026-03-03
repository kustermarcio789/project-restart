import { Plane, Mail, Phone, MapPin, Shield, Globe, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="border-t border-border relative">
      <div className="horizon-line absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>Decolando</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t('footer.description')}</p>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: 'SSL 256-bit' },
                { icon: Globe, label: 'LGPD' },
                { icon: Clock, label: '24/7' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 glass-panel rounded-full px-3 py-1.5">
                  <badge.icon className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-muted-foreground">{t('footer.links')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#hero" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t('nav.home')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t('nav.services')}</a></li>
              <li><a href="#destinations" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t('nav.destinations')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-muted-foreground">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-muted-foreground">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                </div>
                contato@decolando.com
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                +55 (11) 9999-9999
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} Decolando em Viagens. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};
