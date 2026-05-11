# Technical Design Notes

Small design pass before coding. Keep the app narrow, reviewable, and easy to deploy.

## Scope

Build one public real-time chatroom.

In scope:

- single default chatroom
- display name entered in the chat form
- message body entered in the chat form
- persisted messages
- live updates across open browser windows
- React chat interface
- Tailwind styling
- basic tests
- free deployment path

Out of scope:

- authentication
- user accounts
- private rooms
- typing indicators
- read receipts
- file uploads
- message editing/deleting
- admin tools

## Database Design

### `chatrooms`

Columns:

- `id`
- `name`
- `created_at`
- `updated_at`

Validation:

- `name` is required

Notes:

- Seed one default room named `General`.
- No need for multiple room management unless everything else is finished.

### `messages`

Columns:

- `id`
- `chatroom_id`
- `sender_name`
- `body`
- `created_at`
- `updated_at`

Indexes:

- `chatroom_id`

Validations:

- `chatroom_id` is required
- `sender_name` is required
- `sender_name` max length around `40`
- `body` is required
- `body` max length around `1000`

Relationships:

```ruby
class Chatroom < ApplicationRecord
  has_many :messages, dependent: :destroy
end

class Message < ApplicationRecord
  belongs_to :chatroom
end
```

## Routes and Endpoints

Keep the routing small.

```text
GET  /                                  chatrooms#show
POST /chatrooms/:chatroom_id/messages   messages#create
```

### `GET /`

Purpose:

- render the app shell
- load the default chatroom
- pass initial messages to React

Data needed by React:

```json
{
  "chatroom": {
    "id": 1,
    "name": "General"
  },
  "messages": []
}
```

### `POST /chatrooms/:chatroom_id/messages`

Purpose:

- create a new message
- validate input on the server
- return JSON for the created message or validation errors
- trigger the Action Cable broadcast after commit

Success response shape:

```json
{
  "message": {
    "id": 1,
    "chatroom_id": 1,
    "sender_name": "Yos",
    "body": "Hello",
    "created_at": "<timestamp>"
  }
}
```

Error response shape:

```json
{
  "errors": {
    "sender_name": ["can't be blank"],
    "body": ["can't be blank"]
  }
}
```

Use normal Rails validation errors. No custom error framework needed.

## Real-Time Design

Use Action Cable for live message delivery.

Channel:

```text
ChatroomChannel
```

Subscription parameter:

```json
{
  "chatroom_id": 1
}
```

Broadcast stream:

```ruby
stream_for chatroom
```

Broadcast payload:

```json
{
  "type": "message.created",
  "message": {
    "id": 1,
    "chatroom_id": 1,
    "sender_name": "Yos",
    "body": "Hello",
    "created_at": "<timestamp>"
  }
}
```

React behavior:

- subscribe when the chat component mounts
- append received messages to local state
- avoid duplicate messages if the sender already added the message from the POST response
- unsubscribe when the component unmounts

Duplicate handling can be simple:

- keep messages keyed by `id`
- if a received message ID already exists, ignore it

## Frontend Design

React owns the chat surface.

Main component:

```text
ChatRoom
```

State:

- `messages`
- `senderName`
- `body`
- `errors`
- `isSending`
- `connectionStatus`

Child components can stay minimal:

- `MessageList`
- `MessageItem`
- `MessageForm`

Avoid a global store. Component state is enough.

Tailwind should handle most styling:

- responsive centered layout
- message bubbles
- clear sender name
- timestamp
- disabled send state
- small validation messages

## Local Development

Use Docker for local PostgreSQL.

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

Rails should use local Postgres for development and test databases.

## Deployment Design

Use free services:

- Render free web service for Rails
- Neon free Postgres for production database

Production config:

- set `DATABASE_URL` in Render from Neon
- run migrations during deploy
- confirm Action Cable works on Render
- test with two browser windows after deploy

Render free service may sleep after inactivity. That is acceptable for this challenge.

## First Reviewable Slice

First implementation slice should stay small:

- Rails app created with PostgreSQL, React, and Tailwind
- Docker PostgreSQL works locally
- `Chatroom` model exists
- `Message` model exists
- associations are defined
- validations are defined
- default chatroom seed exists
- model tests pass

Do not include React UI or Action Cable in the first slice. That keeps the review simple.

## Suggested Slice Order

1. Rails app + Docker database + models + tests
2. Root chatroom page + initial data passed to React
3. React chat UI without real-time updates
4. Message creation endpoint + validation handling
5. Action Cable subscription and broadcasts
6. Tailwind UI polish
7. Deployment setup
8. README and final smoke test
