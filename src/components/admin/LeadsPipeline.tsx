import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Phone, Mail, MapPin, Calendar, DollarSign,
  ChevronRight, Eye, ThermometerSun, Flame, Snowflake, Clock,
  ArrowUpDown, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  destination_slug: string | null;
  service_type: string | null;
  travel_date_from: string | null;
  travelers_count: number;
  budget_range: string | null;
  message: string | null;
  stage: string;
  score: number;
  temperature: string;
  source: string;
  utm_source: string | null;
  utm_campaign: string | null;
  notes: string | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadEvent {
  id: string;
  event_type: string;
  channel: string | null;
  description: string | null;
  created_at: string;
}

interface PipelineStats {
  by_stage: Record<string, number> | null;
  by_source: Record<string, number> | null;
  total_leads: number;
  hot_leads: number;
  conversion_rate: number | null;
}

const STAGES = [
  { value: 'new', label: 'Novo', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'contacted', label: 'Contatado', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'qualified', label: 'Qualificado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'quoted', label: 'Cotado', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  { value: 'converted', label: 'Convertido', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

const TEMP_ICONS: Record<string, typeof Flame> = {
  hot: Flame,
  warm: ThermometerSun,
  cold: Snowflake,
};

interface Props {
  sessionToken: string;
}

export const LeadsPipeline = ({ sessionToken }: Props) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadEvents, setLeadEvents] = useState<LeadEvent[]>([]);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc('admin_get_leads', {
      p_session_token: sessionToken,
      p_stage: stageFilter === 'all' ? null : stageFilter,
      p_limit: 100,
      p_offset: 0,
    });
    const result = data as unknown as { success: boolean; data: Lead[]; total: number } | null;
    if (result?.success) setLeads(result.data || []);
    setLoading(false);
  }, [sessionToken, stageFilter]);

  const fetchStats = useCallback(async () => {
    const { data } = await supabase.rpc('admin_get_pipeline_stats', { p_session_token: sessionToken });
    const result = data as unknown as { success: boolean } & PipelineStats | null;
    if (result?.success) setStats(result);
  }, [sessionToken]);

  useEffect(() => { fetchLeads(); fetchStats(); }, [fetchLeads, fetchStats]);

  const openLead = async (lead: Lead) => {
    setSelectedLead(lead);
    const { data } = await supabase.rpc('admin_get_lead_events', {
      p_session_token: sessionToken,
      p_lead_id: lead.id,
    });
    const result = data as unknown as { success: boolean; data: LeadEvent[] } | null;
    if (result?.success) setLeadEvents(result.data || []);
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    const { data } = await supabase.rpc('admin_update_lead', {
      p_session_token: sessionToken,
      p_lead_id: leadId,
      p_data: { stage: newStage },
    });
    const result = data as unknown as { success: boolean } | null;
    if (result?.success) {
      toast.success('Status atualizado');
      fetchLeads();
      fetchStats();
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => prev ? { ...prev, stage: newStage } : null);
        // Refresh events
        openLead({ ...selectedLead!, stage: newStage });
      }
    }
  };

  const updateLeadTemp = async (leadId: string, temp: string) => {
    await supabase.rpc('admin_update_lead', {
      p_session_token: sessionToken,
      p_lead_id: leadId,
      p_data: { temperature: temp },
    });
    fetchLeads();
  };

  const filteredLeads = leads.filter((l) =>
    !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.destination_slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Total de Leads</p>
            <p className="text-2xl font-bold text-foreground">{stats.total_leads}</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Leads Quentes</p>
            <p className="text-2xl font-bold text-destructive">{stats.hot_leads}</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-primary">{stats.conversion_rate ?? 0}%</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Estágios</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {stats.by_stage && Object.entries(stats.by_stage).map(([stage, count]) => (
                <Badge key={stage} variant="outline" className="text-xs">
                  {stage}: {count as number}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl flex-1"
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estágios</SelectItem>
            {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Lead</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Destino</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Serviço</th>
                <th className="text-left p-4 font-medium">Estágio</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Temp.</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Origem</th>
                <th className="text-left p-4 font-medium">Data</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado</td></tr>
              ) : filteredLeads.map((lead) => {
                const stageInfo = STAGES.find((s) => s.value === lead.stage);
                const TempIcon = TEMP_ICONS[lead.temperature] || ThermometerSun;
                return (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => openLead(lead)}>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email || lead.phone}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground capitalize">{lead.destination_slug?.replace(/-/g, ' ') || '—'}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground capitalize">{lead.service_type?.replace(/-/g, ' ') || '—'}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={stageInfo?.color}>{stageInfo?.label || lead.stage}</Badge>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <TempIcon className={`h-4 w-4 ${lead.temperature === 'hot' ? 'text-red-500' : lead.temperature === 'warm' ? 'text-yellow-500' : 'text-blue-400'}`} />
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">{lead.source}</td>
                    <td className="p-4 text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedLead.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Mail className="h-4 w-4" /> {selectedLead.email}
                    </a>
                  )}
                  {selectedLead.phone && (
                    <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Phone className="h-4 w-4" /> {selectedLead.phone}
                    </a>
                  )}
                  {selectedLead.destination_slug && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {selectedLead.destination_slug.replace(/-/g, ' ')}
                    </div>
                  )}
                  {selectedLead.travel_date_from && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {new Date(selectedLead.travel_date_from).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {selectedLead.budget_range && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" /> {selectedLead.budget_range}
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div className="glass-panel rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">{selectedLead.message}</p>
                  </div>
                )}

                {/* UTM Info */}
                {(selectedLead.utm_source || selectedLead.utm_campaign) && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {selectedLead.utm_source && <p>Origem: {selectedLead.utm_source}</p>}
                    {selectedLead.utm_campaign && <p>Campanha: {selectedLead.utm_campaign}</p>}
                  </div>
                )}

                {/* Stage Controls */}
                <div>
                  <Label className="text-sm font-medium">Alterar Estágio</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {STAGES.map((s) => (
                      <Button
                        key={s.value}
                        variant={selectedLead.stage === s.value ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => updateLeadStage(selectedLead.id, s.value)}
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Temperature Controls */}
                <div>
                  <Label className="text-sm font-medium">Temperatura</Label>
                  <div className="flex gap-2 mt-2">
                    {(['hot', 'warm', 'cold'] as const).map((t) => {
                      const Icon = TEMP_ICONS[t];
                      return (
                        <Button
                          key={t}
                          variant={selectedLead.temperature === t ? 'default' : 'outline'}
                          size="sm"
                          className="rounded-full text-xs gap-1"
                          onClick={() => {
                            updateLeadTemp(selectedLead.id, t);
                            setSelectedLead((prev) => prev ? { ...prev, temperature: t } : null);
                          }}
                        >
                          <Icon className="h-3 w-3" /> {t === 'hot' ? 'Quente' : t === 'warm' ? 'Morno' : 'Frio'}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Events Timeline */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Histórico</Label>
                  {leadEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
                  ) : (
                    <div className="space-y-3">
                      {leadEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 text-sm">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div>
                            <p className="text-foreground">{event.description || event.event_type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.created_at).toLocaleString('pt-BR')} {event.channel && `· ${event.channel}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
