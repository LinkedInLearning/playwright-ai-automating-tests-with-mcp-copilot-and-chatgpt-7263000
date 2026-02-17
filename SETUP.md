# BuggyBoard – Setup

How to set up and run the BuggyBoard app on your machine.

## Prerequisites

- **Node.js** 18+ or 20+ LTS
- **npm** (comes with Node.js)

Check versions:

```bash
node -v   # e.g. v20.x.x
npm -v    # e.g. 10.x.x
```

## Install dependencies

From the **repository root**:

```bash
npm install
```

This installs dependencies for the root workspace and for both `frontend` and `backend` (npm workspaces). You do not need to run `npm install` inside `frontend/` or `backend/` separately.

## Run the app

From the **repository root**:

```bash
npm run dev
```

This starts:

- **Frontend** (Vite) at [http://localhost:5173](http://localhost:5173) – open this in your browser to see the app.
- **Backend** (Express) at [http://localhost:3000](http://localhost:3000) – API only.

To confirm the backend is up, you can open or curl:

- [http://localhost:3000/api/health](http://localhost:3000/api/health) – should return `{"ok":true,"message":"BuggyBoard API is running"}`.

Stop the servers with `Ctrl+C` in the terminal where `npm run dev` is running.

## Other commands

From the repository root:

- **Build** (frontend + backend):  
  `npm run build`

- **Lint**:  
  `npm run lint`

- **Format** (Prettier):  
  `npm run format`
