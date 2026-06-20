import { useState } from "react";
import { apiFetch } from "../api";
import { Alert } from "../components/UI";

// Login side
export function LoginPage({ onSuccess, onNavigate }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const data = await apiFetch("/User/login", {
                method: "POST",
                body: JSON.stringify(form),
            });
            // Gem bruger i localStorage så man forbliver logget ind
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
            onSuccess({ id: data.id, username: data.username });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-wrap">
            <div className="auth-box">
                <div className="card">
                    <div className="auth-title">Log ind</div>
                    <div className="auth-sub">Velkommen tilbage</div>
                    {error && <Alert>{error}</Alert>}
                    <form className="form-stack" onSubmit={submit} style={{ marginTop: 20 }}>
                        <div className="field">
                            <label>Brugernavn</label>
                            <input
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                placeholder="Dit brugernavn"
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Adgangskode</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                            {loading ? "Logger ind…" : "Log ind →"}
                        </button>
                    </form>
                    <div className="form-footer">
                        Ingen konto? <a onClick={() => onNavigate("register")}>Opret gratis</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Register side
export function RegisterPage({ onSuccess, onNavigate }) {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const data = await apiFetch("/User/register", {
                method: "POST",
                body: JSON.stringify(form),
            });
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
            onSuccess({ id: data.id, username: data.username });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-wrap">
            <div className="auth-box">
                <div className="card">
                    <div className="auth-title">Opret konto</div>
                    <div className="auth-sub">Deltag i turneringer</div>
                    {error && <Alert>{error}</Alert>}
                    <form className="form-stack" onSubmit={submit} style={{ marginTop: 20 }}>
                        <div className="field">
                            <label>Brugernavn</label>
                            <input
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                placeholder="Vælg et unikt brugernavn"
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="din@email.dk"
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Adgangskode</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="Minimum 6 tegn"
                                required minLength={6}
                            />
                        </div>
                        <button className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                            {loading ? "Opretter…" : "Opret konto →"}
                        </button>
                    </form>
                    <div className="form-footer">
                        Har du allerede en konto? <a onClick={() => onNavigate("login")}>Log ind</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
