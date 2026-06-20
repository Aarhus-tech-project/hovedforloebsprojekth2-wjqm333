import { useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0d0f13;
    --surface:  #161a22;
    --card:     #1e2330;
    --border:   #2a3044;
    --accent:   #ff5500;
    --accent2:  #ff7733;
    --text:     #e8eaf0;
    --muted:    #7a849a;
    --green:    #00d68f;
    --blue:     #4d9fff;
    --radius:   8px;
    --font-display: 'Barlow Condensed', sans-serif;
    --font-body:    'Inter', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .main { flex: 1; max-width: 1100px; margin: 0 auto; padding: 32px 20px; width: 100%; }

  nav {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px; position: sticky; top: 0; z-index: 100;
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.6rem; font-weight: 800; letter-spacing: 0.02em;
    color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }
  .logo-dot { color: var(--accent); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-user { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--muted); }
  .nav-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.8rem; color: #fff; text-transform: uppercase;
  }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: var(--radius);
    font-family: var(--font-body); font-weight: 600; font-size: 0.85rem;
    cursor: pointer; border: none; transition: all 0.15s ease; text-decoration: none;
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
  .btn-danger { background: transparent; color: #ff4466; border: 1px solid #ff4466; }
  .btn-danger:hover { background: #ff446620; }
  .btn-success { background: var(--green); color: #000; font-weight: 700; }
  .btn-success:hover { opacity: 0.9; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
  .card-hover { transition: border-color 0.15s, transform 0.15s; cursor: pointer; }
  .card-hover:hover { border-color: var(--accent); transform: translateY(-2px); }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .field input, .field select {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 10px 14px;
    color: var(--text); font-family: var(--font-body); font-size: 0.9rem;
    transition: border-color 0.15s; outline: none;
  }
  .field input:focus, .field select:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }
  .field select option { background: var(--surface); }

  .page-header { margin-bottom: 32px; }
  .page-title {
    font-family: var(--font-display);
    font-size: 2.4rem; font-weight: 800; line-height: 1;
    letter-spacing: 0.01em; text-transform: uppercase; margin-bottom: 8px;
  }
  .page-sub { color: var(--muted); font-size: 0.9rem; }

  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 640px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

  .auth-wrap { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 60px); padding: 32px 20px; }
  .auth-box { width: 100%; max-width: 420px; }
  .auth-box .card { padding: 36px; }
  .auth-title { font-family: var(--font-display); font-size: 2rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
  .auth-sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 28px; }
  .form-stack { display: flex; flex-direction: column; gap: 16px; }
  .form-footer { margin-top: 20px; text-align: center; font-size: 0.84rem; color: var(--muted); }
  .form-footer a { color: var(--accent); cursor: pointer; text-decoration: none; }
  .form-footer a:hover { text-decoration: underline; }

  .alert { border-radius: var(--radius); padding: 12px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
  .alert-error { background: #ff446618; border: 1px solid #ff4466; color: #ff6688; }
  .alert-success { background: #00d68f18; border: 1px solid var(--green); color: var(--green); }

  .t-card { position: relative; overflow: hidden; }
  .t-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); opacity: 0; transition: opacity 0.2s; }
  .t-card:hover::before { opacity: 1; }
  .t-game-badge { display: inline-flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px; font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
  .t-name { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; line-height: 1.1; }
  .t-meta { display: flex; gap: 16px; margin-top: 12px; }
  .t-meta-item { font-size: 0.8rem; color: var(--muted); }
  .t-meta-item span { color: var(--text); font-weight: 600; }

  .player-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .player-row:last-child { border-bottom: none; }
  .player-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #ff8800); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; flex-shrink: 0; color: #fff; }
  .player-name { font-weight: 500; font-size: 0.9rem; flex: 1; }

  .match-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .match-row:last-child { border-bottom: none; }
  .match-vs { font-family: var(--font-display); font-weight: 800; font-size: 0.85rem; color: var(--muted); flex-shrink: 0; }
  .match-player { flex: 1; font-weight: 500; font-size: 0.88rem; text-align: center; }
  .match-winner-badge { font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #00d68f20; color: var(--green); white-space: nowrap; flex-shrink: 0; }
  .match-pending { font-size: 0.75rem; color: var(--muted); white-space: nowrap; flex-shrink: 0; }

  .tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid var(--border); }
  .tab { padding: 10px 18px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; background: none; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.15s, border-color 0.15s; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab:hover:not(.active) { color: var(--text); }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  .spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: spin 0.7s linear infinite; margin: 40px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-weight: 600; margin-bottom: 6px; color: var(--text); }
  .empty-sub { font-size: 0.85rem; }

  .stats-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 32px; }
  .stat-cell { background: var(--card); padding: 20px; text-align: center; }
  .stat-num { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-lbl { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }

  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .tag-orange { background: #ff550020; color: var(--accent); }
  .tag-green  { background: #00d68f18; color: var(--green); }
  .tag-blue   { background: #4d9fff18; color: var(--blue); }

  .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: 0.85rem; cursor: pointer; margin-bottom: 24px; transition: color 0.15s; }
  .back-link:hover { color: var(--text); }
`;

export function StyleInjector() {
    useEffect(() => {
        const el = document.createElement("style");
        el.textContent = css;
        document.head.appendChild(el);
        return () => document.head.removeChild(el);
    }, []);
    return null;
}
