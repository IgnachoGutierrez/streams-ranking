## Environment configuration

The server reads its configuration from environment variables. In development,
nodemon loads them from up to two env files, so secrets can live **outside the
repository**.

### Required variables

| Variable        | Description                                           | Example                          |
|-----------------|-------------------------------------------------------|----------------------------------|
| `REDIRECT_URI`  | Spotify OAuth callback URL (must match the Spotify app settings exactly) | `http://127.0.0.1:3000/callback` |
| `CLIENT_ID`     | Spotify app client ID                                 |                                  |
| `CLIENT_SECRET` | Spotify app client secret                             |                                  |
| `FRONTEND_URL`  | Frontend origin, used for CORS and redirects (no trailing slash) | `http://localhost:4200`          |

If any of these are missing, the server stops at startup with an error naming the variable.

### Which files are loaded

`npm run dev` loads these files in order. Both are optional:

1. **External file:** `$ENV_FILE` if set, otherwise
   `~/.config/spotify-streams-app/.env.dev`
2. **Project file:** `server/.env`

If a variable is set in more than one place, the **later source wins**:

```
external file  <  server/.env  <  variables already set in your shell
```

A missing file only prints a notice (`... not found. Continuing without it.`)
and is skipped.

### Setup (recommended: keep secrets outside the repo)

```bash
mkdir -p ~/.config/spotify-streams-app
cp server/.env.template ~/.config/spotify-streams-app/.env.dev
chmod 600 ~/.config/spotify-streams-app/.env.dev   # readable only by you
# edit the file and fill in the real values
cd server && npm run dev
```

### Other options

```bash
# Use a different external file
ENV_FILE=/path/to/my.env npm run dev

# Keep everything in the project instead
cp .env.template .env    # git ignores this file

# Override a single value for one run
CLIENT_ID=other-id npm run dev
```

`server/.env` also works for overriding a few values on top of the external file.

> ⚠️ Setting `ENV_FILE` to a path that doesn't exist does **not** stop the
> server. The file is skipped, and you'll see an error about missing variables
> instead. Check the path if that happens.

### Requirements

- **Node.js 20.19.0 or newer**, for `--env-file-if-exists`
- **macOS, Linux or WSL.** The `$HOME` / `${ENV_FILE:-...}` syntax in
  `nodemon.json` doesn't work in Windows `cmd` or PowerShell.

### Security notes

- **Never commit real values.** `.env` and `.env.*` are in `.gitignore`; only
  `.env.template` is committed.
- **Prefer the external file for real secrets.** Anything inside the repo folder
  can be read by tools with access to it, including editors, AI coding agents
  and sandboxes.
- **Use a separate Spotify app for development,** so dev credentials can't
  affect production.