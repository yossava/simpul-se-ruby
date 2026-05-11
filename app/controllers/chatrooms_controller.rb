class ChatroomsController < ApplicationController
  def show
    @chatroom = params[:id] ? Chatroom.find(params[:id]) : Chatroom.find_or_create_by!(name: "General")
    @messages = @chatroom.messages.order(:created_at)
    @chatrooms = Chatroom.order(:name)
  end

  def create
    chatroom = Chatroom.find_or_initialize_by(name: chatroom_params[:name])

    if chatroom.save
      render json: { chatroom: helpers.chatroom_payload(chatroom) }, status: :created
    else
      render json: { errors: chatroom.errors }, status: :unprocessable_content
    end
  end

  private

  def chatroom_params
    params.require(:chatroom).permit(:name)
  end
end
