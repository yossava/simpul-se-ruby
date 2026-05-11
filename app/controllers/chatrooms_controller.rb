class ChatroomsController < ApplicationController
  def show
    @chatroom = Chatroom.find_or_create_by!(name: "General")
    @messages = @chatroom.messages.order(:created_at)
  end
end
