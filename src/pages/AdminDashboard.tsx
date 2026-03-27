import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, DollarSign, LogOut, Plane,
  TrendingUp, UserCheck, CreditCard, BarChart3, ChevronRight, Search,
  CheckCircle2, Clock, XCircle, MoreHorizontal, Plus, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Tab = 'dashboard' | 'leads' | 'providers' | 'bookings' | 'commissions';

interface DashboardStats {
  total_bookings: number;
  active_providers: number;
  total_revenue: number;
}

interface Booking {
  id: string;
  booking_code: string;
  traveler_name: string;
  traveler_email: string | null;
  destination: string;
  travel_date: string | null;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  provider_id: string | null;
}

interface Provider {
  id: string;
  name: string;
  service_type: string;
  status: 'active' | 'pending' | 'blocked';
  commission_rate: number;
  booking_count?: number;
  total_revenue?: number;
}

interface Commission {
  id: string;
  rate: number;
  amount: number;
  provider_name: string;
  service_type: string;
  booking_code: string;
}

const statusColors = {
  confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusIcons = {
  confirmed: CheckCircle2,
  pending: Clock,
  cancelled: XCircle,
  active: CheckCircle2,
  blocked: XCircle,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({ total_bookings: 0, active_providers: 0, total_revenue: 0 });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', service_type: '', commission_rate: '10' });
  const [newBooking, setNewBooking] = useState({ traveler_name: '', traveler_email: '', destination: '', travel_date: '', amount: '', provider_id: '' });

  useEffect(() => {
    const validateSession = async () => {
      const token = sessionStorage.getItem('admin_session_token');
      if (!token) { navigate('/admin'); return; }
      const { data, error } = await supabase.rpc('admin_validate_session', { p_session_token: token });
      const result = data as unknown as { valid: boolean } | null;
      if (error || !result?.valid) {
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_display_name');
        navigate('/admin');
        return;
      }
      fetchData();
    };
    validateSession();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use type casting for tables not yet in generated types
      const sbAny = supabase as any;

      // Fetch stats via RPC
      const { data: statsData } = await sbAny.rpc('get_dashboard_stats');
      if (statsData) setStats(statsData as DashboardStats);

      // Fetch bookings
      const { data: bookingsData } = await sbAny
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (bookingsData) setBookings(bookingsData as Booking[]);

      // Fetch providers
      const { data: providersData } = await sbAny
        .from('providers')
        .select('*')
        .order('created_at', { ascending: true });

      if (providersData) {
        const { data: providerStats } = await sbAny
          .from('bookings')
          .select('provider_id, amount, status');

        const providerMap = new Map<string, { count: number; revenue: number }>();
        if (providerStats) {
          for (const b of providerStats as any[]) {
            if (!b.provider_id) continue;
            const existing = providerMap.get(b.provider_id) || { count: 0, revenue: 0 };
            existing.count++;
            if (b.status === 'confirmed') existing.revenue += Number(b.amount);
            providerMap.set(b.provider_id, existing);
          }
        }

        setProviders((providersData as Provider[]).map(p => ({
          ...p,
          booking_count: providerMap.get(p.id)?.count || 0,
          total_revenue: providerMap.get(p.id)?.revenue || 0,
        })));
      }

      // Fetch commissions
      const { data: commissionsData } = await sbAny
        .from('commissions')
        .select('id, rate, amount, provider_id, booking_id')
        .order('created_at', { ascending: false });

      if (commissionsData && providersData && bookingsData) {
        const provMap = new Map((providersData as any[]).map((p: any) => [p.id, p]));
        const bookMap = new Map((bookingsData as any[]).map((b: any) => [b.id, b]));
        setCommissions((commissionsData as any[]).map((c: any) => ({
          id: c.id,
          rate: c.rate,
          amount: c.amount,
          provider_name: provMap.get(c.provider_id)?.name || 'N/A',
          service_type: provMap.get(c.provider_id)?.service_type || 'N/A',
          booking_code: bookMap.get(c.booking_id)?.booking_code || 'N/A',
        })));
      }
    } catch (err: any) {
      toast({ title: 'Erro ao carregar dados', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('admin_session_token');
    if (token) await supabase.rpc('admin_logout', { p_session_token: token });
    sessionStorage.removeItem('admin_session_token');
    sessionStorage.removeItem('admin_display_name');
    navigate('/admin');
  };

  const handleAddProvider = async () => {
    try {
      const sbAny = supabase as any;
      const { error } = await sbAny.from('providers').insert({
        name: newProvider.name,
        service_type: newProvider.service_type,
        commission_rate: parseFloat(newProvider.commission_rate),
        status: 'pending',
      });
      if (error) throw error;
      toast({ title: 'Prestador adicionado com sucesso!' });
      setShowProviderForm(false);
      setNewProvider({ name: '', service_type: '', commission_rate: '10' });
      fetchData();
    } catch (err: any) {
      toast({ title: 'Erro ao adicionar prestador', description: err.message, variant: 'destructive' });
    }
  };

  const handleAddBooking = async () => {
    try {
      const sbAny = supabase as any;
      const bookingCode = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
      const { error } = await sbAny.from('bookings').insert({
        booking_code: bookingCode,
        traveler_name: newBooking.traveler_name,
        traveler_email: newBooking.traveler_email || null,
        destination: newBooking.destination,
        travel_date: newBooking.travel_date || null,
        amount: parseFloat(newBooking.amount),
        provider_id: newBooking.provider_id || null,
        status: 'pending',
      });
      if (error) throw error;
      toast({ title: 'Reserva adicionada com sucesso!' });
      setShowBookingForm(false);
      setNewBooking({ traveler_name: '', traveler_email: '', destination: '', travel_date: '', amount: '', provider_id: '' });
      fetchData();
    } catch (err: any) {
      toast({ title: 'Erro ao adicionar reserva', description: err.message, variant: 'destructive' });
    }
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'providers' as const, label: 'Prestadores', icon: Users },
    { id: 'bookings' as const, label: 'Reservas', icon: Calendar },
    { id: 'commissions' as const, label: 'Comissões', icon: DollarSign },
  ];

  const commissionsByProvider = providers
    .filter(p => p.status !== 'pending')
    .map(p => {
      const provCommissions = commissions.filter(c => c.provider_name === p.name);
      return {
        provider: p.name,
        service: p.service_type,
        rate: p.commission_rate,
        totalBookings: p.booking_count || 0,
        totalCommission: provCommissions.reduce((sum, c) => sum + Number(c.amount), 0),
      };
    });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border glass-panel hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>Decolando</span>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border glass-panel">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-bold gradient-text text-sm">Admin</span>
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <Button key={t.id} variant={tab === t.id ? 'default' : 'ghost'} size="sm" onClick={() => setTab(t.id)} className={tab === t.id ? 'gradient-btn border-0' : ''}>
                <t.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Dashboard Tab */}
          {!loading && tab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Dashboard</h1>
                <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Reservas', value: stats.total_bookings.toLocaleString(), icon: Calendar, color: 'text-primary' },
                  { label: 'Prestadores Ativos', value: stats.active_providers.toString(), icon: UserCheck, color: 'text-emerald-500' },
                  { label: 'Receita Total', value: `R$ ${Number(stats.total_revenue).toLocaleString()}`, icon: CreditCard, color: 'text-accent' },
                  { label: 'Comissões', value: `R$ ${commissionsByProvider.reduce((s, c) => s + c.totalCommission, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
                ].map((metric, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card glow-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</span>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    <div className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{metric.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card glow-border overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>Reservas Recentes</h3>
                  <Button variant="ghost" size="sm" onClick={() => setTab('bookings')} className="text-primary text-xs gap-1">
                    Ver todas <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Viajante</th>
                        <th className="text-left p-4">Destino</th>
                        <th className="text-left p-4">Valor</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => {
                        const StatusIcon = statusIcons[b.status];
                        return (
                          <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-mono text-xs text-muted-foreground">{b.booking_code}</td>
                            <td className="p-4 font-medium">{b.traveler_name}</td>
                            <td className="p-4 text-muted-foreground">{b.destination}</td>
                            <td className="p-4 font-medium text-accent">R$ {Number(b.amount).toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[b.status]}`}>
                                <StatusIcon className="h-3 w-3" />
                                {b.status === 'confirmed' ? 'Confirmado' : b.status === 'pending' ? 'Pendente' : 'Cancelado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Providers Tab */}
          {!loading && tab === 'providers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Prestadores</h1>
                  <p className="text-sm text-muted-foreground">Gerencie prestadores de serviço</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
                  </div>
                  <Dialog open={showProviderForm} onOpenChange={setShowProviderForm}>
                    <DialogTrigger asChild>
                      <Button className="gradient-btn border-0 gap-2"><Plus className="h-4 w-4" /> Novo</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border">
                      <DialogHeader>
                        <DialogTitle style={{ fontFamily: "'DM Serif Display', serif" }}>Novo Prestador</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Nome</Label>
                          <Input value={newProvider.name} onChange={e => setNewProvider(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-muted/50" placeholder="Nome do prestador" />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Tipo de Serviço</Label>
                          <Select value={newProvider.service_type} onValueChange={v => setNewProvider(p => ({ ...p, service_type: v }))}>
                            <SelectTrigger className="mt-1 bg-muted/50"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Voos">Voos</SelectItem>
                              <SelectItem value="Hotéis">Hotéis</SelectItem>
                              <SelectItem value="Aluguel">Aluguel</SelectItem>
                              <SelectItem value="Seguros">Seguros</SelectItem>
                              <SelectItem value="Tours">Tours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Taxa de Comissão (%)</Label>
                          <Input type="number" value={newProvider.commission_rate} onChange={e => setNewProvider(p => ({ ...p, commission_rate: e.target.value }))} className="mt-1 bg-muted/50" />
                        </div>
                        <Button onClick={handleAddProvider} className="w-full gradient-btn border-0" disabled={!newProvider.name || !newProvider.service_type}>
                          Adicionar Prestador
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="glass-card glow-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                      <th className="text-left p-4">Prestador</th>
                      <th className="text-left p-4">Tipo</th>
                      <th className="text-left p-4">Reservas</th>
                      <th className="text-left p-4">Receita</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => {
                      const StatusIcon = statusIcons[p.status];
                      return (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{p.name}</td>
                          <td className="p-4 text-muted-foreground">{p.service_type}</td>
                          <td className="p-4">{p.booking_count || 0}</td>
                          <td className="p-4 font-medium text-accent">R$ {(p.total_revenue || 0).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[p.status]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {p.status === 'active' ? 'Ativo' : p.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {!loading && tab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Reservas</h1>
                  <p className="text-sm text-muted-foreground">Todas as reservas da plataforma</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
                  </div>
                  <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                    <DialogTrigger asChild>
                      <Button className="gradient-btn border-0 gap-2"><Plus className="h-4 w-4" /> Nova</Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border">
                      <DialogHeader>
                        <DialogTitle style={{ fontFamily: "'DM Serif Display', serif" }}>Nova Reserva</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Nome do Viajante</Label>
                          <Input value={newBooking.traveler_name} onChange={e => setNewBooking(b => ({ ...b, traveler_name: e.target.value }))} className="mt-1 bg-muted/50" placeholder="Nome completo" />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">E-mail</Label>
                          <Input type="email" value={newBooking.traveler_email} onChange={e => setNewBooking(b => ({ ...b, traveler_email: e.target.value }))} className="mt-1 bg-muted/50" placeholder="email@exemplo.com" />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Destino</Label>
                          <Input value={newBooking.destination} onChange={e => setNewBooking(b => ({ ...b, destination: e.target.value }))} className="mt-1 bg-muted/50" placeholder="Paris, Tóquio..." />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm text-muted-foreground">Data</Label>
                            <Input type="date" value={newBooking.travel_date} onChange={e => setNewBooking(b => ({ ...b, travel_date: e.target.value }))} className="mt-1 bg-muted/50" />
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Valor (R$)</Label>
                            <Input type="number" value={newBooking.amount} onChange={e => setNewBooking(b => ({ ...b, amount: e.target.value }))} className="mt-1 bg-muted/50" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Prestador</Label>
                          <Select value={newBooking.provider_id} onValueChange={v => setNewBooking(b => ({ ...b, provider_id: v }))}>
                            <SelectTrigger className="mt-1 bg-muted/50"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                              {providers.filter(p => p.status === 'active').map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddBooking} className="w-full gradient-btn border-0" disabled={!newBooking.traveler_name || !newBooking.destination || !newBooking.amount}>
                          Adicionar Reserva
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="glass-card glow-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                      <th className="text-left p-4">ID</th>
                      <th className="text-left p-4">Viajante</th>
                      <th className="text-left p-4">Destino</th>
                      <th className="text-left p-4">Data</th>
                      <th className="text-left p-4">Valor</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => b.traveler_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.destination.toLowerCase().includes(searchQuery.toLowerCase())).map(b => {
                      const StatusIcon = statusIcons[b.status];
                      return (
                        <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground">{b.booking_code}</td>
                          <td className="p-4 font-medium">{b.traveler_name}</td>
                          <td className="p-4 text-muted-foreground">{b.destination}</td>
                          <td className="p-4 text-muted-foreground">{b.travel_date}</td>
                          <td className="p-4 font-medium text-accent">R$ {Number(b.amount).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[b.status]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {b.status === 'confirmed' ? 'Confirmado' : b.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Commissions Tab */}
          {!loading && tab === 'commissions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Comissões</h1>
                <p className="text-sm text-muted-foreground">Controle de comissões por prestador</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Comissões', value: `R$ ${commissionsByProvider.reduce((a, c) => a + c.totalCommission, 0).toLocaleString()}`, icon: DollarSign },
                  { label: 'Taxa Média', value: `${commissionsByProvider.length ? (commissionsByProvider.reduce((a, c) => a + Number(c.rate), 0) / commissionsByProvider.length).toFixed(1) : 0}%`, icon: BarChart3 },
                  { label: 'Prestadores', value: commissionsByProvider.length.toString(), icon: Users },
                ].map((m, i) => (
                  <div key={i} className="glass-card glow-border p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{m.label}</span>
                      <m.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="glass-card glow-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                      <th className="text-left p-4">Prestador</th>
                      <th className="text-left p-4">Serviço</th>
                      <th className="text-left p-4">Taxa</th>
                      <th className="text-left p-4">Reservas</th>
                      <th className="text-left p-4">Total Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionsByProvider.map((c, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{c.provider}</td>
                        <td className="p-4 text-muted-foreground">{c.service}</td>
                        <td className="p-4"><Badge variant="outline" className="border-primary/30 text-primary">{c.rate}%</Badge></td>
                        <td className="p-4">{c.totalBookings}</td>
                        <td className="p-4 font-medium text-accent">R$ {c.totalCommission.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
