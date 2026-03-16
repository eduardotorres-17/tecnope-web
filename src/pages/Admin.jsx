import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  LogOut,
  CalendarDays,
  Loader2,
  Check,
  X as CancelIcon,
  Clock,
} from "lucide-react";

export default function Admin() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assim que a página abre, vai buscar os dados
  useEffect(() => {
    buscarAgendamentos();
  }, []);

  const buscarAgendamentos = async () => {
    setLoading(true);
    // Olha a magia do Supabase aqui: ele já vai nas outras tabelas buscar o Título e o Nome!
    const { data, error } = await supabase
      .from("agendamentos")
      .select(
        `
        *,
        servicos ( titulo, duracao_minutos ),
        profissionais ( nome )
      `,
      )
      .order("data_agendamento", { ascending: true })
      .order("horario_inicio", { ascending: true });

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } else {
      setAgendamentos(data || []);
    }
    setLoading(false);
  };

  const atualizarStatus = async (id, novoStatus) => {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: novoStatus })
      .eq("id", id);

    if (!error) {
      // Se deu certo, atualiza a lista no ecrã sem precisar de dar F5
      buscarAgendamentos();
    } else {
      alert("Erro ao atualizar o estado. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Função auxiliar para formatar a data (Ex: 2026-03-20 -> 20/03/2026)
  const formatarData = (dataString) => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* --- NAVBAR DO ADMIN --- */}
      <nav className="bg-brand-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Tecnopé Admin</h1>
              <p className="text-xs text-brand-300">Painel de Agendamentos</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-brand-800 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-brand-500" />
            Agenda da Clínica
          </h2>
          <button
            onClick={buscarAgendamentos}
            className="text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-lg transition-colors text-sm font-semibold border border-brand-200"
          >
            Atualizar Lista
          </button>
        </div>

        {/* --- TABELA DE AGENDAMENTOS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-500">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-slate-500 font-medium">
                A carregar agendamentos...
              </p>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">
                Nenhum agendamento encontrado no sistema.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-semibold">Cliente</th>
                    <th className="p-4 font-semibold">Tratamento</th>
                    <th className="p-4 font-semibold">Data / Hora</th>
                    <th className="p-4 font-semibold">Profissional</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agendamentos.map((agendamento) => (
                    <tr
                      key={agendamento.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-bold text-slate-800">
                          {agendamento.cliente_nome}
                        </p>
                        <a
                          href={`https://wa.me/55${agendamento.cliente_telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-600 hover:underline"
                        >
                          {agendamento.cliente_telefone}
                        </a>
                      </td>

                      <td className="p-4">
                        <p className="text-sm font-medium text-slate-700">
                          {agendamento.servicos?.titulo}
                        </p>
                        <p className="text-xs text-slate-500">
                          Duração: {agendamento.servicos?.duracao_minutos} min
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium mb-1">
                          <CalendarDays size={16} className="text-slate-400" />
                          {formatarData(agendamento.data_agendamento)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <Clock size={16} className="text-slate-400" />
                          {agendamento.horario_inicio.substring(0, 5)}{" "}
                          {/* Mostra só HH:MM */}
                        </div>
                      </td>

                      <td className="p-4 text-sm font-medium text-slate-700">
                        {agendamento.profissionais?.nome || "Qualquer um"}
                      </td>

                      <td className="p-4">
                        {/* Etiqueta de Estado Dinâmica */}
                        {agendamento.status === "pendente" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            Pendente
                          </span>
                        )}
                        {agendamento.status === "confirmado" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Confirmado
                          </span>
                        )}
                        {agendamento.status === "cancelado" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            Cancelado
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {agendamento.status !== "confirmado" && (
                            <button
                              onClick={() =>
                                atualizarStatus(agendamento.id, "confirmado")
                              }
                              title="Confirmar Agendamento"
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-200"
                            >
                              <Check size={18} />
                            </button>
                          )}

                          {agendamento.status !== "cancelado" && (
                            <button
                              onClick={() =>
                                atualizarStatus(agendamento.id, "cancelado")
                              }
                              title="Cancelar Agendamento"
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200"
                            >
                              <CancelIcon size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
