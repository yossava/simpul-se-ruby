require "test_helper"

class ChatroomsControllerTest < ActionDispatch::IntegrationTest
  test "shows the default chatroom" do
    get root_path

    assert_response :success
    assert_select "#chat-room-root"
  end
end
