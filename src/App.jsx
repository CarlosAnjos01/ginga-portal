import { useState } from "react";
import "./index.css";
import { gingaStages, fullQuestions } from "./data/questionsFull";

const API_URL = "https://shy-dawn-31acdiagnostico-api.carlos-fe4.workers.dev/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login"); // login | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [leads, setLeads] = useState([]);
  const [adminTab, setAdminTab] = useState("leads");
  const [clientTab, setClientTab] = useState("questions");
  const [selectedStage, setSelectedStage] = useState(1);
  const [answers, setAnswers] = useState({});

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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
        setError(data.error || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor da API.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();

      if (data.success) {
        setMessage("Senha alterada com sucesso! Faça login com a nova senha.");
        setMode("login");
        setPassword(newPassword);
      } else {
        setError(data.error || "Erro ao alterar senha.");
      }
    } catch (err) {
      setError("Erro de conexão ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  async function impersonateClient(leadId) {
    try {
      const res = await fetch(`${API_URL}/admin/impersonate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      alert("Erro ao acessar portal do cliente.");
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

  // TELA DE LOGIN & ESQUECI MINHA SENHA
  if (!user) {
    return (
      <div className="app-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem 2rem" }}>
          <div className="brand" style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.75rem" }}>
            GINGA <span>AÍ</span> OS
          </div>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            {mode === "login" ? "Portal do Cliente & Área de Gestão" : "Recuperação de Senha"}
          </p>

          {message && (
            <div style={{ background: "#10B98120", border: "1px solid var(--success)", color: "var(--success)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ background: "#EF444420", border: "1px solid var(--danger)", color: "var(--danger)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <label className="field">
                <span>E-mail Corporativo *</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seuemail@empresa.com" />
              </label>
              <label className="field">
                <span>Senha *</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                <small style={{ color: "var(--text-muted)", marginTop: "0.2rem" }}>* No primeiro acesso, a senha digitada será registrada como sua senha oficial.</small>
              </label>
              <button className="primary-button" style={{ width: "100%", marginTop: "0.75rem" }} disabled={loading}>
                {loading ? "Autenticando..." : "Entrar no Portal"}
              </button>
              <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
                <button type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}>
                  Esqueci minha senha
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <label className="field">
                <span>Seu E-mail Cadastrado *</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seuemail@empresa.com" />
              </label>
              <label className="field">
                <span>Nova Senha *</span>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Digite a nova senha" />
              </label>
              <button className="primary-button" style={{ width: "100%", marginTop: "0.75rem" }} disabled={loading}>
                {loading ? "Alterando..." : "Redefinir Senha"}
              </button>
              <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
                <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", cursor: "pointer" }}>
                  Voltar para o Login
                </button>
              </div>
            </form>
          )}
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
        {/* VISÃO ADMIN */}
        {user.role === "admin" ? (
          <div>
            {adminTab === "leads" && (
              <div>
                <h2>Diagnósticos Recebidos</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>Leads do Raio-X Gratuito e controle de acesso direto ao portal.</p>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <table className="table">
                    <thead>
                      <tr><th>Empresa</th><th>Contato</th><th>E-mail</th><th>Score</th><th>Gargalo</th><th>Acesso Admin</th></tr>
                    </thead>
                    <tbody>
                      {leads.map(l => (
                        <tr key={l.id}>
                          <td><strong>{l.company_name}</strong></td>
                          <td>{l.contact_name}</td>
                          <td>{l.email}</td>
                          <td style={{ color: "var(--primary)", fontWeight: "900" }}>{l.overall_score}%</td>
                          <td><span style={{ background: "#EF444420", color: "var(--danger)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.8rem", fontWeight: 700 }}>{l.gap_dimension}</span></td>
                          <td>
                            <button className="primary-button" style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "var(--surface-card)", border: "1px solid var(--border)" }} onClick={() => impersonateClient(l.id)}>
                              👁️ Acessar Portal
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {adminTab === "clients" && (
              <div className="card">
                <h2>Projetos em Imersão Ativos</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Gestão dos relatórios de R$ 2.000,00.</p>
              </div>
            )}
          </div>
        ) : (
          /* VISÃO CLIENTE PAGO (/portal) */
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <h2>Imersão Comercial Ginga — {user.company}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Acompanhe as respostas das 7 etapas da Metodologia Ginga e a Matriz Priorizada.</p>
            </div>

            <div className="nav-tabs">
              <button className={`tab-btn ${clientTab === "questions" ? "active" : ""}`} onClick={() => setClientTab("questions")}>1. Questões da Imersão (7 Etapas)</button>
              <button className={`tab-btn ${clientTab === "matrix" ? "active" : ""}`} onClick={() => setClientTab("matrix")}>2. Matriz Impacto x Esforço</button>
              <button className={`tab-btn ${clientTab === "roadmap" ? "active" : ""}`} onClick={() => setClientTab("roadmap")}>3. Plano 30/60/90 Dias</button>
            </div>

            {clientTab === "questions" && (
              <div>
                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
                  {gingaStages.map(stg => (
                    <button key={stg.id} onClick={() => setSelectedStage(stg.id)} style={{ padding: "0.65rem 1rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: selectedStage === stg.id ? "var(--primary)" : "var(--surface)", color: selectedStage === stg.id ? "#FFF" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {stg.name}
                    </button>
                  ))}
                </div>
                <div className="card">
                  <h3 style={{ color: "var(--primary)" }}>{gingaStages.find(s => s.id === selectedStage)?.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                    Papéis envolvidos: <strong>{gingaStages.find(s => s.id === selectedStage)?.role}</strong> | Foco: {gingaStages.find(s => s.id === selectedStage)?.focus}
                  </p>
                  {fullQuestions.filter(q => q.stageId === selectedStage).map((q, idx) => (
                    <div key={q.id} className="field" style={{ marginBottom: "1.5rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{idx + 1}. {q.text} <small style={{ color: "var(--primary)" }}>({q.role})</small></span>
                      <textarea rows="3" placeholder="Registrar resposta do cliente/time..." value={answers[q.id] || ""} onChange={e => setAnswers({...answers, [q.id]: e.target.value})} />
                    </div>
                  ))}
                  <button className="primary-button" onClick={() => alert("Respostas salvas!")}>Salvar Respostas</button>
                </div>
              </div>
            )}

            {clientTab === "matrix" && (
              <div className="card">
                <h3>Matriz de Impacto x Esforço — Priorização de Gargalos</h3>
                <div className="matrix-grid">
                  <div className="matrix-quadrant" style={{ borderColor: "var(--success)" }}>
                    <div className="quadrant-title" style={{ color: "var(--success)" }}><span>⚡ Quick Wins</span><small>Alto Impacto / Baixo Esforço</small></div>
                    <div className="item-badge"><strong>SLA Primeiro Atendimento</strong><p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Etapa 4</p></div>
                  </div>
                  <div className="matrix-quadrant" style={{ borderColor: "var(--primary)" }}>
                    <div className="quadrant-title" style={{ color: "var(--primary)" }}><span>🚀 Projetos Estratégicos</span><small>Alto Impacto / Alto Esforço</small></div>
                    <div className="item-badge"><strong>CRM Kommo & Playbook</strong><p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Etapa 2 e 4</p></div>
                  </div>
                  <div className="matrix-quadrant" style={{ borderColor: "var(--warning)" }}>
                    <div className="quadrant-title" style={{ color: "var(--warning)" }}><span>📋 Tarefas Secundárias</span><small>Baixo Impacto / Baixo Esforço</small></div>
                    <div className="item-badge"><strong>Padronização de Propostas</strong><p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Etapa 5</p></div>
                  </div>
                  <div className="matrix-quadrant" style={{ borderColor: "var(--danger)" }}>
                    <div className="quadrant-title" style={{ color: "var(--danger)" }}><span>🛑 Descartar / Evitar</span><small>Baixo Impacto / Alto Esforço</small></div>
                    <div className="item-badge"><strong>Mudança de ERP Financeiro</strong><p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Etapa 6</p></div>
                  </div>
                </div>
              </div>
            )}

            {clientTab === "roadmap" && (
              <div className="card">
                <h3>Plano de Ação 30 / 60 / 90 Dias</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--primary)" }}>
                    <strong style={{ color: "var(--primary)" }}>FASE 1 — 30 DIAS (Alinhamento & Quick Wins)</strong>
                  </div>
                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--warning)" }}>
                    <strong style={{ color: "var(--warning)" }}>FASE 2 — 60 DIAS (Processo & CRM)</strong>
                  </div>
                  <div style={{ background: "var(--bg)", padding: "1rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--success)" }}>
                    <strong style={{ color: "var(--success)" }}>FASE 3 — 90 DIAS (Gestão & Escala)</strong>
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
