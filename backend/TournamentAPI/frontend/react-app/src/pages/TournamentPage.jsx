import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api";
import { Alert, Spinner } from "../components/UI";

// Viser én turnering med spillere og kampe
export function TournamentPage({ id, user, onNavigate }) {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("spillere");
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinMsg, setJoinMsg] = useState("");
    const [joinError, setJoinError] = useState("");

    const load = useCallback(() => {
        setLoading(true);
        apiFetch(`/Tournament/${id}`)
            .then(setTournament)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => { load(); }, [load]);

    // Tjekker om den loggede bruger allerede er tilmeldt
    const isJoined = tournament?.players?.some(p => p.id === user?.id);

    async function join() {
        setJoinLoading(true); setJoinMsg(""); setJoinError("");
        try {
            const data = await apiFetch(`/Tournament/${id}/join`, {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
            });
            setJoinMsg(data.message || "Du er tilmeldt!");
            load();
        } catch (err) {
            setJoinError(err.message);
        } finally {
            setJoinLoading(false);
        }
    }

    if (loading) return <div className="main"><Spinner /></div>;
    if (!tournament) return <div className="main"><div className="empty"><div className="empty-title">Turnering ikke fundet</div></div></div>;

    const players = tournament.players || [];
    const matches = tournament.matches || [];

    return (
        <div className="main">
            <div className="back-link" onClick={() => onNavigate("home")}>← Alle turneringer</div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                        <div className="t-game-badge">🎮 {tournament.game}</div>
                        <div className="page-title" style={{ marginTop: 8 }}>{tournament.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 6 }}>
                            Oprettet af <strong style={{ color: "var(--text)" }}>{tournament.createdBy}</strong>
                            {" · "}{new Date(tournament.createdAt).toLocaleDateString("da-DK")}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        {user && !isJoined && (
                            <button className="btn btn-primary" onClick={join} disabled={joinLoading}>
                                {joinLoading ? "Tilmelder…" : "Tilmeld dig"}
                            </button>
                        )}
                        {isJoined && <span className="tag tag-green">✓ Tilmeldt</span>}
                        {user && (
                            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("new-match", id)}>
                                + Opret kamp
                            </button>
                        )}
                    </div>
                </div>
                {joinMsg && <div style={{ marginTop: 12 }}><Alert type="success">{joinMsg}</Alert></div>}
                {joinError && <div style={{ marginTop: 12 }}><Alert>{joinError}</Alert></div>}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                <div className="tag tag-orange">{players.length} spillere</div>
                <div className="tag tag-blue">{matches.length} kampe</div>
            </div>

            <div className="tabs">
                <button className={`tab ${tab === "spillere" ? "active" : ""}`} onClick={() => setTab("spillere")}>Spillere</button>
                <button className={`tab ${tab === "kampe" ? "active" : ""}`} onClick={() => setTab("kampe")}>Kampe</button>
            </div>

            {tab === "spillere" && (
                <div className="card">
                    {!players.length ? (
                        <div className="empty" style={{ padding: "32px 0" }}>
                            <div className="empty-icon">👤</div>
                            <div className="empty-title">Ingen spillere endnu</div>
                            <div className="empty-sub">Vær den første til at tilmelde dig!</div>
                        </div>
                    ) : players.map(p => (
                        <div className="player-row" key={p.id}>
                            <div className="player-avatar">{p.username[0].toUpperCase()}</div>
                            <div className="player-name">{p.username}</div>
                            {p.id === user?.id && <span className="tag tag-orange">Dig</span>}
                        </div>
                    ))}
                </div>
            )}

            {tab === "kampe" && (
                <div className="card">
                    {!matches.length ? (
                        <div className="empty" style={{ padding: "32px 0" }}>
                            <div className="empty-icon">⚔️</div>
                            <div className="empty-title">Ingen kampe endnu</div>
                            <div className="empty-sub">Opret den første kamp for at komme i gang</div>
                        </div>
                    ) : matches.map(m => (
                        <div className="match-row" key={m.id}>
                            <div className="match-player">{m.player1}</div>
                            <div className="match-vs">VS</div>
                            <div className="match-player">{m.player2}</div>
                            {m.winner === "Ikke spillet endnu"
                                ? <div className="match-pending">Ikke spillet</div>
                                : <div className="match-winner-badge">🏆 {m.winner}</div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
