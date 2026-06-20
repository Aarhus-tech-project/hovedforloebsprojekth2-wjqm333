import { useState, useEffect } from "react";
import { StyleInjector } from "./styles";
import { Nav } from "./components/UI";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { HomePage } from "./pages/HomePage";
import { NewTournamentPage } from "./pages/NewTournamentPage";
import { TournamentPage } from "./pages/TournamentPage";
import { NewMatchPage } from "./pages/NewMatchPage";

export default function App() {
    const [page, setPage] = useState({ name: "home", params: [] });

    // Henter bruger fra localStorage hvis man allerede er logget ind
    const [user, setUser] = useState(() => {
        const id = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        return id && username ? { id: parseInt(id), username } : null;
    });

    function navigate(name, ...params) {
        setPage({ name, params });
        window.scrollTo(0, 0);
    }

    // Tjekker URL ved opstart så man kan refreshe siden
    useEffect(() => {
        const parts = window.location.pathname.split("/").filter(Boolean);
        if (parts[0] === "tournament" && parts[1]) navigate("tournament", parts[1]);
        else if (parts[0] === "new-match" && parts[1]) navigate("new-match", parts[1]);
        else if (parts[0] === "login") navigate("login");
        else if (parts[0] === "register") navigate("register");
        else if (parts[0] === "new-tournament") navigate("new-tournament");
    }, []);

    function logout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        setUser(null);
        navigate("home");
    }

    function handleAuth(userData) {
        setUser(userData);
        navigate("home");
    }

    return (
        <>
            <StyleInjector />
            <div className="app">
                <Nav user={user} onLogout={logout} onNavigate={navigate} />
                {page.name === "home"           && <HomePage user={user} onNavigate={navigate} />}
                {page.name === "login"          && <LoginPage onSuccess={handleAuth} onNavigate={navigate} />}
                {page.name === "register"       && <RegisterPage onSuccess={handleAuth} onNavigate={navigate} />}
                {page.name === "new-tournament" && <NewTournamentPage user={user} onNavigate={navigate} />}
                {page.name === "tournament"     && <TournamentPage id={page.params[0]} user={user} onNavigate={navigate} />}
                {page.name === "new-match"      && <NewMatchPage tournamentId={page.params[0]} user={user} onNavigate={navigate} />}
            </div>
        </>
    );
}
