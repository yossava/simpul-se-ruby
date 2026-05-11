import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  Bold,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hash,
  Info,
  Italic,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Send,
  Sun,
  UsersRound
} from "lucide-react"
import consumer from "../channels/consumer"

const BODY_LIMIT = 1_000
const DISPLAY_NAME_STORAGE_KEY = "displayName"

const tones = {
  light: {
    page: "bg-[#e9e2d9] text-[#111b21]",
    frame: "border-[#d2c8bd] bg-[#fbf7ef] shadow-[#c0b6aa]/70",
    sidebar: "border-[#06564d] bg-[#075e54] text-white",
    sidebarActive: "bg-white/18 text-white shadow-inner",
    sidebarHover: "hover:bg-white/10",
    sidebarMuted: "text-[#cdece8]",
    sidebarCard: "border-white/18 bg-white/8 text-white",
    newRoom: "border-white/50 bg-transparent text-white hover:bg-white/12",
    header: "border-[#d8cec2] bg-[#fbf7ef]",
    headerStrong: "text-[#111b21]",
    headerMuted: "text-[#54656f]",
    roomBar: "border-[#d8cec2] bg-[#fbf7ef]",
    chat: "bg-[#f4eee5]",
    bubble: "bg-white text-[#111b21] shadow-[#d8cec2]/80 ring-1 ring-[#ded4c8]",
    ownBubble: "bg-[#d7fdd2] text-[#111b21] shadow-[#c3dfbc]/80",
    messageAction: "bg-[#e6ddd2] text-[#54656f]",
    composer: "border-[#d8cec2] bg-[#fbf7ef]",
    editor: "border-[#d8cec2] bg-white",
    field: "border-[#c8beb3] bg-white text-[#111b21] placeholder:text-[#667781] focus:border-[#128c7e] focus:ring-[#128c7e]/20",
    textarea: "text-[#111b21] placeholder:text-[#667781]",
    toolbar: "border-[#e3d9ce] text-[#111b21]",
    button: "bg-[#008069] text-white hover:bg-[#00a884] disabled:bg-[#d8cec2] disabled:text-[#667781]",
    sendSplit: "border-white/35",
    iconButton: "border-[#d8cec2] bg-[#fbf7ef] text-[#111b21] hover:border-[#128c7e]",
    brandIcon: "bg-[#25d366] text-[#063b2f]",
    avatar: "from-[#075e54] via-[#128c7e] to-[#25d366] text-white",
    liveBadge: "bg-[#dcf8c6] text-[#075e54]",
    statusDot: "bg-[#25d366]",
    connectingBadge: "bg-[#fef3c7] text-[#92400e]",
    connectingDot: "bg-[#f59e0b]",
    strong: "text-[#111b21]",
    muted: "text-[#54656f]",
    subtle: "text-[#667781]"
  },
  dark: {
    page: "bg-[#071016] text-[#e9edef]",
    frame: "border-[#24343d] bg-[#111b21] shadow-black/40",
    sidebar: "border-[#0b2f2a] bg-[#062d28] text-[#e9edef]",
    sidebarActive: "bg-white/12 text-white shadow-inner",
    sidebarHover: "hover:bg-white/8",
    sidebarMuted: "text-[#aebac1]",
    sidebarCard: "border-white/12 bg-white/6 text-[#e9edef]",
    newRoom: "border-white/35 bg-transparent text-[#e9edef] hover:bg-white/10",
    header: "border-[#2a3942] bg-[#111b21]",
    headerStrong: "text-[#e9edef]",
    headerMuted: "text-[#8696a0]",
    roomBar: "border-[#2a3942] bg-[#111b21]",
    chat: "bg-[#0b141a]",
    bubble: "bg-[#202c33] text-[#e9edef] shadow-black/15",
    ownBubble: "bg-[#005c4b] text-[#e9edef] shadow-black/15",
    messageAction: "bg-[#202c33] text-[#aebac1]",
    composer: "border-[#2a3942] bg-[#111b21]",
    editor: "border-[#2a3942] bg-[#202c33]",
    field: "border-[#2a3942] bg-[#202c33] text-[#e9edef] placeholder:text-[#8696a0] focus:border-[#00a884] focus:ring-[#00a884]/20",
    textarea: "text-[#e9edef] placeholder:text-[#8696a0]",
    toolbar: "border-[#2a3942] text-[#e9edef]",
    button: "bg-[#00a884] text-[#07100d] hover:bg-[#25d366] disabled:bg-[#2a3942] disabled:text-[#8696a0]",
    sendSplit: "border-[#07100d]/25",
    iconButton: "border-[#2a3942] bg-[#202c33] text-[#e9edef] hover:border-[#00a884]",
    brandIcon: "bg-[#25d366] text-[#07100d]",
    avatar: "from-[#00a884] via-[#25d366] to-[#5ffc7b] text-[#07100d]",
    liveBadge: "bg-[#25d366]/12 text-[#9fffc0]",
    statusDot: "bg-[#25d366]",
    connectingBadge: "bg-[#f59e0b]/12 text-[#fcd88b]",
    connectingDot: "bg-[#f59e0b]",
    strong: "text-[#e9edef]",
    muted: "text-[#aebac1]",
    subtle: "text-[#8696a0]"
  }
}

export default function ChatRoom({ chatroom, chatrooms, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages)
  const [senderName, setSenderName] = useState(defaultDisplayName)
  const [body, setBody] = useState("")
  const [errors, setErrors] = useState({})
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomErrors, setNewRoomErrors] = useState([])
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(defaultTheme)
  const messagesEndRef = useRef(null)

  const isDark = theme === "dark"
  const tone = tones[theme]
  const participants = useMemo(() => uniqueSenderNames(messages), [messages])

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      {
        channel: "ChatroomChannel",
        chatroom_id: chatroom.id
      },
      {
        connected() {
          setIsConnected(true)
        },

        disconnected() {
          setIsConnected(false)
        },

        rejected() {
          setIsConnected(false)
        },

        received(payload) {
          if (payload.type === "message.created") {
            appendMessage(payload.message)
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [chatroom.id])

  useEffect(() => {
    window.localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (senderName.trim().length > 0) {
      window.localStorage.setItem(DISPLAY_NAME_STORAGE_KEY, senderName)
    } else {
      window.localStorage.removeItem(DISPLAY_NAME_STORAGE_KEY)
    }
  }, [senderName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  async function handleSubmit(event) {
    event.preventDefault()

    const clientErrors = validateMessage(senderName, body)

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    if (isSending) return

    setIsSending(true)
    setErrors({})

    try {
      const response = await fetch(`/chatrooms/${chatroom.id}/messages`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken()
        },
        body: JSON.stringify({
          message: {
            sender_name: senderName,
            body
          }
        })
      })

      const payload = await response.json()

      if (response.ok) {
        appendMessage(payload.message)
        setBody("")
      } else {
        setErrors(payload.errors || {})
      }
    } catch {
      setErrors({ body: ["Message could not be sent. Try again."] })
    } finally {
      setIsSending(false)
    }
  }

  async function handleCreateRoom(event) {
    event.preventDefault()

    if (newRoomName.trim().length === 0) {
      setNewRoomErrors(["Room name can't be blank"])
      return
    }

    if (isCreatingRoom) return

    setIsCreatingRoom(true)
    setNewRoomErrors([])

    try {
      const response = await fetch("/chatrooms", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken()
        },
        body: JSON.stringify({
          chatroom: {
            name: newRoomName
          }
        })
      })

      const payload = await response.json()

      if (response.ok) {
        window.location.assign(`/chatrooms/${payload.chatroom.id}`)
      } else {
        setNewRoomErrors(payload.errors?.name || ["Room could not be created."])
      }
    } catch {
      setNewRoomErrors(["Room could not be created. Try again."])
    } finally {
      setIsCreatingRoom(false)
    }
  }

  return (
    <main className={cx("h-dvh overflow-hidden p-2 sm:p-4", tone.page)}>
      <div
        className={cx(
          "mx-auto grid h-full min-h-0 max-w-[90rem] overflow-hidden rounded-lg border shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none",
          isSidebarCollapsed ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]" : "lg:grid-cols-[20rem_minmax(0,1fr)]",
          tone.frame
        )}
      >
        <Sidebar
          chatroom={chatroom}
          chatrooms={chatrooms}
          isCollapsed={isSidebarCollapsed}
          isCreatingRoom={isCreatingRoom}
          messageCount={messages.length}
          newRoomErrors={newRoomErrors}
          newRoomName={newRoomName}
          onClose={() => setIsSidebarOpen(false)}
          onCreateRoom={handleCreateRoom}
          onNewRoomNameChange={setNewRoomName}
          onToggleCollapse={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
          participants={participants}
          tone={tone}
        />

        <section className="flex min-h-0 min-w-0 flex-col">
          <Header
            chatroom={chatroom}
            isConnected={isConnected}
            isDark={isDark}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
            tone={tone}
          />

          <RoomSummary
            chatroom={chatroom}
            messageCount={messages.length}
            participants={participants}
            tone={tone}
          />

          <div className={cx("min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8 lg:px-28", tone.chat)} aria-live="polite">
            <div className="mx-auto flex max-w-4xl flex-col gap-5">
              {messages.length === 0 ? (
                <EmptyState tone={tone} />
              ) : (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    isOwn={sameSender(message.sender_name, senderName)}
                    message={message}
                    tone={tone}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <Composer
            body={body}
            errors={errors}
            isSending={isSending}
            onBodyChange={setBody}
            onSenderNameChange={setSenderName}
            onSubmit={handleSubmit}
            senderName={senderName}
            tone={tone}
          />
        </section>
      </div>

      <div className={cx("fixed inset-0 z-40 lg:hidden", isSidebarOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <button
          aria-label="Close sidebar"
          className={cx(
            "absolute inset-0 bg-black/35 transition-opacity duration-300 ease-out motion-reduce:transition-none",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
        <div
          className={cx(
            "absolute inset-y-2 left-2 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.5rem)]"
          )}
        >
          <Sidebar
            chatroom={chatroom}
            chatrooms={chatrooms}
            isCollapsed={false}
            isCreatingRoom={isCreatingRoom}
            isDrawer
            messageCount={messages.length}
            newRoomErrors={newRoomErrors}
            newRoomName={newRoomName}
            onClose={() => setIsSidebarOpen(false)}
            onCreateRoom={handleCreateRoom}
            onNewRoomNameChange={setNewRoomName}
            onToggleCollapse={() => setIsSidebarOpen(false)}
            participants={participants}
            tone={tone}
          />
        </div>
      </div>
    </main>
  )

  function appendMessage(message) {
    setMessages((currentMessages) => {
      if (currentMessages.some((currentMessage) => currentMessage.id === message.id)) {
        return currentMessages
      }

      return [...currentMessages, message]
    })
  }
}

function Sidebar({
  chatroom,
  chatrooms,
  isCollapsed,
  isCreatingRoom,
  isDrawer = false,
  messageCount,
  newRoomErrors,
  newRoomName,
  onClose,
  onCreateRoom,
  onNewRoomNameChange,
  onToggleCollapse,
  participants,
  tone
}) {
  return (
    <aside
      className={cx(
        "min-h-0 flex-col border-r px-4 py-5 transition-all duration-300 ease-out motion-reduce:transition-none",
        isDrawer ? "flex h-full" : "hidden lg:flex",
        isCollapsed && "items-center px-3",
        tone.sidebar
      )}
    >
      <div className={cx("flex w-full items-center transition-all duration-300 ease-out motion-reduce:transition-none", isCollapsed ? "justify-center" : "gap-3")}>
        <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-out motion-reduce:transition-none", isCollapsed && "scale-95", tone.brandIcon)}>
          <MessageCircle size={24} strokeWidth={2} />
        </div>
        <SidebarReveal isCollapsed={isCollapsed} className="flex-1">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight">Simpul</p>
            <p className={cx("truncate text-sm", tone.sidebarMuted)}>Realtime chat</p>
          </div>
        </SidebarReveal>

        <div className={cx("flex min-w-0 items-center gap-2 transition-all duration-200 ease-out motion-reduce:transition-none", isCollapsed && "w-0 overflow-hidden opacity-0")}>
          <button
            aria-label={isDrawer ? "Close sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={isDrawer ? onClose : onToggleCollapse}
            type="button"
          >
            {isDrawer ? <ChevronLeft size={19} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {isCollapsed && (
        <button
          aria-label="Expand sidebar"
          className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white motion-reduce:transition-none"
          onClick={onToggleCollapse}
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <nav className={cx("transition-all duration-300 ease-out motion-reduce:transition-none", isCollapsed ? "mt-8 w-full" : "mt-10")}>
        <SidebarSectionTitle isCollapsed={isCollapsed} tone={tone}>Navigation</SidebarSectionTitle>
        <div className={cx("space-y-2", isCollapsed && "flex flex-col items-center")}>
          {chatrooms.map((room) => (
            <a
              className={cx(
                "flex h-12 items-center rounded-lg text-base transition-all duration-300 ease-out motion-reduce:transition-none",
                isCollapsed ? "w-12 justify-center px-0" : "gap-3 px-4",
                room.id === chatroom.id ? tone.sidebarActive : tone.sidebarHover
              )}
              href={`/chatrooms/${room.id}`}
              key={room.id}
              onClick={onClose}
              title={isCollapsed ? room.name : undefined}
            >
              <Hash size={20} />
              <SidebarReveal isCollapsed={isCollapsed}>
                <span>{room.name}</span>
              </SidebarReveal>
            </a>
          ))}
        </div>
      </nav>

      <div className={cx("mt-auto", isCollapsed ? "w-full space-y-3" : "space-y-4")}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <IconMetric icon={<UsersRound size={18} />} label="People" tone={tone} value={participants.length} />
            <IconMetric icon={<MessageCircle size={17} />} label="Messages" tone={tone} value={messageCount} />
            <button
              aria-label="Expand sidebar to create room"
              className={cx("flex h-12 w-12 items-center justify-center rounded-lg border transition", tone.sidebarCard)}
              onClick={onToggleCollapse}
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Metric icon={<UsersRound size={18} />} label="People" tone={tone} value={participants.length} />
              <Metric icon={<MessageCircle size={17} />} label="Messages" tone={tone} value={messageCount} />
            </div>

            <form className="space-y-2" onSubmit={onCreateRoom}>
              <label className="block">
                <span className={cx("mb-1 block text-xs font-semibold uppercase tracking-wide", tone.sidebarMuted)}>New room</span>
                <input
                  aria-label="New room name"
                  className="h-11 w-full rounded-lg border border-white/25 bg-white/10 px-3 text-sm text-white outline-none ring-4 ring-transparent transition placeholder:text-white/55 focus:border-white/60 focus:ring-white/10"
                  id="new-room-name"
                  maxLength={60}
                  onChange={(event) => onNewRoomNameChange(event.target.value)}
                  placeholder="Room name"
                  type="text"
                  value={newRoomName}
                />
              </label>
              <button className={cx("flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", tone.newRoom)} disabled={isCreatingRoom} type="submit">
                <Plus size={17} />
                {isCreatingRoom ? "Creating" : "Create room"}
              </button>
              <FieldError messages={newRoomErrors} />
            </form>
          </>
        )}
      </div>
    </aside>
  )
}

function SidebarReveal({ children, className, isCollapsed }) {
  return (
    <div
      className={cx(
        "min-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-out motion-reduce:transition-none",
        isCollapsed ? "max-w-0 -translate-x-1 opacity-0" : "max-w-56 translate-x-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

function SidebarSectionTitle({ children, isCollapsed, tone }) {
  return (
    <p
      className={cx(
        "overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wide transition-all duration-200 ease-out motion-reduce:transition-none",
        isCollapsed ? "mb-0 max-h-0 max-w-0 opacity-0" : "mb-4 max-h-5 max-w-40 opacity-100",
        tone.sidebarMuted
      )}
    >
      {children}
    </p>
  )
}

function Header({ chatroom, isConnected, isDark, onOpenSidebar, onToggleTheme, tone }) {
  return (
    <header className={cx("flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 sm:px-7", tone.header)}>
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open sidebar"
          className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition lg:hidden", tone.iconButton)}
          onClick={onOpenSidebar}
          type="button"
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">
          <p className={cx("text-xs font-bold uppercase tracking-wide", tone.headerMuted)}>Public room</p>
          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <h1 className={cx("truncate text-xl font-bold", tone.headerStrong)}>{chatroom.name}</h1>
            <Info size={16} className={tone.headerMuted} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge isConnected={isConnected} tone={tone} />

        <button
          aria-label="Toggle theme"
          className={cx("flex h-10 w-10 items-center justify-center rounded-lg border transition", tone.iconButton)}
          onClick={onToggleTheme}
          type="button"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  )
}

function RoomSummary({ chatroom, messageCount, participants, tone }) {
  return (
    <section className={cx("shrink-0 border-b px-4 py-3 sm:px-8", tone.roomBar)}>
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Hash size={22} className={tone.subtle} />
            <h2 className={cx("truncate text-xl font-bold", tone.strong)}>{chatroom.name}</h2>
          </div>
          <p className={cx("mt-1 hidden text-sm sm:block", tone.muted)}>Open group chat for quick notes and live conversation.</p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden sm:block">
            <AvatarStack names={participants} tone={tone} />
          </div>
          <div className={cx("text-right text-xs leading-5 sm:text-sm", tone.muted)}>
            <p>{participants.length} people</p>
            <p>{messageCount} messages</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Composer({ body, errors, isSending, onBodyChange, onSenderNameChange, onSubmit, senderName, tone }) {
  const textareaRef = useRef(null)

  function handleFormatClick(marker, fallbackText) {
    const textarea = textareaRef.current

    if (!textarea) return

    const markerLength = marker.length
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    const hasSelection = selectionStart !== selectionEnd
    const selectedText = body.slice(selectionStart, selectionEnd)

    let nextBody
    let nextSelectionStart
    let nextSelectionEnd

    if (hasSelection) {
      nextBody = `${body.slice(0, selectionStart)}${marker}${selectedText}${marker}${body.slice(selectionEnd)}`
      nextSelectionStart = selectionStart + markerLength
      nextSelectionEnd = nextSelectionStart + selectedText.length
    } else if (body.length > 0) {
      nextBody = `${marker}${body}${marker}`
      nextSelectionStart = markerLength
      nextSelectionEnd = nextBody.length - markerLength
    } else {
      nextBody = `${marker}${fallbackText}${marker}`
      nextSelectionStart = markerLength
      nextSelectionEnd = nextSelectionStart + fallbackText.length
    }

    onBodyChange(nextBody)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd)
    })
  }

  return (
    <form className={cx("shrink-0 border-t px-4 py-3 sm:px-8", tone.composer)} onSubmit={onSubmit}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-end gap-3">
          <Avatar name={senderName || "?"} size="md" tone={tone} />
          <Field label="Display name" messages={errors.sender_name} tone={tone}>
            <input
              aria-label="Display name"
              className={fieldClass(tone, errors.sender_name)}
              maxLength={40}
              onChange={(event) => onSenderNameChange(event.target.value)}
              placeholder="Display name"
              type="text"
              value={senderName}
            />
          </Field>
        </div>

        <Field label="Message" messages={errors.body} tone={tone}>
          <div className={cx("overflow-hidden rounded-lg border", errors.body?.length ? "border-rose-400" : tone.editor)}>
            <div className="flex justify-end px-2 pt-2">
              <div className={cx("flex h-9 items-center gap-3 rounded-lg border px-3", tone.toolbar)}>
                <button
                  aria-label="Bold message text"
                  className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-current/10"
                  onClick={() => handleFormatClick("**", "bold text")}
                  type="button"
                >
                  <Bold size={17} />
                </button>
                <button
                  aria-label="Italic message text"
                  className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-current/10"
                  onClick={() => handleFormatClick("*", "italic text")}
                  type="button"
                >
                  <Italic size={17} />
                </button>
              </div>
            </div>

            <textarea
              aria-label="Message"
              className={cx("max-h-32 min-h-16 w-full resize-none bg-transparent px-4 py-2 text-sm leading-6 outline-none sm:min-h-20", tone.textarea)}
              maxLength={BODY_LIMIT}
              onChange={(event) => onBodyChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Write a message"
              ref={textareaRef}
              rows={2}
              value={body}
            />

            <div className="flex items-center justify-between border-t border-inherit px-4 py-2">
              <p className={cx("text-xs", tone.subtle)}>{body.length}/{BODY_LIMIT}</p>

              <div className="flex items-center gap-3">
                <button className={cx("flex h-10 overflow-hidden rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed", tone.button)} disabled={isSending} type="submit">
                  <span className="flex items-center gap-2 px-4">
                    <Send size={17} />
                    {isSending ? "Sending" : "Send"}
                  </span>
                  <span className={cx("flex w-9 items-center justify-center border-l", tone.sendSplit)}>
                    <ChevronDown size={16} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Field>
      </div>
    </form>
  )
}

function StatusBadge({ isConnected, tone }) {
  const badgeClass = isConnected ? tone.liveBadge : tone.connectingBadge
  const dotClass = isConnected ? tone.statusDot : tone.connectingDot

  return (
    <span className={cx("inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm font-semibold", badgeClass)}>
      <span className={cx("h-2.5 w-2.5 rounded-full", dotClass)} />
      {isConnected ? "Live" : "Connecting"}
    </span>
  )
}

function EmptyState({ tone }) {
  return (
    <div className={cx("mx-auto mt-10 max-w-sm rounded-lg px-6 py-8 text-center", tone.bubble)}>
      <div className={cx("mx-auto flex h-12 w-12 items-center justify-center rounded-lg", tone.brandIcon)}>
        <MessageCircle size={24} />
      </div>
      <h2 className={cx("mt-4 text-base font-semibold", tone.strong)}>No messages yet</h2>
      <p className={cx("mt-1 text-sm leading-6", tone.muted)}>Start the conversation with a display name and a message.</p>
    </div>
  )
}

function MessageBubble({ isOwn, message, tone }) {
  return (
    <article className={cx("group flex items-start gap-3", isOwn && "justify-end")}>
      {!isOwn && <Avatar name={message.sender_name} size="lg" tone={tone} />}

      <div className={cx("min-w-0 max-w-[78%]", isOwn ? "text-right" : "flex-1")}>
        <div className={cx("mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1", isOwn && "justify-end")}>
          <h2 className={cx("text-sm font-bold", tone.strong)}>{message.sender_name}</h2>
          <time className={cx("text-sm", tone.subtle)}>{formatTime(message.created_at)}</time>
        </div>

        <div className={cx("inline-block max-w-full rounded-lg px-4 py-3", isOwn ? `rounded-tr-sm ${tone.ownBubble}` : `rounded-tl-sm ${tone.bubble}`)}>
          <p className="whitespace-pre-wrap break-words text-sm leading-6">{messageParts(message.body)}</p>
        </div>

        {isOwn && (
          <div className={cx("mt-1 flex items-center justify-end gap-1 text-xs", tone.subtle)}>
            <span>read</span>
            <Check size={14} />
          </div>
        )}
      </div>
    </article>
  )
}

function Avatar({ name, size = "lg", tone }) {
  const sizeClass = {
    sm: "h-9 w-9 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-11 w-11 text-base"
  }[size]

  return (
    <div className={cx("flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-sm", tone.avatar, sizeClass)}>
      {initials(name)}
    </div>
  )
}

function AvatarStack({ names, tone }) {
  const visibleNames = names.slice(0, 4)

  if (visibleNames.length === 0) {
    return (
      <div className={cx("flex h-9 w-9 items-center justify-center rounded-full", tone.bubble)}>
        <UsersRound size={16} />
      </div>
    )
  }

  return (
    <div className="flex -space-x-2">
      {visibleNames.map((name) => (
        <Avatar key={name} name={name} size="sm" tone={tone} />
      ))}
    </div>
  )
}

function Metric({ icon, label, value, tone }) {
  return (
    <div className={cx("rounded-lg border p-3", tone.sidebarCard)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-semibold leading-tight">{value}</p>
          <p className={cx("mt-1 text-sm", tone.sidebarMuted)}>{label}</p>
        </div>
        <div className={tone.sidebarMuted}>{icon}</div>
      </div>
    </div>
  )
}

function IconMetric({ icon, label, value, tone }) {
  return (
    <div className={cx("flex h-12 w-12 flex-col items-center justify-center rounded-lg border", tone.sidebarCard)} title={`${value} ${label}`}>
      <span className="text-sm font-semibold leading-none">{value}</span>
      <span className={cx("mt-1", tone.sidebarMuted)}>{icon}</span>
    </div>
  )
}

function Field({ children, label, messages, tone }) {
  return (
    <label className="block min-w-0 flex-1">
      <span className={cx("mb-1 block text-xs font-medium", tone.strong)}>{label}</span>
      {children}
      <FieldError messages={messages} />
    </label>
  )
}

function FieldError({ messages }) {
  if (!messages || messages.length === 0) return null

  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-500">
      <AlertCircle size={14} />
      {messages[0]}
    </p>
  )
}

function fieldClass(tone, messages) {
  return cx(
    "h-11 w-full rounded-lg border px-3 text-sm outline-none ring-4 ring-transparent transition",
    tone.field,
    messages?.length && "border-rose-400 focus:border-rose-400 focus:ring-rose-400/15"
  )
}

function uniqueSenderNames(messages) {
  return [...new Set(messages.map((message) => message.sender_name).filter(Boolean))]
}

function sameSender(messageSenderName, currentSenderName) {
  return messageSenderName.trim().toLowerCase() === currentSenderName.trim().toLowerCase() && currentSenderName.trim().length > 0
}

function initials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return "?"

  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase()
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value))
}

function messageParts(value) {
  const parts = []
  const inlinePattern = /\*\*([\s\S]+?)\*\*|\*([^*]+?)\*/g
  let lastIndex = 0
  let match

  while ((match = inlinePattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index))
    }

    if (match[1]) {
      parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>)
    } else {
      parts.push(<em key={`italic-${match.index}`}>{match[2]}</em>)
    }

    lastIndex = inlinePattern.lastIndex
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex))
  }

  return parts
}

function csrfToken() {
  return document.querySelector("meta[name='csrf-token']")?.content
}

function defaultTheme() {
  const savedTheme = window.localStorage.getItem("theme")

  if (savedTheme === "light" || savedTheme === "dark") return savedTheme

  return "light"
}

function defaultDisplayName() {
  return window.localStorage.getItem(DISPLAY_NAME_STORAGE_KEY) || ""
}

function validateMessage(senderName, body) {
  const errors = {}

  if (senderName.trim().length === 0) {
    errors.sender_name = ["Display name can't be blank"]
  }

  if (body.trim().length === 0) {
    errors.body = ["Message can't be blank"]
  }

  return errors
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}
