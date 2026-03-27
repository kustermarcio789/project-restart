import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StickyWhatsAppProps {
  message?: string;
  phone?: string;
}

export const StickyWhatsApp = ({
  message = 'Olá! Quero saber mais sobre os serviços de viagem.',
  phone = '5500000000000',
}: StickyWhatsAppProps) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition-colors"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
};
