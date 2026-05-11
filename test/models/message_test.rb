require "test_helper"

class MessageTest < ActiveSupport::TestCase
  setup do
    @chatroom = chatrooms(:one)
  end

  test "requires a sender name" do
    message = @chatroom.messages.new(body: "Hello")

    assert_not message.valid?
    assert_includes message.errors[:sender_name], "can't be blank"
  end

  test "limits sender name length" do
    message = @chatroom.messages.new(sender_name: "a" * 41, body: "Hello")

    assert_not message.valid?
    assert_includes message.errors[:sender_name], "is too long (maximum is 40 characters)"
  end

  test "requires a body" do
    message = @chatroom.messages.new(sender_name: "Yos")

    assert_not message.valid?
    assert_includes message.errors[:body], "can't be blank"
  end

  test "limits body length" do
    message = @chatroom.messages.new(sender_name: "Yos", body: "a" * 1_001)

    assert_not message.valid?
    assert_includes message.errors[:body], "is too long (maximum is 1000 characters)"
  end
end
