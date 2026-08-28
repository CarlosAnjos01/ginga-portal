import { useState } from "react";
import "./index.css";
import { gingaStages, fullQuestions } from "./data/questionsFull";

const API_URL = "https://shy-dawn-31acdiagnostico-api.carlos-fe4.workers.dev/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  
  // NAVEGAÇÃO INTERNA
  const [adminTab, setAdminTab] = useState("leads");
  const [clientTab, setClientTab] = useState("questions");
  const [selectedStage, setSelectedStage] = useState(1);
  const [answers, setAnswers] = useState({});

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (data.user.role === "admin") fetchLeads();
      } else {
        setError(data.error || "E-mail ou senha não encontrados.");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor da API.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLeads() {
    try {
      const res = await fetch(`${API_URL}/admin/leads`);
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    }
  }

  // LOGIN
  if (!user) {
    return (
      <div className="app-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem 2rem" }}>
          <div className="brand" style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.75rem" }}>
            GINGA <span>AÍ</span> OS
          </div>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            Portal do Cliente & Gestão de Imersão
          </p>
          <form onSubmit={handleLogin}>
            <label className="field">
              <span>E-mail de Acesso *</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seuemail@empresa.com" />
            </label>
            <label className="field">
              <span>Senha *</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </label>
            {error && <div style={{ background: "#EF444420", border: "1px solid var(--danger)", color: "var(--danger)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}
            <button className="primary-button" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Autenticando..." : "Entrar no Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div className="brand">GINGA <span>AÍ</span> OS</div>
          {user.role === "admin" && (
            <nav style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setAdminTab("leads")} style={{ background: "none", border: "none", color: adminTab === "leads" ? "var(--primary)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer" }}>Leads Capturados</button>
              <button onClick={() => setAdminTab("clients")} style={{ background: "none", border: "none", color: adminTab === "clients" ? "var(--primary)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer" }}>Clientes Pagantes</button>
            </nav>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 700 }}>{user.name}</span>
            <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.company} ({user.role.toUpperCase()})</span>
          </div>
          <button className="primary-button" style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem", background: "var(--surface-card)" }} onClick={() => setUser(null)}>Sair</button>
        </div>
      </header>

      <main>
        {/* TELA ADMIN */}
        {user.role === "admin" ? (
          <div>
            {adminTab === "leads" && (
              <div>
                <h2>Diagnósticos Recebidos</h2>
                <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: "1rem" }}>
                  <table className="table">
                    <thead>
                      <tr><th>Empresa</th><th>Contato</th><th>E-mail</th><th>Score</th><th>Gargalo Principal</th></tr>
                    </thead>
                    <tbody>
                      {leads.map(l => (
                        <tr key={l.id}>
                          <td><strong>{l.company_name}</strong></td>
                          <td>{l.contact_name}</td>
                          <td>{l.email}</td>
                          <td style={{ color: "var(--primary)", fontWeight: "900" }}>{l.overall_score}%</td>
                          <td><span style={{ background: "#EF444420", color: "var(--danger)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.8rem", fontWeight: 700 }}>{l.gap_dimension}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {adminTab === "clients" && (
              <div className="card">
                <h2>Projetos de Imersão Ativos</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Acompanhe e preencha o roteiro das 7 Etapas dos clientes pagantes.</p>
              </div>
            )}
          </div>
        ) : (
          /* TELA CLIENTE PAGO (/portal) */
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <h2>Imersão Comercial Ginga — {user.company}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Acompanhe as respostas das 7 etapas da Metodologia Ginga e a Matriz Priorizada.</p>
            </div>

            {/* ABAS DO CLIENTE */}
            <div className="nav-tabs">
              <button className={`tab-btn ${clientTab === "questions" ? "active" : ""}`} onClick={() => setClientTab("questions")}>
                1. Questões da Imersão (7 Etapas)
              </button>
              <button className={`tab-btn ${clientTab === "matrix" ? "active" : ""}`} onClick={() => setClientTab("matrix")}>
                2. Matriz Impacto x Esforço
              </button>
              <button className={`tab-btn ${clientTab === "roadmap" ? "active" : ""}`} onClick={() => setClientTab("roadmap")}>
                3. Plano 30/60/90 Dias
              </button>
            </div>

            {/* ABA 1: PERGUNTAS DAS 7 ETAPAS */}
            {clientTab === "questions" && (
              <div>
                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
                  {gingaStages.map(stg => (
                    <button
                      key={stg.id}
                      onClick={() => setSelectedStage(stg.id)}
                      style={{
                        padding: "0.65rem 1rem",
                        borderRadius: "0.375rem",
                        border: "1px solid var(--border)",
                        background: selectedStage === stg.id ? "var(--primary)" : "var(--surface)",
                        color: selectedStage === stg.id ? "#FFF" : "var(--text-muted)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        cursor: "pointer"
                      }}
                    >
                      {stg.name}
                    </button>
                  ))}
                </div>

                <div className="card">
                  <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                    <h3 style={{ color: "var(--primary)" }}>{gingaStages.find(s => s.id === selectedStage)?.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      Papéis envolvidos: <strong>{gingaStages.find(s => s.id === selectedStage)?.role}</strong> | Foco: {gingaStages.find(s => s.id === selectedStage)?.focus}
                    </p>
                  </div>

                  {fullQuestions.filter(q => q.stageId === selectedStage).map((q, idx) => (
                    <div key={q.id} className="field" style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>
                        {idx + 1}. {q.text} <small style={{ color: "var(--primary)" }}>({q.role})</small>
                      </span>
                      <textarea
                        rows="3"
                        placeholder="Registrar resposta do cliente/time..."
                        value={answers[q.id] || ""}
                        onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                      />
                    </div>
                  ))}
                  <button className="primary-button" onClick={() => alert("Respostas salvas com sucesso!")}>
                    Salvar Respostas da Etapa
                  </button>
                </div>
              </div>
            )}

            {/* ABA 2: MATRIZ DE IMPACTO X ESFORÇO */}
            {clientTab === "matrix" && (
              <div>
                <div className="card">
                  <h3>Matriz de Impacto x Esforço — Priorização de Gargalos</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Cruzamento dos gargalos levantados nas 7 etapas organizados por prioridade de execução.
                  </p>

                  <div className="matrix-grid">
                    {/* QUICK WINS */}
                    <div className="matrix-quadrant" style={{ borderColor: "var(--success)" }}>
                      <div className="quadrant-title" style={{ color: "var(--success)" }}>
                        <span>⚡ Quick Wins (Ganhos Rápidos)</span>
                        <small style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Alto Impacto / Baixo Esforço</small>
                      </div>
                      <div className="item-badge">
                        <strong>Definição de SLA no Primeiro Atendimento</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 4 — Reduzir tempo de resposta aos novos leads.</p>
                      </div>
                      <div className="item-badge">
                        <strong>Script de Abordagem para Negociação</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 5 — Eliminar concessão desnecessária de descontos.</p>
                      </div>
                    </div>

                    {/* PROJETOS ESTRATÉGICOS */}
                    <div className="matrix-quadrant" style={{ borderColor: "var(--primary)" }}>
                      <div className="quadrant-title" style={{ color: "var(--primary)" }}>
                        <span>🚀 Projetos Estratégicos</span>
                        <small style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Alto Impacto / Alto Esforço</small>
                      </div>
                      <div className="item-badge">
                        <strong>Implantação e Configuração Completa de CRM (Kommo)</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 4 — Eliminar dependência de planilhas/memória.</p>
                      </div>
                      <div className="item-badge">
                        <strong>Estruturação do Playbook Comercial e ICP</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 2 — Desenhar processo antes da ferramenta.</p>
                      </div>
                    </div>

                    {/* TAREFAS SECUNDÁRIAS */}
                    <div className="matrix-quadrant" style={{ borderColor: "var(--warning)" }}>
                      <div className="quadrant-title" style={{ color: "var(--warning)" }}>
                        <span>📋 Tarefas Secundárias</span>
                        <small style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Baixo Impacto / Baixo Esforço</small>
                      </div>
                      <div className="item-badge">
                        <strong>Ajustes de Apresentação Proposta PDF</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 5 — Padronizar visual das propostas.</p>
                      </div>
                    </div>

                    {/* EVITAR / DESCARTAR */}
                    <div className="matrix-quadrant" style={{ borderColor: "var(--danger)" }}>
                      <div className="quadrant-title" style={{ color: "var(--danger)" }}>
                        <span>🛑 Descartar / Evitar Agora</span>
                        <small style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Baixo Impacto / Alto Esforço</small>
                      </div>
                      <div className="item-badge">
                        <strong>Troca de Software Financeiro Global</strong>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Etapa 6 — Pouco ganho comercial no momento.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: ROADMAP 30/60/90 DIAS */}
            {clientTab === "roadmap" && (
              <div className="card">
                <h3>Plano de Ação 30 / 60 / 90 Dias</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.2rem", marginBottom: "1.5rem" }}>
                  Roadmap de execução contínua para colocar o processo comercial de pé.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--primary)" }}>
                    <strong style={{ color: "var(--primary)" }}>FASE 1 — 30 DIAS (Alinhamento & Quick Wins)</strong>
                    <ul style={{ marginLeft: "1.25rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <li>Formalização do ICP e proposta de valor clara.</li>
                      <li>Definição do tempo máximo de resposta a leads.</li>
                      <li>Eliminação de descontos sem aprovação prévia.</li>
                    </ul>
                  </div>

                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--warning)" }}>
                    <strong style={{ color: "var(--warning)" }}>FASE 2 — 60 DIAS (Processo & CRM)</strong>
                    <ul style={{ marginLeft: "1.25rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <li>Configuração e parametrização do CRM Kommo.</li>
                      <li>Desenho das etapas do funil de vendas e gatilhos de passagem.</li>
                      <li>Treinamento prático da equipe de vendas nas rotinas.</li>
                    </ul>
                  </div>

                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--success)" }}>
                    <strong style={{ color: "var(--success)" }}>FASE 3 — 90 DIAS (Gestão por Dados & Escala)</strong>
                    <ul style={{ marginLeft: "1.25rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <li>Acompanhamento semanal de taxa de conversão e ciclo de vendas.</li>
                      <li>Autonomia da liderança comercial sem dependência do dono.</li>
                      <li>Revisão final do Placar e consolidação do processo.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
