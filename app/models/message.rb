class Message < ApplicationRecord
  belongs_to :chatroom

  after_create_commit :broadcast_created_message

  validates :sender_name, presence: true, length: { maximum: 40 }
  validates :body, presence: true, length: { maximum: 1_000 }

  def chat_payload
    {
      id: id,
      chatroom_id: chatroom_id,
      sender_name: sender_name,
      body: body,
      created_at: created_at.iso8601
    }
  end

  private

  def broadcast_created_message
    ChatroomChannel.broadcast_to(
      chatroom,
      {
        type: "message.created",
        message: chat_payload
      }
    )
  end
end
