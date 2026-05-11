class MessagesController < ApplicationController
  def create
    chatroom = Chatroom.find(params[:chatroom_id])
    message = chatroom.messages.build(message_params)

    if message.save
      render json: { message: message_payload(message) }, status: :created
    else
      render json: { errors: message.errors }, status: :unprocessable_content
    end
  end

  private

  def message_params
    params.require(:message).permit(:sender_name, :body)
  end

  def message_payload(message)
    {
      id: message.id,
      chatroom_id: message.chatroom_id,
      sender_name: message.sender_name,
      body: message.body,
      created_at: message.created_at.iso8601
    }
  end
end
