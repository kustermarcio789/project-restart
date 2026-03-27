import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StickyCTAProps {
  text?: string;
  onClick?: () => void;
}

export const StickyCTA = ({ text = 'Solicitar Cotação Gratuita', onClick }: StickyCTAProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md p-3 md:hidden"
        >
          <Button
            onClick={onClick}
            className="w-full gradient-btn rounded-full gap-2 text-base font-semibold"
            size="lg"
          >
            {text} <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
