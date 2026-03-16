import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase"; // Importa a nossa conexão com o banco

export default function BookingModal({ isOpen, onClose }) {
  // Estados para guardar os dados que vêm do banco
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  
  // Estados de controle da interface
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // useEffect: Toda vez que o modal abrir, ele vai no Supabase buscar os dados
  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen]);

  async function carregarDados() {
    setIsLoading(true);
    try {
      // Busca os serviços
      const { data: dadosServicos } = await supabase.from('servicos').select('*').order('titulo');
      if (dadosServicos) setServicos(dadosServicos);

      // Busca os profissionais ativos
      const { data: dadosProfissionais } = await supabase.from('profissionais').select('*').eq('ativo', true);
      if (dadosProfissionais) setProfissionais(dadosProfissionais);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Função disparada ao clicar em "Confirmar Agendamento"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const novoAgendamento = {
      cliente_nome: formData.get('nome'),
      cliente_telefone: formData.get('telefone'),
      servico_id: parseInt(formData.get('servico')),
      profissional_id: parseInt(formData.get('profissional')),
      data_agendamento: formData.get('data'),
      horario_inicio: formData.get('horario'),
      status: 'pendente'
    };

    // Insere o agendamento no Supabase
    const { error } = await supabase.from('agendamentos').insert([novoAgendamento]);

    setIsSubmitting(false);

    if (error) {
      alert("Erro ao agendar. Tente novamente ou chame no WhatsApp.");
      console.error(error);
    } else {
      setSuccess(true);
      // Fecha o modal automaticamente após 3 segundos
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }
  };

  // Se o modal não estiver aberto, não renderiza nada na tela
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        
        {/* Cabeçalho do Modal */}
        <div className="bg-brand-500 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Solicitar Agendamento</h2>
          <button onClick={onClose} className="hover:bg-brand-600 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            // Tela de carregamento enquanto busca do banco
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-brand-500">
              <Loader2 size={40} className="animate-spin" />
              <p className="font-medium text-slate-500">Carregando horários...</p>
            </div>
          ) : success ? (
            // Tela de Sucesso
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Tudo Certo!</h3>
              <p className="text-slate-600">Sua solicitação foi enviada. A Ana ou o Nei vão te chamar no WhatsApp para confirmar!</p>
            </div>
          ) : (
            // Formulário Oficial
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Seu Nome Completo</label>
                  <input type="text" name="nome" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="Ex: Maria Silva" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp (com DDD)</label>
                  <input type="tel" name="telefone" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="(53) 99999-9999" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Qual Tratamento?</label>
                <select name="servico" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white">
                  <option value="">Selecione um serviço...</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.titulo} (~{s.duracao_minutos} min)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Profissional de Preferência</label>
                <select name="profissional" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white">
                  <option value="">Sem preferência (Qualquer um)</option>
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>Podólogo(a) {p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Data de Preferência</label>
                  <input type="date" name="data" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Horário Base</label>
                  <input type="time" name="horario" required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirmar Solicitação"}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}