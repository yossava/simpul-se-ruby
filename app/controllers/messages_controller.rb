class MessagesController < ApplicationController
  def create
    chatroom = Chatroom.find(params[:chatroom_id])
    message = chatroom.messages.build(message_params)

    if message.save
      render json: { message: message.chat_payload }, status: :created
    else
      render json: { errors: message.errors }, status: :unprocessable_content
    end
  end

  private

  def message_params
    params.require(:message).permit(:sender_name, :body)
  end
end
