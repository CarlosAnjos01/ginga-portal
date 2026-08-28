export const gingaStages = [
  { id: 1, name: "1. Leitura de Jogo", role: "Dono", focus: "Mercado, concorrência, objetivos e momento da empresa" },
  { id: 2, name: "2. Escalação", role: "Dono & Gestor", focus: "Equipe, papéis, liderança e processos comerciais" },
  { id: 3, name: "3. Posse de Bola", role: "Dono & Marketing", focus: "Marketing, geração de leads, marca e posicionamento" },
  { id: 4, name: "4. Troca de Passes", role: "Vendedor & Gestor", focus: "Atendimento, CRM, follow-up e qualificação" },
  { id: 5, name: "5. Finalização", role: "Vendedor & Financeiro", focus: "Taxa de conversão, propostas e fechamento" },
  { id: 6, name: "6. Placar", role: "Financeiro", focus: "KPIs, lucratividade, CAC, ROI e receita" },
  { id: 7, name: "7. Plano de Jogo", role: "Dono & Consultor", focus: "Prioridades, roadmap e plano de ação" }
];

export const fullQuestions = [
  // ETAPA 1 — LEITURA DE JOGO
  { id: 1, stageId: 1, text: "Como está o cenário do seu mercado hoje?", role: "Dono" },
  { id: 2, stageId: 1, text: "Quem são seus principais concorrentes e o que eles fazem diferente?", role: "Dono" },
  { id: 3, stageId: 1, text: "O que a empresa quer conquistar nos próximos 12 meses?", role: "Dono" },
  { id: 4, stageId: 1, text: "Em que momento/fase a empresa está (crescimento, estabilização, virada)?", role: "Dono" },
  { id: 5, stageId: 1, text: "O modelo de negócio atual sustenta o crescimento que você quer?", role: "Dono" },

  // ETAPA 2 — ESCALAÇÃO
  { id: 6, stageId: 2, text: "Quem compõe o time comercial hoje (quantidade, funções)?", role: "Dono & Gestor" },
  { id: 7, stageId: 2, text: "Cada pessoa está na posição certa pra render o que deveria?", role: "Dono & Gestor" },
  { id: 8, stageId: 2, text: "Existe liderança comercial clara — alguém com comando direto sobre resultado?", role: "Dono & Gestor" },
  { id: 9, stageId: 2, text: "Existem rotinas comerciais definidas, ou cada um faz do seu jeito?", role: "Dono & Gestor" },
  { id: 10, stageId: 2, text: "O time tem as ferramentas certas pra trabalhar (CRM, telefone, material de venda)?", role: "Dono & Gestor" },

  // ETAPA 3 — POSSE DE BOLA
  { id: 11, stageId: 3, text: "Como a empresa se comunica com o mercado hoje?", role: "Dono & Marketing" },
  { id: 12, stageId: 3, text: "De onde vêm os leads/oportunidades hoje?", role: "Dono & Marketing" },
  { id: 13, stageId: 3, text: "O posicionamento da marca atrai o cliente certo, ou repele?", role: "Dono & Marketing" },
  { id: 14, stageId: 3, text: "A empresa é vista como referência no que faz, ou como 'mais uma'?", role: "Dono & Marketing" },
  { id: 15, stageId: 3, text: "Quais canais de aquisição já foram testados, e quais realmente trazem resultado?", role: "Dono & Marketing" },

  // ETAPA 4 — TROCA DE PASSES
  { id: 16, stageId: 4, text: "O primeiro atendimento ao lead converte ou afasta?", role: "Vendedor & Gestor" },
  { id: 17, stageId: 4, text: "Existe CRM, ou o controle depende da memória de alguém?", role: "Vendedor & Gestor" },
  { id: 18, stageId: 4, text: "Qual o tempo médio de resposta a um novo contato?", role: "Vendedor & Gestor" },
  { id: 19, stageId: 4, text: "Os leads certos chegam pra pessoa certa dentro do time?", role: "Vendedor & Gestor" },
  { id: 20, stageId: 4, text: "Onde, no funil, mais se perde oportunidade (sem retorno, sem follow-up)?", role: "Vendedor & Gestor" },

  // ETAPA 5 — FINALIZAÇÃO
  { id: 21, stageId: 5, text: "Qual a taxa de conversão de proposta pra venda fechada, hoje?", role: "Vendedor & Financeiro" },
  { id: 22, stageId: 5, text: "As propostas são bem construídas e apresentadas, ou improvisadas?", role: "Vendedor & Financeiro" },
  { id: 23, stageId: 5, text: "Existe técnica de negociação, ou o caminho mais comum é dar desconto?", role: "Vendedor & Financeiro" },
  { id: 24, stageId: 5, text: "O ticket médio está no patamar que deveria estar?", role: "Vendedor & Financeiro" },
  { id: 25, stageId: 5, text: "O que mais trava o fechamento — preço, prazo, confiança, outro motivo?", role: "Vendedor & Financeiro" },

  // ETAPA 6 — PLACAR
  { id: 26, stageId: 6, text: "Quais indicadores comerciais são acompanhados hoje, de fato?", role: "Financeiro" },
  { id: 27, stageId: 6, text: "A empresa sabe, com clareza, se dá lucro ou só fatura?", role: "Financeiro" },
  { id: 28, stageId: 6, text: "Você sabe quanto custa adquirir um cliente novo (CAC)?", role: "Financeiro" },
  { id: 29, stageId: 6, text: "O investimento em comercial/marketing tem retorno mensurável?", role: "Financeiro" },
  { id: 30, stageId: 6, text: "A receita cresce de forma sustentável, ou em picos isolados?", role: "Financeiro" },

  // ETAPA 7 — PLANO DE JOGO
  { id: 31, stageId: 7, text: "Depois de tudo isso, o que você diria que é a prioridade número um?", role: "Dono" },
  { id: 32, stageId: 7, text: "O que a empresa já tentou resolver sozinha, sem sucesso?", role: "Dono" },
  { id: 33, stageId: 7, text: "Que resultado rápido (quick win) faria mais diferença nos próximos 30 dias?", role: "Dono" },
  { id: 34, stageId: 7, text: "Qual sua visão de crescimento pra empresa nos próximos 2 anos?", role: "Dono" }
];
