import React from "react"
import { createRoot } from "react-dom/client"
import ChatRoom from "./ChatRoom"

let chatRoomElement = null
let chatRoomRoot = null

function readJson(element, name, fallback) {
  const value = element.dataset[name]

  if (!value) return fallback

  return JSON.parse(value)
}

function mountChatRoom() {
  const element = document.getElementById("chat-room-root")

  if (!element || element.dataset.mounted === "true") return

  element.dataset.mounted = "true"
  chatRoomElement = element
  chatRoomRoot = createRoot(element)

  chatRoomRoot.render(
    <ChatRoom
      chatroom={readJson(element, "chatroom", null)}
      chatrooms={readJson(element, "chatrooms", [])}
      initialMessages={readJson(element, "messages", [])}
    />
  )
}

function unmountChatRoom() {
  if (chatRoomRoot) {
    chatRoomRoot.unmount()
    chatRoomRoot = null
  }

  if (chatRoomElement) {
    delete chatRoomElement.dataset.mounted
    chatRoomElement = null
  }
}

document.addEventListener("turbo:load", mountChatRoom)
document.addEventListener("turbo:before-cache", unmountChatRoom)
