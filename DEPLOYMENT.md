# Deployment

Free deployment target:

- Render web service for the Rails app
- Neon PostgreSQL for the database

## Render Service

Create a Render Web Service from the GitHub repository.

Use the native Ruby runtime.

Build command:

```bash
./bin/render-build.sh
```

Start command:

```bash
bundle exec puma -C config/puma.rb
```

## Environment Variables

Set these in the Render service environment:

```bash
RAILS_ENV=production
DATABASE_URL=<neon-postgres-url>
RAILS_MASTER_KEY=<config-master-key>
SECRET_KEY_BASE=<generated-secret>
RAILS_SERVE_STATIC_FILES=true
```

Get the Rails master key locally:

```bash
cat config/master.key
```

Generate the production secret:

```bash
bin/rails secret
```

Use the direct Neon connection string for `DATABASE_URL`.

Do not use the `-pooler` host for this app. Action Cable uses PostgreSQL
`LISTEN/NOTIFY` in production, and the pooled Neon URL does not deliver those
notifications reliably.

## Database

Production uses the Neon `DATABASE_URL` for the app tables and Action Cable broadcasts. Cache and jobs use in-process adapters because the free Render deployment runs as a single web service.

The build script runs:

```bash
bundle exec rails db:prepare
```

That prepares the database during deployment.

## Smoke Test

After deploy:

- open the Render URL
- confirm the `General` room loads
- send a message with a display name
- refresh the page and confirm the message remains
- open the app in two browser windows and confirm new messages appear live

## Notes

- Free services can sleep after inactivity.
- The first request after sleep can be slow.
- Keep `.env` local only. Put production values in Render environment variables.
- Do not set `SOLID_QUEUE_IN_PUMA` on Render for this app.
