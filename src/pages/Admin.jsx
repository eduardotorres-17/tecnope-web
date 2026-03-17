import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, CalendarDays, Loader2, Check, X as CancelIcon, Clock, Plus, Trash2, CalendarClock, MessageCircle, CheckCheck, History } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' ou 'horarios'
  const [filtroAgenda, setFiltroAgenda] = useState('ativas'); // 'ativas' ou 'historico'
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados do Formulário de Gerador de Horários
  const [profId, setProfId] = useState('');
  const [dataSlot, setDataSlot] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFim, setHoraFim] = useState('18:00');
  const [intervalo, setIntervalo] = useState('60'); // em minutos

  useEffect(() => {
    carregarDadosBase();
    buscarAgendamentos();
    buscarHorarios();
  }, []);

  const carregarDadosBase = async () => {
    const { data } = await supabase.from('profissionais').select('*').eq('ativo', true);
    if (data) setProfissionais(data);
  };

  const buscarAgendamentos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`*, servicos(titulo, duracao_minutos), profissionais(nome)`)
      .order('data_agendamento', { ascending: true })
      .order('horario_inicio', { ascending: true });

    if (!error) setAgendamentos(data || []);
    setLoading(false);
  };

  const buscarHorarios = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('horarios_disponiveis')
      .select(`*, profissionais(nome)`)
      .gte('data_disponivel', hoje)
      .order('data_disponivel', { ascending: true })
      .order('hora_inicio', { ascending: true });
    
    if (data) setHorarios(data);
  };

  // --- MOTOR GERADOR DE HORÁRIOS ---
  const handleGerarHorarios = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    const slotsToInsert = [];
    
    const timeToMins = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    
    const minsToTime = (mins) => {
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      return `${h}:${m}:00`;
    };

    let currentMins = timeToMins(horaInicio);
    const endMins = timeToMins(horaFim);
    const step = parseInt(intervalo);

    while (currentMins < endMins) {
      slotsToInsert.push({
        profissional_id: parseInt(profId),
        data_disponivel: dataSlot,
        hora_inicio: minsToTime(currentMins),
        ocupado: false
      });
      currentMins += step;
    }

    const { error } = await supabase.from('horarios_disponiveis').insert(slotsToInsert);
    
    setIsGenerating(false);

    if (error) {
      alert("Erro! Alguns destes horários já foram criados para este profissional neste dia.");
    } else {
      alert(`${slotsToInsert.length} horários criados com sucesso!`);
      buscarHorarios();
    }
  };

  const excluirHorario = async (id) => {
    if(!window.confirm("Deseja mesmo excluir este horário livre?")) return;
    
    const { error } = await supabase.from('horarios_disponiveis').delete().eq('id', id);
    if (error) alert("Erro ao excluir. Tente novamente.");
    else buscarHorarios();
  };

  // --- NOVA LÓGICA DE ATUALIZAÇÃO DE STATUS ---
  const atualizarStatusAgendamento = async (agendamento, novoStatus) => {
    // 1. Atualiza o status do agendamento
    const { error } = await supabase.from('agendamentos').update({ status: novoStatus }).eq('id', agendamento.id);
    
    if (!error) {
      // 2. Se a consulta foi CANCELADA, libera a vaga no banco de dados
      if (novoStatus === 'cancelado' && agendamento.horario_id) {
        await supabase.from('horarios_disponiveis').update({ ocupado: false }).eq('id', agendamento.horario_id);
      }
      buscarAgendamentos();
      buscarHorarios(); // Atualiza a lista de vagas também
    } else {
      alert("Erro ao atualizar a consulta.");
    }
  };

  const formatarData = (dataString) => {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtros da Agenda
  const agendamentosAtivos = agendamentos.filter(ag => ag.status === 'pendente' || ag.status === 'confirmado');
  const agendamentosHistorico = agendamentos.filter(ag => ag.status === 'concluido' || ag.status === 'cancelado');
  const listaExibida = filtroAgenda === 'ativas' ? agendamentosAtivos : agendamentosHistorico;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-brand-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Tecnopé Admin</h1>
              <p className="text-xs text-brand-300">Área Restrita</p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 hover:bg-brand-800 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        
        {/* NAVEGAÇÃO DE ABAS PRINCIPAIS */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
          <button 
            onClick={() => setActiveTab('agenda')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'agenda' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <CalendarDays size={20} /> Gestão de Consultas
          </button>
          <button 
            onClick={() => setActiveTab('horarios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'horarios' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <CalendarClock size={20} /> Gerenciar Vagas
          </button>
        </div>

        {/* --- ABA 1: AGENDA DE CONSULTAS --- */}
        {activeTab === 'agenda' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Cabeçalho da Tabela com Sub-abas */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button 
                  onClick={() => setFiltroAgenda('ativas')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filtroAgenda === 'ativas' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Próximas Consultas
                </button>
                <button 
                  onClick={() => setFiltroAgenda('historico')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 transition-all ${filtroAgenda === 'historico' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <History size={14} /> Histórico
                </button>
              </div>

              <button onClick={buscarAgendamentos} className="text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-lg transition-colors text-sm font-semibold border border-brand-200">
                Atualizar Lista
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20 text-brand-500"><Loader2 className="animate-spin" size={40} /></div>
            ) : listaExibida.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                {filtroAgenda === 'ativas' ? "Nenhuma consulta pendente ou confirmada." : "O histórico está vazio."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-semibold">Cliente</th>
                      <th className="p-4 font-semibold">Serviço</th>
                      <th className="p-4 font-semibold">Data/Hora</th>
                      <th className="p-4 font-semibold">Profissional</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {listaExibida.map((ag) => {
                      const telefoneLimpo = ag.cliente_telefone.replace(/\D/g, '');
                      const textoWpp = `Olá, ${ag.cliente_nome}! Aqui é da Clínica Tecnopé. Gostaríamos de confirmar o seu agendamento de *${ag.servicos?.titulo}* para o dia *${formatarData(ag.data_agendamento)}* às *${ag.horario_inicio.substring(0,5)}*.`;
                      const linkWpp = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(textoWpp)}`;

                      return (
                        <tr key={ag.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{ag.cliente_nome}</p>
                            <p className="text-xs text-brand-600">{ag.cliente_telefone}</p>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{ag.servicos?.titulo}</td>
                          <td className="p-4 text-sm text-slate-700 font-medium">
                            {formatarData(ag.data_agendamento)} <br/> <span className="text-slate-500">{ag.horario_inicio.substring(0,5)}</span>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{ag.profissionais?.nome || '-'}</td>
                          <td className="p-4">
                            {ag.status === 'pendente' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pendente</span>}
                            {ag.status === 'confirmado' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Confirmado</span>}
                            {ag.status === 'concluido' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Concluído</span>}
                            {ag.status === 'cancelado' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelado</span>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              
                              {/* Botão de WhatsApp (Só faz sentido se a consulta ainda vai acontecer) */}
                              {filtroAgenda === 'ativas' && (
                                <a 
                                  href={linkWpp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Chamar no WhatsApp"
                                  className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200"
                                >
                                  <MessageCircle size={18} />
                                </a>
                              )}

                              {/* Ações: Confirmar, Concluir, Cancelar */}
                              {filtroAgenda === 'ativas' && (
                                <>
                                  {ag.status === 'pendente' && (
                                    <button title="Confirmar" onClick={() => atualizarStatusAgendamento(ag, 'confirmado')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-200"><Check size={18} /></button>
                                  )}
                                  {ag.status === 'confirmado' && (
                                    <button title="Dar Baixa (Concluir Consulta)" onClick={() => atualizarStatusAgendamento(ag, 'concluido')} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-200"><CheckCheck size={18} /></button>
                                  )}
                                  <button title="Cancelar Consulta (Libera a vaga)" onClick={() => { if(window.confirm("Deseja cancelar e liberar este horário para outros pacientes?")) atualizarStatusAgendamento(ag, 'cancelado') }} className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200"><CancelIcon size={18} /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- ABA 2: GERENCIAMENTO DE HORÁRIOS (MANTIDA INTACTA) --- */}
        {activeTab === 'horarios' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="text-brand-500" /> Abrir Vagas
              </h3>
              <form onSubmit={handleGerarHorarios} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Profissional</label>
                  <select required value={profId} onChange={e => setProfId(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500 bg-white">
                    <option value="">Selecione...</option>
                    {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Data de Atendimento</label>
                  <input type="date" required value={dataSlot} onChange={e => setDataSlot(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hora Início</label>
                    <input type="time" required value={horaInicio} onChange={e => setHoraInicio(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hora Fim</label>
                    <input type="time" required value={horaFim} onChange={e => setHoraFim(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Intervalo (Minutos)</label>
                  <select value={intervalo} onChange={e => setIntervalo(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-brand-500 bg-white">
                    <option value="30">A cada 30 min</option>
                    <option value="45">A cada 45 min</option>
                    <option value="60">A cada 1 hora</option>
                    <option value="90">A cada 1h 30m</option>
                  </select>
                </div>
                <button type="submit" disabled={isGenerating} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-all flex justify-center mt-2">
                  {isGenerating ? <Loader2 className="animate-spin" /> : "Gerar Horários"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Vagas Disponíveis no Sistema</h3>
                <button onClick={buscarHorarios} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-semibold">Atualizar</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {horarios.length === 0 ? (
                  <p className="col-span-full text-slate-400 text-center py-10">Nenhum horário livre gerado.</p>
                ) : (
                  horarios.map(h => (
                    <div key={h.id} className={`p-3 rounded-xl border flex flex-col items-center relative group ${h.ocupado ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'}`}>
                      {!h.ocupado && (
                        <button onClick={() => excluirHorario(h.id)} className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      )}
                      <span className="text-xs font-bold text-slate-500">{formatarData(h.data_disponivel)}</span>
                      <span className={`text-lg font-black ${h.ocupado ? 'text-slate-400' : 'text-emerald-700'}`}>{h.hora_inicio.substring(0,5)}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{h.profissionais.nome}</span>
                      {h.ocupado && <span className="text-[10px] text-red-500 font-bold mt-1">RESERVADO</span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}