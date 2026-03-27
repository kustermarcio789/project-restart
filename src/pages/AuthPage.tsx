import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plane, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/minha-conta" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Erro ao entrar',
          description: error.message.includes('Invalid login')
            ? 'E-mail ou senha incorretos.'
            : error.message.includes('Email not confirmed')
            ? 'Confirme seu e-mail antes de fazer login.'
            : error.message,
          variant: 'destructive',
        });
      } else {
        navigate('/minha-conta');
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: 'Erro ao cadastrar',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setEmailSent(true);
      }
    }
    setSubmitting(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Verifique seu e-mail</h1>
          <p className="text-muted-foreground mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. 
            Clique no link para ativar sua conta.
          </p>
          <Button variant="outline" onClick={() => { setEmailSent(false); setIsLogin(true); }}>
            Voltar para login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>

        <div className="glass-panel rounded-2xl p-8 border border-border bg-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isLogin ? 'Entrar na conta' : 'Criar conta'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Acesse sua área do viajante' : 'Comece sua jornada conosco'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Nome completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 border-border"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-muted/50 border-border"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                {isLogin && (
                  <Link to="/esqueci-senha" className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-muted/50 border-border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-btn border-0" disabled={submitting}>
              {submitting ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <span className="text-primary font-medium">
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
