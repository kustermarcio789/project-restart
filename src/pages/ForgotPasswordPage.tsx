import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/entrar" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar para login
        </Link>
        <div className="glass-panel rounded-2xl p-8 border border-border bg-card">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">E-mail enviado</h1>
              <p className="text-muted-foreground text-sm">
                Se existe uma conta com <strong>{email}</strong>, você receberá um link para redefinir sua senha.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground mb-1">Esqueceu a senha?</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Informe seu e-mail e enviaremos um link para redefinir.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10 bg-muted/50 border-border" placeholder="seu@email.com" />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-btn border-0" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
