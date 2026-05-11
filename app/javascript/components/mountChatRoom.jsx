import React from "react"
import { createRoot } from "react-dom/client"
import ChatRoom from "./ChatRoom"

function readJson(element, name, fallback) {
  const value = element.dataset[name]

  if (!value) return fallback

  return JSON.parse(value)
}

document.addEventListener("turbo:load", () => {
  const element = document.getElementById("chat-room-root")

  if (!element || element.dataset.mounted === "true") return

  element.dataset.mounted = "true"

  createRoot(element).render(
    <ChatRoom
      chatroom={readJson(element, "chatroom", null)}
      initialMessages={readJson(element, "messages", [])}
    />
  )
})
