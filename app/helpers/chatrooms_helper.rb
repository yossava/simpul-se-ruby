module ChatroomsHelper
  def chatroom_payload(chatroom)
    {
      id: chatroom.id,
      name: chatroom.name
    }
  end

  def messages_payload(messages)
    messages.map do |message|
      {
        id: message.id,
        chatroom_id: message.chatroom_id,
        sender_name: message.sender_name,
        body: message.body,
        created_at: message.created_at.iso8601
      }
    end
  end
end
