import { useState, useEffect } from "react";
import "./index.css";

const API_URL = "https://shy-dawn-31acdiagnostico-api.carlos-fe4.workers.dev/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("leads");

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
        if (data.user.role === "admin") {
          fetchLeads();
        }
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
      console.error("Erro ao carregar lista de leads:", err);
    }
  }

  // TELA DE LOGIN UNIFICADA (/login)
  if (!user) {
    return (
      <div className="app-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem 2rem" }}>
          <div className="brand" style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.75rem" }}>
            GINGA <span>AÍ</span> OS
          </div>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            Portal de Gestão & Área do Cliente
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
            {error && (
              <div style={{ background: "#EF444420", border: "1px solid var(--danger)", color: "var(--danger)", padding: "0.65rem", borderRadius: "0.375rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}
            <button className="primary-button" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Autenticando..." : "Entrar no Sistema"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* NAVEGAÇÃO SUPERIOR */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div className="brand">GINGA <span>AÍ</span> OS</div>
          {user.role === "admin" && (
            <nav style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => setActiveTab("leads")} 
                style={{ background: "none", border: "none", color: activeTab === "leads" ? "var(--primary)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
              >
                Leads Capturados
              </button>
              <button 
                onClick={() => setActiveTab("clients")} 
                style={{ background: "none", border: "none", color: activeTab === "clients" ? "var(--primary)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
              >
                Clientes Pagantes
              </button>
            </nav>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 700 }}>{user.name}</span>
            <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.company} ({user.role.toUpperCase()})</span>
          </div>
          <button className="primary-button" style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem", background: "var(--surface-card)" }} onClick={() => setUser(null)}>
            Sair
          </button>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main>
        {/* PERFIL CONSULTOR (ADMIN) */}
        {user.role === "admin" ? (
          <div>
            {activeTab === "leads" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <h2>Diagnósticos Recebidos</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Acompanhamento em tempo real dos formulários preenchidos no Raio-X Gratuito.</p>
                  </div>
                  <button className="primary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }} onClick={fetchLeads}>
                    Atualizar Lista
                  </button>
                </div>

                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Contato</th>
                        <th>E-mail</th>
                        <th>Score</th>
                        <th>Gargalo Principal</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                            Nenhum diagnóstico registrado ainda.
                          </td>
                        </tr>
                      ) : (
                        leads.map(lead => (
                          <tr key={lead.id}>
                            <td><strong>{lead.company_name}</strong></td>
                            <td>{lead.contact_name}</td>
                            <td>{lead.email}</td>
                            <td style={{ color: "var(--primary)", fontWeight: "900", fontSize: "1.05rem" }}>{lead.overall_score}%</td>
                            <td>
                              <span style={{ background: "#EF444420", color: "var(--danger)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.8rem", fontWeight: 700 }}>
                                {lead.gap_dimension}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="primary-button" 
                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                                onClick={() => alert(`Enviar abordagem comercial para ${lead.email}`)}
                              >
                                Abordar Lead
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "clients" && (
              <div>
                <h2>Clientes em Imersão (R$ 2.000,00)</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Gestão dos projetos ativos do Diagnóstico Comercial Pago.</p>
                <div className="card">
                  <p style={{ color: "var(--text-muted)" }}>Aqui serão gerenciados os relatórios individuais, a Matriz de Esforço x Impacto e o Plano 30/60/90 Dias de cada cliente ativado.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PERFIL CLIENTE PAGO (/portal) */
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2>Bem-vindo ao Portal Ginga OS — {user.company}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Acompanhe o status da sua imersão e o plano de ação da sua empresa.</p>
            </div>

            <div className="card">
              <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Status da Imersão Comercial</h3>
              <p style={{ fontSize: "0.95rem", color: "var(--text)" }}>
                Sua conta está ativa. Em breve os entregáveis da Metodologia Ginga estarão disponíveis abaixo.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
