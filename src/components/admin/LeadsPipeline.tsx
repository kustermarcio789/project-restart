import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Phone, Mail, MapPin, Calendar, DollarSign,
  ChevronRight, Eye, ThermometerSun, Flame, Snowflake, Clock,
  ArrowUpDown, Filter, Zap, AlertTriangle, TrendingUp, BarChart3,
  RefreshCw, MessageCircle, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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

interface CommercialStats {
  total_leads: number;
  new_today: number;
  new_week: number;
  hot_leads: number;
  warm_leads: number;
  avg_score: number | null;
  overdue_followups: number;
  today_followups: number;
  conversion_rate: number | null;
  by_stage: Record<string, number>;
  by_source: Record<string, number>;
  by_service: Record<string, number>;
  score_distribution: { high: number; medium: number; low: number };
}

interface FollowUpAction {
  lead_id: string;
  name: string;
  action: string;
  channel: string;
  priority: string;
  contact: string;
  context: string;
  type?: string;
}

interface WhatsAppTemplate {
  lead_id: string;
  name: string;
  phone: string;
  message: string;
  whatsapp_url: string;
  priority: string;
  type?: string;
}

interface EmailTemplate {
  lead_id: string;
  name: string;
  email: string;
  subject: string;
  priority: string;
  type?: string;
}

const STAGES = [
  { value: 'new', label: 'Novo', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'contacted', label: 'Contatado', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'qualified', label: 'Qualificado', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'quoted', label: 'Cotado', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  { value: 'converted', label: 'Convertido', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
];

const TEMP_ICONS: Record<string, typeof Flame> = { hot: Flame, warm: ThermometerSun, cold: Snowflake };

interface Props {
  sessionToken: string;
}

export const LeadsPipeline = ({ sessionToken }: Props) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CommercialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadEvents, setLeadEvents] = useState<LeadEvent[]>([]);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('score');
  const [followUpActions, setFollowUpActions] = useState<FollowUpAction[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [followupNote, setFollowupNote] = useState('');
  const [followupDate, setFollowupDate] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc('admin_get_leads', {
      p_session_token: sessionToken,
      p_stage: stageFilter === 'all' ? null : stageFilter,
      p_limit: 100,
      p_offset: 0,
    });
    const result = data as unknown as { success: boolean; data: Lead[]; total: number } | null;
    if (result?.success) {
      const sorted = (result.data || []).sort((a, b) =>
        sortBy === 'score' ? (b.score || 0) - (a.score || 0) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLeads(sorted);
    }
    setLoading(false);
  }, [sessionToken, stageFilter, sortBy]);

  const fetchStats = useCallback(async () => {
    const { data } = await supabase.rpc('admin_get_commercial_stats', { p_session_token: sessionToken });
    const result = data as unknown as { success: boolean } & CommercialStats | null;
    if (result?.success) setStats(result);
  }, [sessionToken]);

  useEffect(() => { fetchLeads(); fetchStats(); }, [fetchLeads, fetchStats]);

  const openLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setFollowupNote('');
    setFollowupDate(lead.next_followup_at?.split('T')[0] || '');
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
      fetchLeads(); fetchStats();
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, stage: newStage } : null);
        openLead({ ...selectedLead!, stage: newStage });
      }
    }
  };

  const updateLeadTemp = async (leadId: string, temp: string) => {
    await supabase.rpc('admin_update_lead', {
      p_session_token: sessionToken, p_lead_id: leadId, p_data: { temperature: temp },
    });
    fetchLeads();
  };

  const scheduleFollowup = async () => {
    if (!selectedLead || !followupDate) return;
    await supabase.rpc('admin_update_lead', {
      p_session_token: sessionToken,
      p_lead_id: selectedLead.id,
      p_data: {
        next_followup_at: new Date(followupDate).toISOString(),
        notes: followupNote || selectedLead.notes,
      },
    });
    // Log event
    await supabase.from('lead_events').insert({
      lead_id: selectedLead.id,
      event_type: 'followup_scheduled',
      channel: 'system',
      description: `Follow-up agendado para ${new Date(followupDate).toLocaleDateString('pt-BR')}${followupNote ? ': ' + followupNote : ''}`,
    });
    toast.success('Follow-up agendado');
    openLead({ ...selectedLead, next_followup_at: new Date(followupDate).toISOString() });
    fetchLeads();
  };

  const runBatchScoring = async () => {
    setScoring(true);
    const { data } = await supabase.rpc('admin_batch_score_leads', { p_session_token: sessionToken });
    const result = data as unknown as { success: boolean; scored: number } | null;
    if (result?.success) {
      toast.success(`${result.scored} leads re-pontuados`);
      fetchLeads(); fetchStats();
    }
    setScoring(false);
  };

  const runFollowUpAutomation = async () => {
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/lead-followup-automation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const result = await res.json();
      if (result.success) {
        setFollowUpActions(result.actions || []);
        setWhatsappTemplates(result.whatsapp_templates || []);
        setShowFollowUps(true);
        toast.success(`${result.summary.total_actions} ações de follow-up identificadas`);
      }
    } catch {
      toast.error('Erro ao executar automação');
    }
  };

  const filteredLeads = leads.filter(l =>
    !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.destination_slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Commercial Stats */}
      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Leads', value: stats.total_leads, icon: Target, color: 'text-primary' },
              { label: 'Novos Hoje', value: stats.new_today, icon: Zap, color: 'text-emerald-500' },
              { label: 'Quentes', value: stats.hot_leads, icon: Flame, color: 'text-red-500' },
              { label: 'Score Médio', value: stats.avg_score ?? 0, icon: BarChart3, color: 'text-primary' },
              { label: 'Conversão', value: `${stats.conversion_rate ?? 0}%`, icon: TrendingUp, color: 'text-emerald-500' },
              { label: 'Follow-ups Atrasados', value: stats.overdue_followups, icon: AlertTriangle, color: stats.overdue_followups > 0 ? 'text-red-500' : 'text-muted-foreground' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</span>
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Score Distribution Bar */}
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Distribuição de Score</p>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <div className="flex h-3 rounded-full overflow-hidden">
                  {stats.score_distribution.high > 0 && (
                    <div className="bg-emerald-500" style={{ width: `${(stats.score_distribution.high / Math.max(stats.total_leads, 1)) * 100}%` }} />
                  )}
                  {stats.score_distribution.medium > 0 && (
                    <div className="bg-yellow-500" style={{ width: `${(stats.score_distribution.medium / Math.max(stats.total_leads, 1)) * 100}%` }} />
                  )}
                  {stats.score_distribution.low > 0 && (
                    <div className="bg-muted" style={{ width: `${(stats.score_distribution.low / Math.max(stats.total_leads, 1)) * 100}%` }} />
                  )}
                </div>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.score_distribution.high} alto</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" />{stats.score_distribution.medium} médio</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted" />{stats.score_distribution.low} baixo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Buscar leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rounded-xl flex-1" />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[160px] rounded-xl"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'score')}>
          <SelectTrigger className="w-[140px] rounded-xl"><ArrowUpDown className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Por Score</SelectItem>
            <SelectItem value="date">Por Data</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="rounded-xl gap-1" onClick={runBatchScoring} disabled={scoring}>
          <RefreshCw className={`h-4 w-4 ${scoring ? 'animate-spin' : ''}`} /> Re-pontuar
        </Button>
        <Button size="sm" className="rounded-xl gap-1 gradient-btn" onClick={runFollowUpAutomation}>
          <Zap className="h-4 w-4" /> Follow-ups
        </Button>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-4 font-medium">Lead</th>
                <th className="text-left p-4 font-medium w-16">Score</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Destino</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Serviço</th>
                <th className="text-left p-4 font-medium">Estágio</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Temp.</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Follow-up</th>
                <th className="text-left p-4 font-medium">Data</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Nenhum lead encontrado</td></tr>
              ) : filteredLeads.map(lead => {
                const stageInfo = STAGES.find(s => s.value === lead.stage);
                const TempIcon = TEMP_ICONS[lead.temperature] || ThermometerSun;
                const isOverdue = lead.next_followup_at && new Date(lead.next_followup_at) < new Date();
                return (
                  <tr key={lead.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer ${isOverdue ? 'bg-red-500/5' : ''}`} onClick={() => openLead(lead)}>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email || lead.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`font-bold text-sm ${scoreColor(lead.score)}`}>{lead.score}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground capitalize text-xs">{lead.destination_slug?.replace(/-/g, ' ') || '—'}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground capitalize text-xs">{lead.service_type?.replace(/-/g, ' ') || '—'}</td>
                    <td className="p-4"><Badge variant="outline" className={stageInfo?.color}>{stageInfo?.label || lead.stage}</Badge></td>
                    <td className="p-4 hidden sm:table-cell">
                      <TempIcon className={`h-4 w-4 ${lead.temperature === 'hot' ? 'text-red-500' : lead.temperature === 'warm' ? 'text-yellow-500' : 'text-blue-400'}`} />
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {lead.next_followup_at ? (
                        <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                          {isOverdue && <AlertTriangle className="h-3 w-3" />}
                          {new Date(lead.next_followup_at).toLocaleDateString('pt-BR')}
                        </span>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
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
      <Dialog open={!!selectedLead} onOpenChange={open => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedLead.name}
                  <span className={`text-sm font-bold ${scoreColor(selectedLead.score)}`}>Score: {selectedLead.score}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Contact + Quick Actions */}
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
                  <div className="glass-panel rounded-xl p-4"><p className="text-sm text-muted-foreground">{selectedLead.message}</p></div>
                )}

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
                    {STAGES.map(s => (
                      <Button key={s.value} variant={selectedLead.stage === s.value ? 'default' : 'outline'} size="sm" className="rounded-full text-xs"
                        onClick={() => updateLeadStage(selectedLead.id, s.value)}>{s.label}</Button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <Label className="text-sm font-medium">Temperatura</Label>
                  <div className="flex gap-2 mt-2">
                    {(['hot', 'warm', 'cold'] as const).map(t => {
                      const Icon = TEMP_ICONS[t];
                      return (
                        <Button key={t} variant={selectedLead.temperature === t ? 'default' : 'outline'} size="sm" className="rounded-full text-xs gap-1"
                          onClick={() => { updateLeadTemp(selectedLead.id, t); setSelectedLead(prev => prev ? { ...prev, temperature: t } : null); }}>
                          <Icon className="h-3 w-3" /> {t === 'hot' ? 'Quente' : t === 'warm' ? 'Morno' : 'Frio'}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule Follow-up */}
                <div className="glass-panel rounded-xl p-4 space-y-3">
                  <Label className="text-sm font-medium">📅 Agendar Follow-up</Label>
                  <div className="flex gap-3">
                    <Input type="date" value={followupDate} onChange={e => setFollowupDate(e.target.value)} className="rounded-xl flex-1" />
                    <Button size="sm" className="rounded-xl" onClick={scheduleFollowup} disabled={!followupDate}>Agendar</Button>
                  </div>
                  <Textarea placeholder="Nota sobre o follow-up..." value={followupNote} onChange={e => setFollowupNote(e.target.value)} className="rounded-xl" rows={2} />
                </div>

                {/* Quick WhatsApp */}
                {selectedLead.phone && (
                  <div>
                    <Label className="text-sm font-medium">📱 Ação Rápida</Label>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs" asChild>
                        <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedLead.name}! Sou da equipe Decolando em Viagens. Vi seu interesse${selectedLead.destination_slug ? ' em ' + selectedLead.destination_slug.replace(/-/g, ' ') : ''}. Posso ajudar?`)}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Events Timeline */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Histórico</Label>
                  {leadEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {leadEvents.map(event => (
                        <div key={event.id} className="flex items-start gap-3 text-sm">
                          <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${event.event_type === 'automation_flagged' ? 'bg-yellow-500' : event.event_type === 'followup_scheduled' ? 'bg-blue-500' : 'bg-primary'}`} />
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

      {/* Follow-up Automation Dialog */}
      <Dialog open={showFollowUps} onOpenChange={setShowFollowUps}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Automação de Follow-ups</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-panel rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{followUpActions.length}</p>
                <p className="text-xs text-muted-foreground">Ações pendentes</p>
              </div>
              <div className="glass-panel rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-500">{followUpActions.filter(a => a.priority === 'urgente').length}</p>
                <p className="text-xs text-muted-foreground">Urgentes</p>
              </div>
              <div className="glass-panel rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary">{whatsappTemplates.length}</p>
                <p className="text-xs text-muted-foreground">WhatsApp prontos</p>
              </div>
            </div>

            {/* WhatsApp Templates */}
            {whatsappTemplates.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">📱 Mensagens WhatsApp Prontas</h3>
                <div className="space-y-3">
                  {whatsappTemplates.map((t, i) => (
                    <div key={i} className="glass-panel rounded-xl p-4 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm text-foreground">{t.name}</p>
                          <Badge variant="outline" className={t.priority === 'urgente' ? 'text-red-500 border-red-500/20' : 'text-yellow-500 border-yellow-500/20'}>
                            {t.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{t.message}</p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1 shrink-0" asChild>
                        <a href={t.whatsapp_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" /> Enviar
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Actions */}
            {followUpActions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">📋 Todas as Ações</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {followUpActions.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 glass-panel rounded-xl text-sm">
                      {a.channel === 'whatsapp' ? <Phone className="h-4 w-4 text-emerald-500 shrink-0" /> : <Mail className="h-4 w-4 text-blue-500 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.action} · {a.context}</p>
                      </div>
                      <Badge variant="outline" className={a.priority === 'urgente' ? 'text-red-500 border-red-500/20' : a.priority === 'alto' ? 'text-yellow-500 border-yellow-500/20' : ''}>
                        {a.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {followUpActions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">✅ Nenhuma ação de follow-up pendente!</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
