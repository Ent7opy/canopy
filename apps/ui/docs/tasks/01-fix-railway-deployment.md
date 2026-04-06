# Task 01: Fix Railway Deployment

## Description
The backend API (`life‑dashboard‑api`) deployment on Railway is failing. Previously, Nixpacks installation errors occurred; we switched to Dockerfile builder. Need to ensure the API deploys successfully and returns the correct root response (`{"name":"Life Dashboard API","version":"0.1.0","status":"ok"}`).

## Acceptance Criteria
- [ ] Railway deployment succeeds (no build errors).
- [ ] API root endpoint (`https://enthusiastic-upliftment-production.up.railway.app/`) returns the expected JSON.
- [ ] Health endpoint (`/health`) returns `{"status":"ok"}`.
- [ ] Migration script runs automatically (via `postdeploy` hook) and creates tables in PostgreSQL.
- [ ] API key authentication works (optional, configured via environment variable `API_KEY`).

## Steps
1. Check Railway logs for any new errors.
2. If Dockerfile build fails, adjust Dockerfile (e.g., ensure `npm ci --only=production` works).
3. Verify environment variables (`DATABASE_URL`, `API_KEY`) are set correctly in Railway.
4. Manually trigger a redeploy if needed.
5. Run migration manually if `postdeploy` fails: `railway run npm run migrate`.
6. Test endpoints using curl or browser.

## Notes
- Current API repository: `https://github.com/Ent7opy/life-dashboard-api`
- Railway project: `enthusiastic-upliftment-production`
- PostgreSQL instance already provisioned; `DATABASE_URL` is set.
- API key is optional; if set, frontend must include `x-api-key` header.

## References
- [Railway documentation](https://docs.railway.app/)
- [API codebase](https://github.com/Ent7opy/life-dashboard-api/blob/main/server.js)
- [Migration script](https://github.com/Ent7opy/life-dashboard-api/blob/main/scripts/migrate.js)