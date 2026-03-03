import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const languages: { code: Language; label: string }[] = [
  { code: 'pt', label: '🇧🇷 PT' },
  { code: 'en', label: '🇺🇸 EN' },
  { code: 'es', label: '🇪🇸 ES' },
];

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.destinations'), href: '#destinations' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group" onClick={() => scrollTo('#hero')}>
            <Plane className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold gradient-text">Decolando</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLangOpen(!langOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 glass-panel rounded-lg p-1 min-w-[80px]"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded transition-colors ${
                          language === lang.code ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* CTA */}
            <Button onClick={() => scrollTo('#cta')} className="hidden sm:inline-flex gradient-btn rounded-full px-5 h-9 text-sm border-0">
              {t('hero.cta')}
            </Button>

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-panel border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
