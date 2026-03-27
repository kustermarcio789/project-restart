import { motion } from 'framer-motion';
import { Shield, Award, Headphones, CreditCard, Globe, Lock } from 'lucide-react';

const trustItems = [
  { icon: Shield, label: 'Compra Protegida', desc: 'Seus dados criptografados' },
  { icon: Award, label: 'Certificação IATA', desc: 'Agência verificada' },
  { icon: Headphones, label: 'Suporte 24/7', desc: 'Atendimento humanizado' },
  { icon: CreditCard, label: 'Parcelamento', desc: 'Até 12x sem juros' },
  { icon: Lock, label: 'LGPD Compliant', desc: 'Dados protegidos' },
  { icon: Globe, label: '150+ Destinos', desc: 'Cobertura global' },
];

export const TrustBar = () => {
  return (
    <section className="py-10 sm:py-14 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
