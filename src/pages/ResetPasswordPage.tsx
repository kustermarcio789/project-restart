import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasRecovery, setHasRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setHasRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: 'Erro ao redefinir senha', description: error.message, variant: 'destructive' });
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/minha-conta'), 2000);
    }
    setLoading(false);
  };

  if (!hasRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground">Link inválido ou expirado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 border border-border bg-card">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Senha redefinida!</h1>
              <p className="text-muted-foreground text-sm">Redirecionando...</p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground mb-1">Nova senha</h1>
              <p className="text-sm text-muted-foreground mb-6">Defina sua nova senha abaixo.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="pl-10 bg-muted/50 border-border" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm">Confirmar senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} className="pl-10 bg-muted/50 border-border" />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-btn border-0" disabled={loading}>
                  {loading ? 'Salvando...' : 'Redefinir senha'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
