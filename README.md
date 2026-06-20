# Tournament.GG

Et simpelt turneringssystem hvor man kan oprette brugere, turneringer og kampe.

## Hvad jeg har brugt
- React + Vite (frontend)
- SvelteKit (tidligere frontend)
- ASP.NET Core C# (backend)
- SQL Server (database)
- Nginx på Linux (server)

## Ændringer
Startede med SvelteKit som frontend, men fik hjælp til at skifte over til React da det var nemmere at arbejde med i dette projekt.

Alt React koden lå i én stor fil (App.jsx) på næsten 1000 linjer.
Delte den op i mindre filer så det er nemmere at finde rundt i:

- `api.js` – sender requests til backend
- `styles.js` – al CSS
- `components/UI.jsx` – navbar, knapper og alerts
- `pages/` – én fil per side (login, dashboard, turnering osv.)
