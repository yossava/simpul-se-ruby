module ChatroomsHelper
  def chatroom_payload(chatroom)
    {
      id: chatroom.id,
      name: chatroom.name
    }
  end

  def messages_payload(messages)
    messages.map(&:chat_payload)
  end
end
