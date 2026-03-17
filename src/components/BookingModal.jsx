import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, CalendarDays, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function BookingModal({ isOpen, onClose }) {
  // --- ESTADOS DO BANCO DE DADOS ---
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [todosHorariosLivres, setTodosHorariosLivres] = useState([]);

  // --- ESTADOS DO FORMULÁRIO (ESCOLHAS DO CLIENTE) ---
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [profissionalId, setProfissionalId] = useState(""); // "" = Qualquer um
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [slotSelecionado, setSlotSelecionado] = useState(null); // Guarda o objeto inteiro do horário escolhido

  // --- ESTADOS DE UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      carregarDados();
    }
  }, [isOpen]);

  const resetForm = () => {
    setNome("");
    setTelefone("");
    setServicoId("");
    setProfissionalId("");
    setDataSelecionada("");
    setSlotSelecionado(null);
    setSuccess(false);
  };

  async function carregarDados() {
    setIsLoading(true);
    try {
      // 1. Busca os serviços
      const { data: dadosServicos } = await supabase
        .from("servicos")
        .select("*")
        .order("titulo");
      if (dadosServicos) setServicos(dadosServicos);

      // 2. Busca os profissionais ativos
      const { data: dadosProfissionais } = await supabase
        .from("profissionais")
        .select("*")
        .eq("ativo", true);
      if (dadosProfissionais) setProfissionais(dadosProfissionais);

      // 3. Busca APENAS os horários livres (ocupado = false) a partir de hoje
      const hoje = new Date().toISOString().split("T")[0];
      const { data: dadosHorarios } = await supabase
        .from("horarios_disponiveis")
        .select(`*, profissionais(nome)`)
        .eq("ocupado", false)
        .gte("data_disponivel", hoje)
        .order("data_disponivel", { ascending: true })
        .order("hora_inicio", { ascending: true });

      if (dadosHorarios) setTodosHorariosLivres(dadosHorarios);
    } catch (error) {
      console.error("Erro ao carregar dados do modal:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- LÓGICA DE FILTRAGEM DE DATAS E HORAS EM TEMPO REAL ---

  // 1. Filtra os horários livres baseados no profissional selecionado
  const horariosFiltradosPorProfissional = profissionalId
    ? todosHorariosLivres.filter(
        (h) => h.profissional_id === parseInt(profissionalId),
      )
    : todosHorariosLivres;

  // 2. Extrai apenas as datas únicas que têm vagas
  const datasComVagas = [
    ...new Set(horariosFiltradosPorProfissional.map((h) => h.data_disponivel)),
  ];

  // 3. Pega os horários exatos da data selecionada
  const vagasNaDataSelecionada = dataSelecionada
    ? horariosFiltradosPorProfissional.filter(
        (h) => h.data_disponivel === dataSelecionada,
      )
    : [];

  // Se o usuário mudar o profissional, limpamos a data e hora (pois as opções vão mudar)
  const handleProfissionalChange = (e) => {
    setProfissionalId(e.target.value);
    setDataSelecionada("");
    setSlotSelecionado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slotSelecionado) {
      alert("Por favor, selecione um horário disponível.");
      return;
    }

    setIsSubmitting(true);

    const novoAgendamento = {
      cliente_nome: nome,
      cliente_telefone: telefone,
      servico_id: parseInt(servicoId),
      profissional_id: slotSelecionado.profissional_id, // Forçamos o profissional do horário
      horario_id: slotSelecionado.id, // O ID da vaga na tabela horarios_disponiveis
      data_agendamento: slotSelecionado.data_disponivel,
      horario_inicio: slotSelecionado.hora_inicio,
      status: "pendente",
    };

    try {
      // Passo A: Insere o agendamento
      const { error: erroAgendamento } = await supabase
        .from("agendamentos")
        .insert([novoAgendamento]);
      if (erroAgendamento) throw erroAgendamento;

      // Passo B: Tranca a vaga (atualiza ocupado para true)
      const { error: erroVaga } = await supabase
        .from("horarios_disponiveis")
        .update({ ocupado: true })
        .eq("id", slotSelecionado.id);

      if (erroVaga) throw erroVaga;

      // Deu tudo certo!
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      alert(
        "Alguém acabou de reservar esse horário! Por favor, escolha outro.",
      );
      carregarDados(); // Recarrega os dados pra sumir com a vaga que acabaram de roubar
      setSlotSelecionado(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para deixar a data bonitinha: 2026-03-20 -> 20/03/2026
  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative my-8">
        {/* Cabeçalho */}
        <div className="bg-brand-500 p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays /> Agendar Consulta
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-brand-600 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-brand-500">
              <Loader2 size={40} className="animate-spin" />
              <p className="font-medium text-slate-500">
                Buscando agenda da clínica...
              </p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Horário Reservado!
              </h3>
              <p className="text-slate-600">
                Sua solicitação foi enviada e o horário está reservado! A Ana ou o Nei entrarão em contato via WhatsApp para confirmar. Caso precise cancelar ou remarcar, por favor, nos avise pelo WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DADOS PESSOAIS */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Seus Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      placeholder="Ex: Maria Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                      placeholder="(53) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* SERVIÇO E PROFISSIONAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Qual Tratamento?
                  </label>
                  <select
                    required
                    value={servicoId}
                    onChange={(e) => setServicoId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {servicos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Profissional (Opcional)
                  </label>
                  <select
                    value={profissionalId}
                    onChange={handleProfissionalChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    <option value="">Sem preferência</option>
                    {profissionais.map((p) => (
                      <option key={p.id} value={p.id}>
                        Podólogo(a) {p.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ESCOLHA DE DATA */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Dia da Consulta
                </label>
                {datasComVagas.length === 0 ? (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                    Não há horários livres no momento. Chame no WhatsApp.
                  </div>
                ) : (
                  <select
                    required
                    value={dataSelecionada}
                    onChange={(e) => {
                      setDataSelecionada(e.target.value);
                      setSlotSelecionado(null);
                    }}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    <option value="">Escolha um dia disponível...</option>
                    {datasComVagas.map((data) => (
                      <option key={data} value={data}>
                        {formatarData(data)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* ESCOLHA DE HORÁRIO (Só aparece se tiver escolhido o dia) */}
              {dataSelecionada && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Horários Disponíveis para {formatarData(dataSelecionada)}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {vagasNaDataSelecionada.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSlotSelecionado(slot)}
                        className={`py-2 px-1 rounded-lg border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1
                          ${
                            slotSelecionado?.id === slot.id
                              ? "bg-brand-500 border-brand-500 text-white shadow-md transform scale-105"
                              : "bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {slot.hora_inicio.substring(0, 5)}
                        </span>
                        {/* Se não escolheu profissional específico, mostra o nome de quem vai atender naquele horário */}
                        {!profissionalId && (
                          <span className="text-[9px] uppercase tracking-wider opacity-80">
                            {slot.profissionais.nome}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTÃO SUBMIT */}
              <div className="pt-4 mt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting || !slotSelecionado}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
