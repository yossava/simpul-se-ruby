class ChatroomChannel < ApplicationCable::Channel
  def subscribed
    chatroom = Chatroom.find_by(id: params[:chatroom_id])

    if chatroom
      stream_for chatroom
    else
      reject
    end
  end
end
