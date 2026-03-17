import {
  CalendarDays,
  MapPin,
  Phone,
  Menu,
  X,
  CheckCircle2,
  Scissors,
  Feather,
  Activity,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Clock,
  ShieldPlus,
  Lock, // Importamos o cadeado para o Admin
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // Importamos o Link para a rota do Admin
import BookingModal from "../components/BookingModal";

// --- COMPONENTE DO NOVO LOGO VETORIAL ---
const LogoTecnope = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="12" fill="#14b8a6" />
    <path
      d="M12 14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14V16C28 17.1046 27.1046 18 26 18H22V26C22 27.1046 21.1046 28 20 28C18.8954 28 18 27.1046 18 26V18H14C12.8954 18 12 17.1046 12 16V14Z"
      fill="white"
    />
    <circle cx="26" cy="24" r="4" fill="#ccfbf1" opacity="0.8" />
  </svg>
);

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const numeroWhatsApp = "5553999342072";

  const servicos = [
    {
      id: 1,
      titulo: "Tratamento de Unha Encravada",
      descricao:
        "Alívio imediato e tratamento indolor para onicocriptose. Remoção da espícula e curativo especializado.",
      icone: <Scissors size={24} className="text-brand-500" />,
    },
    {
      id: 2,
      titulo: "Remoção de Calos e Calosidades",
      descricao:
        "Desbaste seguro e higiênico para devolver o conforto ao caminhar e a maciez da pele dos seus pés.",
      icone: <Feather size={24} className="text-brand-500" />,
    },
    {
      id: 3,
      titulo: "Podologia Preventiva",
      descricao:
        "Corte técnico das unhas, assepsia, hidratação e orientações para manter seus pés sempre saudáveis.",
      icone: <Sparkles size={24} className="text-brand-500" />,
    },
    {
      id: 4,
      titulo: "Cuidado com Pé Diabético",
      descricao:
        "Atenção redobrada e técnicas seguras exclusivas para pacientes diabéticos, prevenindo lesões e infecções.",
      icone: <ShieldCheck size={24} className="text-brand-500" />,
    },
    {
      id: 5,
      titulo: "Tratamento de Micoses",
      descricao:
        "Limpeza profunda e aplicação de produtos específicos para combater fungos nas unhas (onicomicose).",
      icone: <Activity size={24} className="text-brand-500" />,
    },
    {
      id: 6,
      titulo: "Órteses de Correção",
      descricao:
        "Aplicação de dispositivos para corrigir a curvatura da unha, evitando que ela volte a encravar.",
      icone: <HeartPulse size={24} className="text-brand-500" />,
    },
  ];

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50">
      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <LogoTecnope />
              <div>
                <h1 className="text-2xl font-bold text-brand-900 tracking-tight leading-none">
                  Tecnopé
                </h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Podologia Ana e Nei
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#servicos"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
              >
                Tratamentos
              </a>
              <a
                href="#sobre"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
              >
                A Clínica
              </a>
              <a
                href="#localizacao"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
              >
                Localização
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-brand-500/40 flex items-center gap-2"
              >
                <CalendarDays size={18} />
                Agendar Agora
              </button>
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-xl">
            <a
              href="#servicos"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-600 font-medium p-2"
            >
              Tratamentos
            </a>
            <a
              href="#sobre"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-600 font-medium p-2"
            >
              A Clínica
            </a>
            <a
              href="#localizacao"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-600 font-medium p-2"
            >
              Localização
            </a>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="bg-brand-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full mt-2"
            >
              <CalendarDays size={18} /> Agendar Agora
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 bg-slate-50">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-semibold mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
            </span>
            Especialistas em saúde dos pés em Bagé/RS
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Seus pés merecem <br className="hidden md:block" />
            <span className="text-brand-500">cuidado e tecnologia.</span>
          </h2>

          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            A <strong>Tecnopé (Podologia Ana e Nei)</strong> oferece tratamentos
            avançados e indolores para unhas encravadas, calosidades e saúde
            preventiva. Volte a caminhar com conforto e segurança.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 text-lg active:scale-95"
            >
              <CalendarDays size={20} />
              Marcar Consulta
            </button>
            <a
              href={`https://wa.me/${numeroWhatsApp}?text=Olá! Estava no site da Tecnopé e gostaria de tirar uma dúvida.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
            >
              <Phone size={20} className="text-brand-500" />
              Dúvidas?
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center md:justify-start gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-brand-500" />
              <span>Av. Mal. Floriano, Bagé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                  +
                </div>
              </div>
              <span>Pacientes atendidos</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg md:max-w-none relative">
          <div className="absolute inset-0 bg-brand-100 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
          {/* FOTO PRINCIPAL INSERIDA AQUI */}
          <div className="bg-slate-200 w-full aspect-square md:aspect-[4/3] rounded-[3rem] flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/p/AF1QipPKtpVhZFAbNaAUAmPJKnKlzC2ORPuBP1zBHgho=s680-w680-h510-rw"
              alt="Clínica Tecnopé Atendimento"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Ambiente
                </p>
                <p className="text-sm font-black text-slate-800">
                  100% Esterilizado
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="py-20 bg-white border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-3">
              Nossos Tratamentos
            </h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Cuidado especializado para cada necessidade dos seus pés
            </h2>
            <p className="text-slate-600 text-lg">
              Utilizamos técnicas modernas e materiais esterilizados para
              garantir saúde, conforto e bem-estar em todos os nossos
              procedimentos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all">
                  {servico.icone}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {servico.titulo}
                </h3>
                <p className="text-slate-600 leading-relaxed text-justify">
                  {servico.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE A CLÍNICA */}
      <section
        id="sobre"
        className="py-20 bg-brand-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-0 border-2 border-brand-400 rounded-3xl transform translate-x-4 translate-y-4"></div>
              {/* FOTO DA CLÍNICA / PROFISSIONAIS */}
              <div className="flex-1 w-full relative group">
                {/* Brilho de fundo suave (Glow effect) */}
                <div className="absolute inset-0 bg-brand-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                {/* Container da Imagem Limpo e Centralizado */}
                <div className="bg-brand-800 w-full aspect-square md:aspect-[4/5] rounded-3xl relative z-10 border-4 border-brand-700/50 shadow-2xl overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/p/AF1QipOoyNQDnaGU75hePK6Ngt_GbHP0IgNEAffFqYyw=s680-w680-h510-rw"
                    alt="Ana e Nei - Podólogos Tecnopé"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-brand-300 font-bold tracking-wide uppercase text-sm mb-3">
              Conheça a Clínica
            </h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Mãos que cuidam, <br className="hidden md:block" />
              tecnologia que transforma.
            </h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed text-justify">
              A <strong>Tecnopé</strong> nasceu da união da paixão pelo cuidado
              humano da Ana e do Nei. Com anos de experiência em podologia
              clínica, nosso objetivo é proporcionar alívio imediato e qualidade
              de vida para nossos pacientes na cidade de Bagé.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="bg-brand-800 p-2 rounded-lg">
                  <ShieldPlus size={20} className="text-brand-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Biossegurança Rigorosa
                  </h4>
                  <p className="text-brand-200 text-sm">
                    Materiais 100% esterilizados em autoclave (padrão
                    hospitalar) e descartáveis.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-brand-800 p-2 rounded-lg">
                  <HeartPulse size={20} className="text-brand-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Atendimento Humanizado
                  </h4>
                  <p className="text-brand-200 text-sm">
                    Entendemos a sua dor. O procedimento é feito com calma e
                    máximo conforto.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER & LOCALIZAÇÃO */}
      <footer
        id="localizacao"
        className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-brand-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <LogoTecnope size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-white leading-none">
                    Tecnopé
                  </h1>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                    Podologia Ana e Nei
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 text-justify">
                A referência em cuidados com a saúde e estética dos pés em
                Bagé/RS. Tratamentos avançados, sem dor e com total
                biossegurança.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                Atendimento
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <Clock size={18} className="text-brand-500" />
                  <div>
                    <p className="font-medium text-slate-200">
                      Segunda a Sexta
                    </p>
                    <p className="text-slate-400">
                      08:00 às 12:00 - 13:30 às 18:00
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Phone size={18} className="text-brand-500 mt-1" />
                  <div>
                    <p className="font-medium text-slate-200">
                      WhatsApp / Telefone
                    </p>
                    {/* Botão de WhatsApp no rodapé */}
                    <a
                      href={`https://wa.me/${numeroWhatsApp}?text=Olá! Gostaria de agendar uma consulta na Tecnopé.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:text-brand-400 font-bold transition-colors inline-block mt-1"
                    >
                      (53) 99934-2072 ↗
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                Onde Estamos
              </h3>
              <div className="flex items-start gap-3 text-sm mb-4">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400">
                    Av. Mal. Floriano, 2146 - ap. 01 <br />
                    Centro, Bagé - RS <br />
                    CEP: 96400-011
                  </p>
                  <a
                    href="https://maps.app.goo.gl/WAVcZHrNV4jQLhvR9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 hover:text-brand-400 text-xs font-bold uppercase tracking-wider mt-2 inline-block"
                  >
                    Ver no Google Maps ↗
                  </a>
                </div>
              </div>

              <div className="w-full h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4229.686892914661!2d-54.10929862351304!3d-31.31469069134412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9506756f9ba57c81%3A0x6a696392319ea8c3!2sPODOLOGIA%20ANA%20E%20NEI!5e1!3m2!1spt-BR!2sbr!4v1773688261330!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de localização da Tecnopé"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              © 2026 Tecnopé (Podologia Ana e Nei). Todos os direitos
              reservados.
            </p>
            <div className="flex items-center gap-6">
              {/* LINK DISCRETO PARA O PAINEL ADMIN */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 hover:text-brand-500 transition-colors"
              >
                <Lock size={12} />
                Acesso Restrito
              </Link>
              <p>Desenvolvido por Eduardo Bertinetti Torres</p>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
