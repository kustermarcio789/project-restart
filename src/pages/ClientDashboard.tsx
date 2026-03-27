import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  User, FileText, MapPin, LogOut, Plane,
  CheckCircle2, Circle, Clock, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/shared/SEOHead';

const stageLabels: Record<string, string> = {
  draft: 'Rascunho',
  sent: 'Enviada',
  accepted: 'Aceita',
  rejected: 'Rejeitada',
  expired: 'Expirada',
};

const stageBadgeVariant = (status: string) => {
  if (status === 'accepted') return 'default';
  if (status === 'sent') return 'secondary';
  return 'outline';
};

const ClientDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportCountry, setPassportCountry] = useState('');

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [profileRes, quotesRes, docsRes, milestonesRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('quotes').select('*, quote_items(*)').order('created_at', { ascending: false }),
      supabase.from('user_documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('journey_milestones').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setFullName(profileRes.data.full_name || '');
      setPhone(profileRes.data.phone || '');
      setNationality(profileRes.data.nationality || '');
      setPassportCountry(profileRes.data.passport_country || '');
    }
    if (quotesRes.data) setQuotes(quotesRes.data);
    if (docsRes.data) setDocuments(docsRes.data);
    if (milestonesRes.data) setMilestones(milestonesRes.data);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('user_profiles').update({
      full_name: fullName,
      phone,
      nationality,
      passport_country: passportCountry,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Perfil atualizado!' });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/entrar" replace />;

  return (
    <>
      <SEOHead title="Minha Conta | Vamos de Volta" description="Gerencie sua viagem, documentos e cotações." />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Minha Conta</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Olá, {fullName || user.email?.split('@')[0]}!
            </h1>
            <p className="text-muted-foreground mb-8">Gerencie sua viagem e acompanhe tudo em um só lugar.</p>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Perfil</TabsTrigger>
                <TabsTrigger value="quotes" className="gap-2"><FileText className="h-4 w-4" /> Cotações</TabsTrigger>
                <TabsTrigger value="journey" className="gap-2"><MapPin className="h-4 w-4" /> Jornada</TabsTrigger>
                <TabsTrigger value="docs" className="gap-2"><FileText className="h-4 w-4" /> Docs</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome completo</Label>
                        <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                      </div>
                      <div>
                        <Label>E-mail</Label>
                        <Input value={user.email || ''} disabled className="mt-1 bg-muted/30 border-border" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Telefone</Label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                      </div>
                      <div>
                        <Label>Nacionalidade</Label>
                        <Input value={nationality} onChange={e => setNationality(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                      </div>
                    </div>
                    <div>
                      <Label>País do passaporte</Label>
                      <Input value={passportCountry} onChange={e => setPassportCountry(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving} className="gradient-btn border-0">
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes">
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas cotações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quotes.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhuma cotação encontrada.</p>
                        <p className="text-sm mt-1">Solicite uma cotação para começar!</p>
                        <Button asChild className="mt-4 gradient-btn border-0">
                          <Link to="/cotacao">Solicitar cotação</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quotes.map((q: any) => (
                          <div key={q.id} className="border border-border rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                Cotação #{q.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(q.created_at).toLocaleDateString('pt-BR')} · {q.currency} {Number(q.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <Badge variant={stageBadgeVariant(q.status)}>
                              {stageLabels[q.status] || q.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Journey Tab */}
              <TabsContent value="journey">
                <Card>
                  <CardHeader>
                    <CardTitle>Jornada do viajante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {milestones.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Sua jornada aparecerá aqui quando iniciar o planejamento.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {milestones.map((m: any) => (
                          <div key={m.id} className="flex items-start gap-3">
                            {m.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            )}
                            <div>
                              <p className={`font-medium ${m.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {m.title}
                              </p>
                              {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                              {m.completed_at && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(m.completed_at).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="docs">
                <Card>
                  <CardHeader>
                    <CardTitle>Central de documentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Seus documentos e checklists aparecerão aqui.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((d: any) => (
                          <div key={d.id} className="border border-border rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{d.document_name}</p>
                              <p className="text-sm text-muted-foreground">{d.document_type}</p>
                            </div>
                            <Badge variant={d.status === 'completed' ? 'default' : 'outline'}>
                              {d.status === 'completed' ? 'Concluído' : d.status === 'pending' ? 'Pendente' : d.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ClientDashboard;
