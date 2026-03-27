import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  serviceName: string;
  serviceSlug: string;
}

export const ServiceCTA = ({ serviceName, serviceSlug }: Props) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-btn p-8 sm:p-12 lg:p-16 text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Precisa de {serviceName}?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Receba uma cotação gratuita e personalizada. Nossa equipe está pronta para ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-8 gap-2 text-base font-semibold"
              onClick={() => navigate(`/cotacao?service=${serviceSlug}`)}
            >
              <ArrowRight className="h-5 w-5" /> Solicitar Cotação Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 gap-2 text-base bg-transparent border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <a
                href={`https://wa.me/5500000000000?text=${encodeURIComponent(`Olá! Preciso de ${serviceName} para minha viagem.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" /> Falar pelo WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
