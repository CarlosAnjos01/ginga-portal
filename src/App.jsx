import { useState } from "react";
import "./index.css";

const API_URL = "https://shy-dawn-31acdiagnostico-api.carlos-fe4.workers.dev/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);

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
        setError(data.error || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      setError("Erro ao conectar à API.");
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

  if (!user) {
    return (
      <div className="app-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
          <div className="brand" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            GINGA <span>AÍ</span> OS
          </div>
          <form onSubmit={handleLogin}>
            <label className="field">
              <span>E-mail de Acesso</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seuemail@empresa.com" />
            </label>
            <label className="field">
              <span>Senha</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </label>
            {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}
            <button className="primary-button" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Entrando..." : "Acessar Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">GINGA <span>AÍ</span> OS</div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.name} ({user.company})</span>
          <button className="primary-button" style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }} onClick={() => setUser(null)}>Sair</button>
        </div>
      </header>

      <main>
        {user.role === "admin" ? (
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Painel da Liderança — Ginga Aí</h2>
            <div className="card">
              <h3>Diagnósticos Realizados ({leads.length})</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Contato</th>
                    <th>E-mail</th>
                    <th>Score</th>
                    <th>Gargalo</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td><strong>{lead.company_name}</strong></td>
                      <td>{lead.contact_name}</td>
                      <td>{lead.email}</td>
                      <td style={{ color: "var(--primary)", fontWeight: "bold" }}>{lead.overall_score}%</td>
                      <td>{lead.gap_dimension}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Portal do Cliente — {user.company}</h2>
            <div className="card">
              <h3>Plano de Ação 30/60/90 Dias</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Seu projeto de Diagnóstico Comercial Pago de R$ 2.000,00 está ativado.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
