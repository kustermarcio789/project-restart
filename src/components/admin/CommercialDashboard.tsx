import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Treemap } from 'recharts';
import { TrendingUp, Users, Target, DollarSign, Clock, AlertTriangle, CheckCircle2, XCircle, Phone, Flame, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CommercialDashboardProps {
  sessionToken: string;
}

const STAGE_LABELS: Record<string, string> = {
  new: 'Novo', qualified: 'Qualificado', contacted: 'Em Contato',
  proposal: 'Proposta', negotiation: 'Negociação', converted: 'Convertido', lost: 'Perdido',
};

const STAGE_COLORS: Record<string, string> = {
  new: '#3b82f6', qualified: '#8b5cf6', contacted: '#f59e0b',
  proposal: '#06b6d4', negotiation: '#ec4899', converted: '#10b981', lost: '#ef4444',
};

const TEMP_COLORS = { hot: '#ef4444', warm: '#f59e0b', cold: '#3b82f6' };

export const CommercialDashboard = ({ sessionToken }: CommercialDashboardProps) => {
  const [stats, setStats] = useState<any>(null);
  const [followups, setFollowups] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [sessionToken]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, followupRes] = await Promise.all([
        supabase.rpc('admin_get_commercial_stats', { p_session_token: sessionToken }),
        supabase.rpc('admin_get_followup_queue', { p_session_token: sessionToken }),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (followupRes.data) setFollowups(followupRes.data);
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const stageData = stats.by_stage
    ? Object.entries(stats.by_stage).map(([stage, count]) => ({
        name: STAGE_LABELS[stage] || stage,
        value: count as number,
        fill: STAGE_COLORS[stage] || '#6b7280',
      }))
    : [];

  const sourceData = stats.by_source
    ? Object.entries(stats.by_source).map(([source, count]) => ({
        name: source,
        value: count as number,
      }))
    : [];

  const scoreDistribution = stats.score_distribution || { high: 0, medium: 0, low: 0 };

  const overdue = followups?.overdue || [];
  const today = followups?.today || [];
  const noContact = followups?.no_contact || [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total de Leads" value={stats.total_leads} />
        <KPICard icon={TrendingUp} label="Novos Hoje" value={stats.new_today} accent />
        <KPICard icon={Flame} label="Leads Quentes" value={stats.hot_leads} color="text-destructive" />
        <KPICard icon={Target} label="Taxa de Conversão" value={`${stats.conversion_rate || 0}%`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={Thermometer} label="Leads Mornos" value={stats.warm_leads} color="text-yellow-500" />
        <KPICard icon={DollarSign} label="Score Médio" value={stats.avg_score || 0} />
        <KPICard icon={AlertTriangle} label="Follow-ups Atrasados" value={stats.overdue_followups} color="text-destructive" />
        <KPICard icon={Clock} label="Follow-ups Hoje" value={stats.today_followups} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pipeline por Estágio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {stageData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Distribution */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Temperatura dos Leads</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Quente', value: scoreDistribution.high, fill: TEMP_COLORS.hot },
                  { name: 'Morno', value: scoreDistribution.medium, fill: TEMP_COLORS.warm },
                  { name: 'Frio', value: scoreDistribution.low, fill: TEMP_COLORS.cold },
                ]}
                cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill={TEMP_COLORS.hot} />
                <Cell fill={TEMP_COLORS.warm} />
                <Cell fill={TEMP_COLORS.cold} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source Distribution */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Leads por Origem</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Follow-up Queue */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Fila de Follow-up</h3>
        <div className="space-y-4">
          {overdue.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-destructive flex items-center gap-1 mb-2">
                <AlertTriangle className="h-4 w-4" /> Atrasados ({overdue.length})
              </h4>
              <div className="space-y-2">
                {overdue.slice(0, 5).map((lead: any) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          )}
          {today.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-yellow-500 flex items-center gap-1 mb-2">
                <Clock className="h-4 w-4" /> Para Hoje ({today.length})
              </h4>
              <div className="space-y-2">
                {today.slice(0, 5).map((lead: any) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          )}
          {noContact.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                <Phone className="h-4 w-4" /> Sem Contato ({noContact.length})
              </h4>
              <div className="space-y-2">
                {noContact.slice(0, 5).map((lead: any) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          )}
          {overdue.length === 0 && today.length === 0 && noContact.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum follow-up pendente 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ icon: Icon, label, value, accent, color }: {
  icon: any; label: string; value: any; accent?: boolean; color?: string;
}) => (
  <div className={`glass-panel rounded-xl p-4 ${accent ? 'ring-1 ring-primary' : ''}`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`h-4 w-4 ${color || 'text-primary'}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${color || 'text-foreground'}`}>{value}</p>
  </div>
);

const LeadRow = ({ lead }: { lead: any }) => (
  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm">
    <div>
      <span className="font-medium">{lead.name}</span>
      <span className="text-muted-foreground text-xs ml-2">{lead.destination_slug || 'sem destino'}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        lead.temperature === 'hot' ? 'bg-destructive/20 text-destructive' :
        lead.temperature === 'warm' ? 'bg-yellow-500/20 text-yellow-600' :
        'bg-blue-500/20 text-blue-600'
      }`}>
        {lead.score || 0}pts
      </span>
      {lead.phone && (
        <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
          className="text-primary hover:text-primary/80">
          <Phone className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  </div>
);
