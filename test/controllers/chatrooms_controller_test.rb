require "test_helper"

class ChatroomsControllerTest < ActionDispatch::IntegrationTest
  test "shows the default chatroom" do
    get root_path

    assert_response :success
    assert_select "#chat-room-root"
  end

  test "shows an existing chatroom" do
    chatroom = chatrooms(:two)

    get chatroom_path(chatroom)

    assert_response :success
    assert_select "#chat-room-root[data-chatroom]"
  end

  test "creates a chatroom" do
    assert_difference -> { Chatroom.count }, 1 do
      post chatrooms_path,
        params: {
          chatroom: {
            name: "Design"
          }
        },
        as: :json
    end

    assert_response :created
    assert_equal "Design", response.parsed_body.dig("chatroom", "name")
  end

  test "returns validation errors when creating a chatroom" do
    assert_no_difference -> { Chatroom.count } do
      post chatrooms_path,
        params: {
          chatroom: {
            name: ""
          }
        },
        as: :json
    end

    assert_response :unprocessable_content
    assert_includes response.parsed_body.dig("errors", "name"), "can't be blank"
  end
end
