# Simpul Rails Chat Challenge Notes

Build a small real-time chat app in Rails, deploy it, and send both the live link and the GitHub link.

No auth needed.

## Research Notes

Rails already has Action Cable for WebSockets. Some newer Rails examples pair it with Turbo Streams, but the brief gives extra points for React or Vue.

Some tutorials use Pusher, but avoid another service unless deployment gets annoying. Action Cable is part of Rails, so it feels like the better thing to show here.

Keep React small so the project still feels like a Rails app, not two separate apps fighting each other.

For local development, use PostgreSQL through Docker instead of installing PostgreSQL directly on the machine.

For free deployment, use Render for the Rails web service and Neon for PostgreSQL. Render can host the app for free and Neon gives a free Postgres database without the short expiry problem of Render's free Postgres.

## What to Build

One public chatroom.

Users can:

- open the page
- type a display name
- type a message
- submit it
- see messages update without refreshing

Messages should stay after refresh, so they need to be saved in the database.

## Stack

- Rails
- PostgreSQL
- Action Cable
- React
- Tailwind CSS
- Rails default tests
- Docker Postgres for local development
- Render free web service for hosting
- Neon free Postgres for production database

React is mainly for the chat UI:

- message list
- display name input
- message input
- send state
- live updates from Action Cable

Rails still handles persistence, validation, routing, and deployment.

## Data

Probably only need two tables.

`Chatroom`

- `name`

`Message`

- `chatroom_id`
- `sender_name`
- `body`
- timestamps

Validations:

- sender name cannot be blank
- message cannot be blank
- maybe limit message length

Seed one room:

- `General`

## Build Order

### 1. Rails setup

Create the Rails app in this repo with PostgreSQL, React, and Tailwind.

```bash
rails new . --database=postgresql --javascript=esbuild --css=tailwind
```

This repo already has notes in it, so be careful if Rails asks about overwriting files.

After setup:

- start local PostgreSQL with Docker
- run database setup
- run the server
- make sure the app boots
- commit the initial Rails app

Local database command:

```bash
docker run --name simpul-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=simpul_development \
  -p 5432:5432 \
  -d postgres:16
```

If the container already exists:

```bash
docker start simpul-postgres
```

### 2. Models

Create:

- `Chatroom`
- `Message`

Relationship:

```ruby
class Chatroom < ApplicationRecord
  has_many :messages, dependent: :destroy
end

class Message < ApplicationRecord
  belongs_to :chatroom
end
```

Then add validations and seed the default chatroom.

### 3. Basic chat page

Make the root page show the default chatroom.

It should have:

- room title
- React mount point
- initial chatroom data for the React component

First version can be plain. Get the Rails route and page rendering before styling.

### 4. React chat UI

Create a small React chat component.

It should have:

- message list
- display name input
- message input
- send button
- basic loading / sending state
- simple validation feedback

Keep the component focused. No complex frontend store needed.

### 5. Posting messages

Add message creation through a Rails controller returning JSON.

Need to check:

- valid message saves
- blank message does not save
- blank name does not save
- page does not feel broken after submit

### 6. Real-time updates

Use Action Cable and subscribe from React.

When a message is created, broadcast it into the chatroom stream and append it to the React message list.

Likely Rails pattern:

```ruby
after_create_commit -> {
  broadcast_to chatroom, as_json
}
```

Test this with two browser windows before moving on.

### 7. UI pass

Keep this clean and simple:

- readable messages
- clear sender name
- timestamp
- comfortable spacing
- mobile layout works
- no huge landing page
- Tailwind utility classes instead of custom CSS where possible

This is still a coding challenge, so the UI just needs to feel cared for.

### 8. Tests

Add enough tests to show the important behavior.

Tests to have:

- message requires sender name
- message requires body
- chatroom owns messages
- posting a message works
- chatroom page loads

If there is time:

- broadcast behavior
- small React component test if setup is not too heavy

### 9. README

README should explain:

- what this app is
- Ruby/Rails versions
- setup steps
- database setup
- how to run tests
- deployed app link
- short note about React, Tailwind, and Action Cable

## Deployment Notes

Use:

- Render free web service for the Rails app
- Neon free Postgres for the production database

Render free service notes:

- good enough for a coding challenge/demo app
- may sleep after inactivity
- first request after sleep can be slow
- supports WebSockets, so Action Cable should work

Neon notes:

- use the connection string as `DATABASE_URL`
- free tier is enough for a small challenge app
- better than Render free Postgres for this case because it does not have the same short database expiry

Things to check after deploy:

- Render has `DATABASE_URL` from Neon
- migrations ran
- app opens
- messages save
- real-time updates work between two browser windows
- production logs do not show WebSocket errors

Action Cable in production is probably the part most likely to waste time, so deploy before final cleanup.

## Rough Order

First pass:

- Rails setup
- Docker Postgres setup
- models
- basic page

Second pass:

- message posting
- React chat UI
- JSON create endpoint

Third pass:

- real-time updates
- local two-window test
- UI cleanup
- tests
- README

Deployment pass:

- create Neon database
- deploy Rails app on Render
- add Neon `DATABASE_URL` to Render
- fix production issues
- test WebSockets online

Final pass:

- final check
- send links

## Final Checklist

- [ ] Rails app runs locally
- [ ] GitHub remote is set
- [ ] local PostgreSQL runs through Docker
- [ ] default chatroom exists
- [ ] messages can be posted
- [ ] blank messages are blocked
- [ ] messages persist after refresh
- [ ] React chat UI works
- [ ] real-time updates work locally
- [ ] UI is decent on desktop
- [ ] UI works on mobile
- [ ] tests pass
- [ ] README is done
- [ ] Neon production database is created
- [ ] Render web service is connected to Neon
- [ ] app is deployed
- [ ] real-time updates work online
- [ ] repo is pushed
- [ ] submission message is ready
