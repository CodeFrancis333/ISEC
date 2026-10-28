# ISEC website

The React/Vite frontend is in `isec-website`. The Django API is in
`isec-backend`.

## Frontend development on Windows

Install Node.js 22.12 or newer, then open PowerShell in this directory:

If the workspace portable runtime and dependencies are already installed, run
`.\start-website.cmd` from the repository root instead.

```powershell
cd isec-website
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).
Edit `isec-website/src`; the preview updates automatically.
Use `npm.cmd run build` to check a production build.

Local frontend settings belong in `isec-website/.env.local`, which Git ignores.
Set `VITE_API_BASE_URL=http://127.0.0.1:8000` for a local API.

## Optional local API

Install Python 3.12 or 3.13, then in a second PowerShell window:

```powershell
cd isec-backend
py -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
# Add DEBUG=True to .env for local development.
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

The API runs at http://127.0.0.1:8000. With no email credentials configured,
Django prints outgoing email in the console. Keep credentials in the ignored
backend `.env` file.
