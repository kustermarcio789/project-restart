import { Plane, Mail, Phone, MapPin, Shield, Globe, Clock, Lock, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="border-t border-border relative bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>Decolando</span>
                <span className="block text-[9px] font-medium text-muted-foreground tracking-wider uppercase">em Viagens</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t('footer.description')}</p>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Shield, label: 'SSL 256-bit' },
                { icon: Lock, label: 'LGPD' },
                { icon: Clock, label: '24/7' },
                { icon: CreditCard, label: 'Pag. Seguro' },
              ].map((badge, i) => (
                <div key={i} className="trust-badge">
                  <badge.icon className="h-3 w-3 text-primary" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-foreground">{t('footer.links')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#hero" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('nav.home')}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('nav.services')}</a></li>
              <li><a href="#destinations" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('nav.destinations')}</a></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-200">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-foreground">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">{t('footer.terms')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Política de Cookies</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Política de Reembolso</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wide uppercase text-foreground">{t('footer.contact')}</h4>
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

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Decolando em Viagens. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> CNPJ: 00.000.000/0001-00</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
