# Simpul Rails Chat

A small real-time chat app built with Ruby on Rails, React, Tailwind CSS, PostgreSQL, and Action Cable.

The app has one public chatroom. Visitors can enter a display name, post messages, and see new messages appear live across open browser windows.

## Stack

- Ruby 3.4.4
- Rails 8.1.3
- PostgreSQL
- React
- Tailwind CSS
- Action Cable
- Minitest
- Docker Compose for local PostgreSQL

## Requirements

- Ruby 3.4.4
- Node.js 22+
- npm
- Docker
- Colima on macOS, or another Docker runtime

## Setup

Install Ruby gems:

```bash
bundle install
```

Install JavaScript packages:

```bash
npm install
```

Start PostgreSQL:

```bash
colima start
docker-compose up -d
```

Prepare the database:

```bash
bin/rails db:prepare
bin/rails db:seed
```

Run the app:

```bash
bin/dev
```

Open:

```text
http://localhost:3000
```

## Tests and Checks

Run the Rails test suite:

```bash
bin/rails test
```

Run system tests:

```bash
bin/rails test:system
```

Run Ruby linting:

```bash
bin/rubocop
```

Build frontend assets:

```bash
npm run build
npm run build:css
```

## Real-Time Chat Check

Start the app:

```bash
bin/dev
```

Open two browser windows at:

```text
http://localhost:3000
```

Post a message in one window. The other window should receive it without refreshing.

## Deployment Plan

The intended free deployment setup:

- Render free web service for the Rails app
- Neon free PostgreSQL for the production database

Production needs:

- `DATABASE_URL` from Neon
- Rails migrations run during deploy
- Action Cable working over WebSockets

## Notes

- Authentication is intentionally not included.
- The app uses a single default chatroom named `General`.
- Messages are persisted in PostgreSQL.
- Action Cable broadcasts new messages after they are saved.
