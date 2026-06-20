import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { Spinner } from "../components/UI";

// Forsiden - viser alle turneringer
export function HomePage({ user, onNavigate }) {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/Tournament")
            .then(setTournaments)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalPlayers = tournaments.reduce((acc, t) => acc + (t.playerCount || 0), 0);
    const totalMatches = tournaments.reduce((acc, t) => acc + (t.matches?.length || 0), 0);

    return (
        <div className="main">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <div className="page-title">
                        {user ? `Hej, ${user.username} 👋` : "Turneringer"}
                    </div>
                    <div className="page-sub">Alle aktive og kommende turneringer</div>
                </div>
                {user && (
                    <button className="btn btn-primary" onClick={() => onNavigate("new-tournament")}>+ Opret turnering</button>
                )}
            </div>

            {/* Stats øverst hvis der er turneringer */}
            {tournaments.length > 0 && (
                <div className="stats-strip">
                    <div className="stat-cell">
                        <div className="stat-num">{tournaments.length}</div>
                        <div className="stat-lbl">Turneringer</div>
                    </div>
                    <div className="stat-cell">
                        <div className="stat-num">{totalPlayers}</div>
                        <div className="stat-lbl">Spillere</div>
                    </div>
                    <div className="stat-cell">
                        <div className="stat-num">{totalMatches}</div>
                        <div className="stat-lbl">Kampe</div>
                    </div>
                </div>
            )}

            {loading ? (
                <Spinner />
            ) : tournaments.length === 0 ? (
                <div className="empty">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-title">Ingen turneringer endnu</div>
                    <div className="empty-sub">
                        {user ? "Vær den første — opret en turnering!" : "Log ind for at oprette"}
                    </div>
                    {!user && (
                        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate("register")}>Kom i gang</button>
                    )}
                </div>
            ) : (
                <div className="grid-3">
                    {tournaments.map(t => (
                        <div key={t.id} className="card card-hover t-card" onClick={() => onNavigate("tournament", t.id)}>
                            <div className="t-game-badge">🎮 {t.game}</div>
                            <div className="t-name">{t.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                                Oprettet af <span style={{ color: "var(--text)", fontWeight: 600 }}>{t.createdBy}</span>
                            </div>
                            <div className="t-meta">
                                <div className="t-meta-item">Spillere: <span>{t.playerCount}</span></div>
                                <div className="t-meta-item">Dato: <span>{new Date(t.createdAt).toLocaleDateString("da-DK")}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
