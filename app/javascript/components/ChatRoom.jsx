import React from "react"

export default function ChatRoom({ chatroom, initialMessages }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
        <header className="border-b border-slate-800 px-5 py-4">
          <p className="text-sm font-medium text-teal-300">Public chatroom</p>
          <h1 className="mt-1 text-2xl font-semibold">{chatroom.name}</h1>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {initialMessages.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
              No messages yet.
            </div>
          ) : (
            initialMessages.map((message) => (
              <article key={message.id} className="rounded-md bg-slate-800 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-sm font-semibold text-teal-200">{message.sender_name}</h2>
                  <time className="text-xs text-slate-400">{formatTime(message.created_at)}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{message.body}</p>
              </article>
            ))
          )}
        </div>

        <form className="border-t border-slate-800 p-5">
          <div className="grid gap-3 sm:grid-cols-[12rem_1fr_auto]">
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              disabled
              placeholder="Name"
              type="text"
            />
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              disabled
              placeholder="Message"
              type="text"
            />
            <button
              className="rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 opacity-60"
              disabled
              type="button"
            >
              Send
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value))
}
