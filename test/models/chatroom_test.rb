require "test_helper"

class ChatroomTest < ActiveSupport::TestCase
  test "requires a name" do
    chatroom = Chatroom.new

    assert_not chatroom.valid?
    assert_includes chatroom.errors[:name], "can't be blank"
  end

  test "normalizes name whitespace" do
    chatroom = Chatroom.create!(name: "  Product   Design  ")

    assert_equal "Product Design", chatroom.name
  end

  test "requires a unique name" do
    chatroom = Chatroom.new(name: "general")

    assert_not chatroom.valid?
    assert_includes chatroom.errors[:name], "has already been taken"
  end

  test "owns messages" do
    chatroom = Chatroom.create!(name: "Support")
    message = chatroom.messages.create!(sender_name: "Yos", body: "Hello")

    assert_equal [ message ], chatroom.messages.to_a
  end
end
