import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { Alert, Spinner } from "../components/UI";

// Side til at oprette en kamp og registrere vinder
export function NewMatchPage({ tournamentId, user, onNavigate }) {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ player1Id: "", player2Id: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [createdMatch, setCreatedMatch] = useState(null);
    const [winnerId, setWinnerId] = useState("");
    const [resultMsg, setResultMsg] = useState("");
    const [resultError, setResultError] = useState("");

    useEffect(() => {
        if (!tournamentId) return;
        apiFetch(`/Tournament/${tournamentId}`)
            .then(setTournament)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [tournamentId]);

    async function createMatch(e) {
        e.preventDefault();
        if (form.player1Id === form.player2Id) { setError("Vælg to forskellige spillere"); return; }
        setError(""); setSubmitting(true);
        try {
            const data = await apiFetch("/Match", {
                method: "POST",
                body: JSON.stringify({
                    tournamentId: parseInt(tournamentId),
                    player1Id: parseInt(form.player1Id),
                    player2Id: parseInt(form.player2Id)
                }),
            });
            setCreatedMatch(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    // Gemmer vinder via PUT /api/Match/{id}/result
    async function setResult(e) {
        e.preventDefault();
        setResultError(""); setSubmitting(true);
        try {
            await apiFetch(`/Match/${createdMatch.id}/result`, {
                method: "PUT",
                body: JSON.stringify({ winnerId: parseInt(winnerId) }),
            });
            setResultMsg("Resultat gemt! 🎉");
        } catch (err) {
            setResultError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!user) return (
        <div className="main">
            <div className="empty"><div className="empty-title">Log ind for at oprette kampe</div></div>
        </div>
    );

    if (loading) return <div className="main"><Spinner /></div>;

    const players = tournament?.players || [];
    const p1 = players.find(p => p.id === parseInt(form.player1Id));
    const p2 = players.find(p => p.id === parseInt(form.player2Id));

    return (
        <div className="main">
            <div className="back-link" onClick={() => onNavigate("tournament", tournamentId)}>
                ← {tournament?.name}
            </div>
            <div style={{ maxWidth: 540 }}>
                <div className="page-header">
                    <div className="page-title">Opret kamp</div>
                    <div className="page-sub">Vælg to spillere fra turneringen</div>
                </div>

                {!createdMatch ? (
                    <div className="card">
                        {error && <><Alert>{error}</Alert><div style={{ height: 16 }} /></>}
                        <form className="form-stack" onSubmit={createMatch}>
                            <div className="field">
                                <label>Spiller 1</label>
                                <select value={form.player1Id} onChange={e => setForm(f => ({ ...f, player1Id: e.target.value }))} required>
                                    <option value="">Vælg spiller…</option>
                                    {players.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Spiller 2</label>
                                <select value={form.player2Id} onChange={e => setForm(f => ({ ...f, player2Id: e.target.value }))} required>
                                    <option value="">Vælg spiller…</option>
                                    {players.filter(p => p.id !== parseInt(form.player1Id)).map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                                </select>
                            </div>
                            <button className="btn btn-primary" disabled={submitting} style={{ marginTop: 4 }}>
                                {submitting ? "Opretter…" : "Opret kamp →"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <Alert type="success">Kamp oprettet! Registrer nu vinderen</Alert>
                        <div style={{ margin: "24px 0", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
                                <div style={{ textAlign: "center" }}>
                                    <div className="player-avatar" style={{ margin: "0 auto 8px", width: 48, height: 48, fontSize: "1.1rem" }}>
                                        {p1?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ fontWeight: 600 }}>{p1?.username}</div>
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--muted)" }}>VS</div>
                                <div style={{ textAlign: "center" }}>
                                    <div className="player-avatar" style={{ margin: "0 auto 8px", width: 48, height: 48, fontSize: "1.1rem" }}>
                                        {p2?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ fontWeight: 600 }}>{p2?.username}</div>
                                </div>
                            </div>
                        </div>
                        <div className="divider" />
                        {resultMsg ? (
                            <>
                                <Alert type="success">{resultMsg}</Alert>
                                <button className="btn btn-ghost" style={{ marginTop: 16, width: "100%" }} onClick={() => onNavigate("tournament", tournamentId)}>
                                    Tilbage til turnering
                                </button>
                            </>
                        ) : (
                            <form className="form-stack" onSubmit={setResult}>
                                {resultError && <Alert>{resultError}</Alert>}
                                <div className="field">
                                    <label>Vinder</label>
                                    <select value={winnerId} onChange={e => setWinnerId(e.target.value)} required>
                                        <option value="">Hvem vandt?</option>
                                        <option value={form.player1Id}>{p1?.username}</option>
                                        <option value={form.player2Id}>{p2?.username}</option>
                                    </select>
                                </div>
                                <button className="btn btn-success" disabled={submitting}>
                                    {submitting ? "Gemmer…" : "🏆 Gem resultat"}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
