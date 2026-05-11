require "test_helper"

class ChatroomChannelTest < ActionCable::Channel::TestCase
  test "subscribes to the chatroom stream" do
    chatroom = chatrooms(:one)

    subscribe chatroom_id: chatroom.id

    assert subscription.confirmed?
    assert_has_stream_for chatroom
  end

  test "rejects missing chatroom" do
    subscribe chatroom_id: 0

    assert subscription.rejected?
  end
end
