// Små genbrugelige komponenter brugt på tværs af siderne

export function Alert({ type = "error", children }) {
    return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Spinner() {
    return <div className="spinner" />;
}

// Navbar øverst på alle sider
export function Nav({ user, onLogout, onNavigate }) {
    return (
        <nav>
            <div className="nav-logo" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
                TOURNAMENT<span className="logo-dot">.</span>GG
            </div>
            <div className="nav-right">
                {user ? (
                    <>
                        <div className="nav-user">
                            <div className="nav-avatar">{user.username[0]}</div>
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{user.username}</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log ud</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("login")}>Log ind</button>
                        <button className="btn btn-primary btn-sm" onClick={() => onNavigate("register")}>Opret konto</button>
                    </>
                )}
            </div>
        </nav>
    );
}
