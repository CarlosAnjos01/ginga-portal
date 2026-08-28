import { useState, useEffect } from "react";
import "./index.css";
import { gingaStages, fullQuestions } from "./data/questionsFull";

const API_URL = "https://shy-dawn-31acdiagnostico-api.carlos-fe4.workers.dev/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingAnswers, setSavingAnswers] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [leads, setLeads] = useState([]);
  const [adminTab, setAdminTab] = useState("leads");
  const [clientTab, setClientTab] = useState("questions");
  const [selectedStage, setSelectedStage] = useState(1);
  const [answers, setAnswers] = useState({});

  // ESTADOS DA MATRIZ E ROADMAP DINÂMICOS
  const [matrixItems, setMatrixItems] = useState([]);
  const [newMatrixTitle, setNewMatrixTitle] = useState("");
  const [newMatrixDesc, setNewMatrixDesc] = useState("");
  const [newMatrixQuadrant, setNewMatrixQuadrant] = useState("quick_win");

  const [roadmapItems, setRoadmapItems] = useState([]);
  const [newRoadmapTask, setNewRoadmapTask] = useState("");
  const [newRoadmapPhase, setNewRoadmapPhase] = useState(30);

  useEffect(() => {
    if (user && user.id) {
      loadImmersionAnswers(user.id);
      loadMatrix(user.id);
      loadRoadmap(user.id);
    }
  }, [user]);

  async function loadImmersionAnswers(diagnosticId) {
    try {
      const res = await fetch(`${API_URL}/immersion/answers?diagnostic_id=${diagnosticId}`);
      const data = await res.json();
      if (data.success && data.answers) setAnswers(data.answers);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveImmersionAnswers() {
    if (!user || !user.id) return;
    setSavingAnswers(true);
    try {
      const res = await fetch(`${API_URL}/immersion/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostic_id: user.id, answers })
      });
      const data = await res.json();
      if (data.success) alert("Respostas salvas no banco!");
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setSavingAnswers(false);
    }
  }

  // MATRIZ D1
  async function loadMatrix(diagnosticId) {
    try {
      const res = await fetch(`${API_URL}/matrix?diagnostic_id=${diagnosticId}`);
      const data = await res.json();
      if (data.success) setMatrixItems(data.matrix);
    } catch (err) { console.error(err); }
  }

  async function addMatrixItem(e) {
    e.preventDefault();
    if (!newMatrixTitle || !user) return;
    try {
      const res = await fetch(`${API_URL}/matrix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostic_id: user.id, title: newMatrixTitle, description: newMatrixDesc, quadrant: newMatrixQuadrant })
      });
      const data = await res.json();
      if (data.success) {
        setNewMatrixTitle("");
        setNewMatrixDesc("");
        loadMatrix(user.id);
      }
    } catch (err) { alert("Erro ao adicionar item."); }
  }

  async function deleteMatrixItem(id) {
    try {
      await fetch(`${API_URL}/matrix?id=${id}`, { method: "DELETE" });
      loadMatrix(user.id);
    } catch (err) { alert("Erro ao remover."); }
  }

  // ROADMAP D1
  async function loadRoadmap(diagnosticId) {
    try {
      const res = await fetch(`${API_URL}/roadmap?diagnostic_id=${diagnosticId}`);
      const data = await res.json();
      if (data.success) setRoadmapItems(data.roadmap);
    } catch (err) { console.error(err); }
  }

  async function addRoadmapItem(e) {
    e.preventDefault();
    if (!newRoadmapTask || !user) return;
    try {
      const res = await fetch(`${API_URL}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostic_id: user.id, phase: parseInt(newRoadmapPhase), task: newRoadmapTask, status: "pending" })
      });
      const data = await res.json();
      if (data.success) {
        setNewRoadmapTask("");
        loadRoadmap(user.id);
      }
    } catch (err) { alert("Erro ao adicionar tarefa."); }
  }

  async function deleteRoadmapItem(id) {
    try {
      await fetch(`${API_URL}/roadmap?id=${id}`, { method: "DELETE" });
      loadRoadmap(user.id);
    } catch (err) { alert("Erro ao remover."); }
  }

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
        setMessage("Senha alterada com sucesso!");
        setMode("login");
        setPassword(newPassword);
      } else {
        setError(data.error || "Erro ao alterar senha.");
      }
    } catch (err) {
      setError("Erro de conexão.");
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
      alert("Erro ao acessar portal.");
    }
  }

  async function fetchLeads() {
    try {
      const res = await fetch(`${API_URL}/admin/leads`);
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch (err) {
      console.error(err);
    }
  }

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

          {message && <div style={{ background: "#10B98120", border: "1px solid var(--success)", color: "var(--success)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>{message}</div>}
          {error && <div style={{ background: "#EF444420", border: "1px solid var(--danger)", color: "var(--danger)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <label className="field">
                <span>E-mail Corporativo *</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seuemail@empresa.com" />
              </label>
              <label className="field">
                <span>Senha *</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
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
        {user.role === "admin" ? (
          <div>
            {adminTab === "leads" && (
              <div>
                <h2>Diagnósticos Recebidos</h2>
                <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: "1rem" }}>
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
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Use o botão 👁️ Acessar Portal na lista de leads para editar a Matriz e o Plano de qualquer cliente.</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h2>Imersão Comercial Ginga — {user.company}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Acompanhe os entregáveis do Diagnóstico Comercial de R$ 2.000,00.</p>
              </div>
              <button 
                className="primary-button" 
                style={{ background: "var(--surface-card)", border: "1px solid var(--border)", fontSize: "0.8rem" }}
                onClick={() => window.print()}
              >
                📄 Exportar PDF / Imprimir
              </button>
            </div>

            <div className="nav-tabs">
              <button className={`tab-btn ${clientTab === "questions" ? "active" : ""}`} onClick={() => setClientTab("questions")}>1. Questões da Imersão (7 Etapas)</button>
              <button className={`tab-btn ${clientTab === "matrix" ? "active" : ""}`} onClick={() => setClientTab("matrix")}>2. Matriz Impacto x Esforço</button>
              <button className={`tab-btn ${clientTab === "roadmap" ? "active" : ""}`} onClick={() => setClientTab("roadmap")}>3. Plano 30/60/90 Dias</button>
            </div>

            {/* ABA 1: 7 ETAPAS */}
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
                  <button className="primary-button" onClick={saveImmersionAnswers} disabled={savingAnswers}>
                    {savingAnswers ? "Gravando no Banco..." : "Salvar Respostas"}
                  </button>
                </div>
              </div>
            )}

            {/* ABA 2: MATRIZ DINÂMICA */}
            {clientTab === "matrix" && (
              <div>
                <div className="card" style={{ marginBottom: "1.5rem", borderStyle: "dashed" }}>
                  <h4 style={{ color: "var(--primary)", marginBottom: "1rem" }}>➕ Adicionar Item na Matriz (Consultor Ginga)</h4>
                  <form onSubmit={addMatrixItem} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <label className="field">
                      <span>Título do Achado / Ação *</span>
                      <input value={newMatrixTitle} onChange={e => setNewMatrixTitle(e.target.value)} required placeholder="Ex: Definir SLA do 1º Atendimento" />
                    </label>
                    <label className="field">
                      <span>Quadrante da Matriz *</span>
                      <select value={newMatrixQuadrant} onChange={e => setNewMatrixQuadrant(e.target.value)}>
                        <option value="quick_win">⚡ Quick Win (Alto Impacto / Baixo Esforço)</option>
                        <option value="strategic">🚀 Projeto Estratégico (Alto Impacto / Alto Esforço)</option>
                        <option value="secondary">📋 Tarefa Secundária (Baixo Impacto / Baixo Esforço)</option>
                        <option value="avoid">🛑 Evitar / Descartar (Baixo Impacto / Alto Esforço)</option>
                      </select>
                    </label>
                    <label className="field" style={{ gridColumn: "span 2" }}>
                      <span>Descrição / Detalhe</span>
                      <input value={newMatrixDesc} onChange={e => setNewMatrixDesc(e.target.value)} placeholder="Detalhes do que deve ser feito" />
                    </label>
                    <button className="primary-button" style={{ gridColumn: "span 2" }}>Adicionar à Matriz</button>
                  </form>
                </div>

                <div className="card">
                  <h3>Matriz de Impacto x Esforço — {user.company}</h3>
                  <div className="matrix-grid">
                    <div className="matrix-quadrant" style={{ borderColor: "var(--success)" }}>
                      <div className="quadrant-title" style={{ color: "var(--success)" }}><span>⚡ Quick Wins</span><small>Alto Impacto / Baixo Esforço</small></div>
                      {matrixItems.filter(i => i.quadrant === 'quick_win').map(item => (
                        <div key={item.id} className="item-badge" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{item.title}</strong>
                            {item.description && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>}
                          </div>
                          <button onClick={() => deleteMatrixItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: 700 }}>✕</button>
                        </div>
                      ))}
                    </div>

                    <div className="matrix-quadrant" style={{ borderColor: "var(--primary)" }}>
                      <div className="quadrant-title" style={{ color: "var(--primary)" }}><span>🚀 Projetos Estratégicos</span><small>Alto Impacto / Alto Esforço</small></div>
                      {matrixItems.filter(i => i.quadrant === 'strategic').map(item => (
                        <div key={item.id} className="item-badge" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{item.title}</strong>
                            {item.description && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>}
                          </div>
                          <button onClick={() => deleteMatrixItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: 700 }}>✕</button>
                        </div>
                      ))}
                    </div>

                    <div className="matrix-quadrant" style={{ borderColor: "var(--warning)" }}>
                      <div className="quadrant-title" style={{ color: "var(--warning)" }}><span>📋 Tarefas Secundárias</span><small>Baixo Impacto / Baixo Esforço</small></div>
                      {matrixItems.filter(i => i.quadrant === 'secondary').map(item => (
                        <div key={item.id} className="item-badge" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{item.title}</strong>
                            {item.description && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>}
                          </div>
                          <button onClick={() => deleteMatrixItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: 700 }}>✕</button>
                        </div>
                      ))}
                    </div>

                    <div className="matrix-quadrant" style={{ borderColor: "var(--danger)" }}>
                      <div className="quadrant-title" style={{ color: "var(--danger)" }}><span>🛑 Descartar / Evitar</span><small>Baixo Impacto / Alto Esforço</small></div>
                      {matrixItems.filter(i => i.quadrant === 'avoid').map(item => (
                        <div key={item.id} className="item-badge" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{item.title}</strong>
                            {item.description && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>}
                          </div>
                          <button onClick={() => deleteMatrixItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: 700 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: PLANO 30/60/90 DINÂMICO */}
            {clientTab === "roadmap" && (
              <div>
                <div className="card" style={{ marginBottom: "1.5rem", borderStyle: "dashed" }}>
                  <h4 style={{ color: "var(--primary)", marginBottom: "1rem" }}>➕ Adicionar Tarefa ao Plano (Consultor Ginga)</h4>
                  <form onSubmit={addRoadmapItem} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <label className="field">
                      <span>Descrição da Tarefa *</span>
                      <input value={newRoadmapTask} onChange={e => setNewRoadmapTask(e.target.value)} required placeholder="Ex: Configurar etapas do funil no Kommo" />
                    </label>
                    <label className="field">
                      <span>Fase de Execução *</span>
                      <select value={newRoadmapPhase} onChange={e => setNewRoadmapPhase(e.target.value)}>
                        <option value={30}>Fase 1 — Primeiro Mês (30 Dias)</option>
                        <option value={60}>Fase 2 — Segundo Mês (60 Dias)</option>
                        <option value={90}>Fase 3 — Terceiro Mês (90 Dias)</option>
                      </select>
                    </label>
                    <button className="primary-button" style={{ gridColumn: "span 2" }}>Adicionar ao Roadmap</button>
                  </form>
                </div>

                <div className="card">
                  <h3>Plano de Ação 30 / 60 / 90 Dias</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
                    <div style={{ background: "var(--bg)", padding: "1.25rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--primary)" }}>
                      <strong style={{ color: "var(--primary)", fontSize: "1.05rem" }}>FASE 1 — 30 DIAS (Alinhamento & Quick Wins)</strong>
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {roadmapItems.filter(r => r.phase === 30).map(item => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "0.65rem 1rem", borderRadius: "0.375rem" }}>
                            <span style={{ fontSize: "0.9rem" }}>• {item.task}</span>
                            <button onClick={() => deleteRoadmapItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "var(--bg)", padding: "1.25rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--warning)" }}>
                      <strong style={{ color: "var(--warning)", fontSize: "1.05rem" }}>FASE 2 — 60 DIAS (Processo & CRM)</strong>
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {roadmapItems.filter(r => r.phase === 60).map(item => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "0.65rem 1rem", borderRadius: "0.375rem" }}>
                            <span style={{ fontSize: "0.9rem" }}>• {item.task}</span>
                            <button onClick={() => deleteRoadmapItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: "var(--bg)", padding: "1.25rem", borderRadius: "0.375rem", borderLeft: "4px solid var(--success)" }}>
                      <strong style={{ color: "var(--success)", fontSize: "1.05rem" }}>FASE 3 — 90 DIAS (Gestão & Escala)</strong>
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {roadmapItems.filter(r => r.phase === 90).map(item => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "0.65rem 1rem", borderRadius: "0.375rem" }}>
                            <span style={{ fontSize: "0.9rem" }}>• {item.task}</span>
                            <button onClick={() => deleteRoadmapItem(item.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
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
