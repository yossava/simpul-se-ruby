require "test_helper"

class MessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chatroom = chatrooms(:one)
  end

  test "creates a message" do
    assert_difference -> { @chatroom.messages.count }, 1 do
      post chatroom_messages_path(@chatroom),
        params: {
          message: {
            sender_name: "Yos",
            body: "Hello from Rails"
          }
        },
        as: :json
    end

    assert_response :created

    payload = response.parsed_body.fetch("message")

    assert_equal @chatroom.id, payload.fetch("chatroom_id")
    assert_equal "Yos", payload.fetch("sender_name")
    assert_equal "Hello from Rails", payload.fetch("body")
    assert payload.fetch("created_at").present?
  end

  test "returns validation errors" do
    assert_no_difference -> { @chatroom.messages.count } do
      post chatroom_messages_path(@chatroom),
        params: {
          message: {
            sender_name: "",
            body: ""
          }
        },
        as: :json
    end

    assert_response :unprocessable_content

    errors = response.parsed_body.fetch("errors")

    assert_includes errors.fetch("sender_name"), "can't be blank"
    assert_includes errors.fetch("body"), "can't be blank"
  end
end
