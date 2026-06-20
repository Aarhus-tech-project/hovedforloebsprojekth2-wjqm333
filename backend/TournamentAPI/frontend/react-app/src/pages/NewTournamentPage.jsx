import { useState } from "react";
import { apiFetch } from "../api";
import { Alert } from "../components/UI";

const GAMES = ["CS2", "Valorant", "League of Legends", "Dota 2", "FIFA 25", "Rocket League", "Fortnite", "Apex Legends", "Andet"];

// Side til at oprette en ny turnering
export function NewTournamentPage({ user, onNavigate }) {
    const [form, setForm] = useState({ name: "", game: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            // Sender POST til /api/Tournament med navn, spil og userId
            const data = await apiFetch("/Tournament", {
                method: "POST",
                body: JSON.stringify({ ...form, createdByUserId: user.id }),
            });
            onNavigate("tournament", data.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!user) return (
        <div className="main">
            <div className="empty">
                <div className="empty-title">Du skal være logget ind</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate("login")}>Log ind</button>
            </div>
        </div>
    );

    return (
        <div className="main">
            <div className="back-link" onClick={() => onNavigate("home")}>← Tilbage</div>
            <div style={{ maxWidth: 540 }}>
                <div className="page-header">
                    <div className="page-title">Ny turnering</div>
                    <div className="page-sub">Udfyld oplysningerne og inviter spillere</div>
                </div>
                <div className="card">
                    {error && <><Alert>{error}</Alert><div style={{ height: 16 }} /></>}
                    <form className="form-stack" onSubmit={submit}>
                        <div className="field">
                            <label>Turneringens navn</label>
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="fx. Summer Cup 2025"
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Spil</label>
                            <select value={form.game} onChange={e => setForm(f => ({ ...f, game: e.target.value }))} required>
                                <option value="">Vælg spil…</option>
                                {GAMES.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-primary" disabled={loading} style={{ marginTop: 4, width: "100%" }}>
                            {loading ? "Opretter…" : "Opret turnering →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
