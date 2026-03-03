import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, DollarSign, Settings, LogOut, Plane,
  TrendingUp, UserCheck, CreditCard, BarChart3, ChevronRight, Search,
  CheckCircle2, Clock, XCircle, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

type Tab = 'dashboard' | 'providers' | 'bookings' | 'commissions';

// Mock data
const mockStats = {
  totalBookings: 1247,
  activeProviders: 38,
  totalRevenue: 892500,
  monthlyGrowth: 12.5,
};

const mockBookings = [
  { id: 'BK-001', traveler: 'Maria Silva', destination: 'Paris', date: '2026-03-15', amount: 4500, status: 'confirmed' as const },
  { id: 'BK-002', traveler: 'John Smith', destination: 'Tóquio', date: '2026-03-18', amount: 6200, status: 'pending' as const },
  { id: 'BK-003', traveler: 'Ana García', destination: 'Cancún', date: '2026-03-20', amount: 3200, status: 'confirmed' as const },
  { id: 'BK-004', traveler: 'Pedro Santos', destination: 'Roma', date: '2026-03-22', amount: 4100, status: 'cancelled' as const },
  { id: 'BK-005', traveler: 'Laura Chen', destination: 'Dubai', date: '2026-03-25', amount: 5800, status: 'confirmed' as const },
];

const mockProviders = [
  { id: 1, name: 'SkyTravel Voos', type: 'Voos', status: 'active' as const, bookings: 234, revenue: 125000 },
  { id: 2, name: 'LuxStay Hotéis', type: 'Hotéis', status: 'active' as const, bookings: 189, revenue: 98000 },
  { id: 3, name: 'DriveAway Rent', type: 'Aluguel', status: 'pending' as const, bookings: 0, revenue: 0 },
  { id: 4, name: 'SafeTrip Seguros', type: 'Seguros', status: 'active' as const, bookings: 156, revenue: 45000 },
  { id: 5, name: 'WorldTours', type: 'Tours', status: 'blocked' as const, bookings: 67, revenue: 32000 },
];

const mockCommissions = [
  { provider: 'SkyTravel Voos', service: 'Voos', rate: 8, totalBookings: 234, totalCommission: 10000 },
  { provider: 'LuxStay Hotéis', service: 'Hotéis', rate: 12, totalBookings: 189, totalCommission: 11760 },
  { provider: 'SafeTrip Seguros', service: 'Seguros', rate: 15, totalBookings: 156, totalCommission: 6750 },
  { provider: 'WorldTours', service: 'Tours', rate: 10, totalBookings: 67, totalCommission: 3200 },
];

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
  const [tab, setTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const validateSession = async () => {
      const token = sessionStorage.getItem('admin_session_token');
      if (!token) {
        navigate('/admin');
        return;
      }
      const { data, error } = await supabase.rpc('admin_validate_session', {
        p_session_token: token,
      });
      const result = data as unknown as { valid: boolean } | null;
      if (error || !result?.valid) {
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_display_name');
        navigate('/admin');
      }
    };
    validateSession();
  }, [navigate]);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('admin_session_token');
    if (token) {
      await supabase.rpc('admin_logout', { p_session_token: token });
    }
    sessionStorage.removeItem('admin_session_token');
    sessionStorage.removeItem('admin_display_name');
    navigate('/admin');
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'providers' as const, label: 'Prestadores', icon: Users },
    { id: 'bookings' as const, label: 'Reservas', icon: Calendar },
    { id: 'commissions' as const, label: 'Comissões', icon: DollarSign },
  ];

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
                tab === t.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
          {/* Dashboard Tab */}
          {tab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Dashboard</h1>
                <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Reservas', value: mockStats.totalBookings.toLocaleString(), icon: Calendar, change: '+18%', color: 'text-primary' },
                  { label: 'Prestadores Ativos', value: mockStats.activeProviders.toString(), icon: UserCheck, change: '+3', color: 'text-emerald-500' },
                  { label: 'Receita Total', value: `R$ ${(mockStats.totalRevenue / 1000).toFixed(0)}K`, icon: CreditCard, change: '+12.5%', color: 'text-accent' },
                  { label: 'Crescimento Mensal', value: `${mockStats.monthlyGrowth}%`, icon: TrendingUp, change: '+2.1%', color: 'text-primary' },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card glow-border p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</span>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    <div className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{metric.value}</div>
                    <div className="text-xs text-emerald-500 mt-1">{metric.change}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Bookings */}
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
                      {mockBookings.slice(0, 5).map(b => {
                        const StatusIcon = statusIcons[b.status];
                        return (
                          <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                            <td className="p-4 font-medium">{b.traveler}</td>
                            <td className="p-4 text-muted-foreground">{b.destination}</td>
                            <td className="p-4 font-medium text-accent">R$ {b.amount.toLocaleString()}</td>
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
          {tab === 'providers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Prestadores</h1>
                  <p className="text-sm text-muted-foreground">Gerencie prestadores de serviço</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
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
                    {mockProviders.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => {
                      const StatusIcon = statusIcons[p.status];
                      return (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{p.name}</td>
                          <td className="p-4 text-muted-foreground">{p.type}</td>
                          <td className="p-4">{p.bookings}</td>
                          <td className="p-4 font-medium text-accent">R$ {p.revenue.toLocaleString()}</td>
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
          {tab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Reservas</h1>
                  <p className="text-sm text-muted-foreground">Todas as reservas da plataforma</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
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
                    {mockBookings.filter(b => b.traveler.toLowerCase().includes(searchQuery.toLowerCase()) || b.destination.toLowerCase().includes(searchQuery.toLowerCase())).map(b => {
                      const StatusIcon = statusIcons[b.status];
                      return (
                        <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                          <td className="p-4 font-medium">{b.traveler}</td>
                          <td className="p-4 text-muted-foreground">{b.destination}</td>
                          <td className="p-4 text-muted-foreground">{b.date}</td>
                          <td className="p-4 font-medium text-accent">R$ {b.amount.toLocaleString()}</td>
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
          {tab === 'commissions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Comissões</h1>
                <p className="text-sm text-muted-foreground">Controle de comissões por prestador</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Comissões', value: `R$ ${mockCommissions.reduce((a, c) => a + c.totalCommission, 0).toLocaleString()}`, icon: DollarSign },
                  { label: 'Taxa Média', value: `${(mockCommissions.reduce((a, c) => a + c.rate, 0) / mockCommissions.length).toFixed(1)}%`, icon: BarChart3 },
                  { label: 'Prestadores', value: mockCommissions.length.toString(), icon: Users },
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
                    {mockCommissions.map((c, i) => (
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
