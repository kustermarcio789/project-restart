import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, Sun, Moon, Globe, User, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

interface NavItem {
  label: string;
  href: string;
  type: 'anchor' | 'route';
}

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: t('nav.home'), href: '#hero', type: 'anchor' },
    { label: t('nav.services'), href: '#services', type: 'anchor' },
    { label: t('nav.destinations'), href: '#destinations', type: 'anchor' },
    { label: 'Guias', href: '/guias', type: 'route' },
    { label: 'Blog', href: '/blog', type: 'route' },
    { label: t('nav.contact'), href: '#contact', type: 'anchor' },
  ];

  const handleAnchorNavigation = (href: string) => {
    setMobileOpen(false);

    if (location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRouteNavigation = (href: string) => {
    setMobileOpen(false);
    navigate(href);
  };

  const renderNavItem = (item: NavItem, mobile = false) => {
    const className = mobile
      ? 'block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'
      : 'px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200';

    if (item.type === 'route') {
      return (
        <button key={item.href} onClick={() => handleRouteNavigation(item.href)} className={className}>
          {item.label}
        </button>
      );
    }

    return (
      <button key={item.href} onClick={() => handleAnchorNavigation(item.href)} className={className}>
        {item.label}
      </button>
    );
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-card/90 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                <span className="gradient-text">Decolando</span>
              </span>
              <span className="text-[9px] font-medium text-muted-foreground tracking-wider uppercase leading-none hidden sm:block">
                em Viagens
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => renderNavItem(item))}
          </nav>

          <div className="flex items-center gap-1">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangOpen(!langOpen)}
                className="text-muted-foreground hover:text-foreground h-9 px-2.5 gap-1"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 bg-card border border-border rounded-xl p-1 min-w-[110px] shadow-lg"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                          language === lang.code
                            ? 'text-primary bg-primary/10 font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground h-9 w-9 p-0"
            >
              <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-9 w-9 p-0">
              <Link to="/entrar">
                <User className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              onClick={() => navigate('/planejar')}
              className="hidden sm:inline-flex gradient-btn rounded-full px-6 h-9 text-xs font-semibold border-0 tracking-wide ml-1"
            >
              {t('hero.cta')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground h-9 w-9 p-0"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-card/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => renderNavItem(item, true))}
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/planejar');
                }}
                className="w-full gradient-btn rounded-full h-11 text-sm font-semibold border-0 mt-2"
              >
                {t('hero.cta')}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
