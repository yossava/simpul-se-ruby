require "test_helper"

class ChatroomTest < ActiveSupport::TestCase
  test "requires a name" do
    chatroom = Chatroom.new

    assert_not chatroom.valid?
    assert_includes chatroom.errors[:name], "can't be blank"
  end

  test "owns messages" do
    chatroom = Chatroom.create!(name: "Support")
    message = chatroom.messages.create!(sender_name: "Yos", body: "Hello")

    assert_equal [ message ], chatroom.messages.to_a
  end
end
