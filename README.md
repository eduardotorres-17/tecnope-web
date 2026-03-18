# 🦶 Tecnopé - Sistema de Agendamento e Gestão Clínica

> Uma plataforma Full Stack desenvolvida para automatizar o agendamento de consultas e a gestão de horários de uma clínica de podologia, eliminando atritos para o paciente e otimizando o tempo dos profissionais.

![Status do Projeto](https://img.shields.io/badge/Status-Produção-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 💻 Sobre o Projeto

O Tecnopé não é apenas uma Landing Page, mas um sistema completo de gestão de clínica (SaaS). Ele resolve o problema comum de "double booking" (reservas duplicadas) e automatiza o fluxo de comunicação via WhatsApp. 

O sistema é dividido em duas partes principais:
1. **Área Pública (Vitrine e Conversão):** Onde o paciente conhece os serviços e agenda seu horário de forma autônoma.
2. **Dashboard Administrativo (Área Restrita):** Onde os profissionais gerenciam sua agenda, geram novas vagas e controlam o ciclo de vida das consultas.

## ✨ Principais Funcionalidades

### Para o Paciente
- **Agendamento Inteligente:** O modal de agendamento filtra dinamicamente as datas e horários disponíveis com base no profissional escolhido.
- **Prevenção de Concorrência:** Vagas são trancadas em tempo real no banco de dados assim que selecionadas, evitando dupla reserva.
- **Redirecionamento Inteligente:** Botões dinâmicos que formatam mensagens prontas para o WhatsApp da clínica.

### Para a Clínica (Admin)
- **Autenticação Segura:** Painel protegido por JWT via Supabase Auth.
- **Gerador de Horários em Lote:** Motor que gera dezenas de *Time Slots* (vagas) automaticamente com base no intervalo de tempo escolhido pelo profissional.
- **Ciclo de Vida da Consulta:** Gestão de status (Pendente ➡️ Confirmado ➡️ Concluído ou Cancelado).
- **Liberação Automática:** Cancelar um agendamento libera o *slot* de tempo instantaneamente de volta para o site público.
- **Filtros de Visão:** Separação entre "Próximas Consultas" e "Histórico" para manter o painel limpo.

## 🏗️ Arquitetura e Regras de Negócio

O sistema utiliza o padrão de **Time Slots**. Em vez de permitir que o usuário digite qualquer data e hora (o que gera conflitos), a clínica gera os horários disponíveis (`horarios_disponiveis`). O front-end consulta essas vagas (`ocupado = false`) e as exibe para o paciente. Quando o agendamento é feito, uma transação ocorre: o agendamento é salvo e o slot é marcado como `ocupado = true`.

### Tecnologias Utilizadas
- **Front-end:** React.js, Vite, Tailwind CSS, Lucide React (Ícones).
- **Roteamento:** React Router DOM (com proteção de rotas privadas).
- **Back-end / BaaS:** Supabase (PostgreSQL, Auth, RLS).
- **Hospedagem:** Vercel.

## 🚀 Como Rodar o Projeto Localmente

1. Clone este repositório:
```bash
git clone [https://github.com/eduardotorres-17/tecnope-web.git](https://github.com/eduardotorres-17/tecnope-web.git)

2. Acesse a pasta do projeto:

Bash
cd tecnope-web
Instale as dependências:

Bash
npm install
Configure as Variáveis de Ambiente:
Crie um arquivo .env.local na raiz do projeto e insira suas credenciais do Supabase:

Snippet de código
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
Inicie o servidor de desenvolvimento:

Bash
npm run dev

👨‍💻 Autor Eduardo Bertinetti Torress

Portfólio: https://portfolio-eduardo-torres.vercel.app/

Email: eduardobtorres17@gmail.com
