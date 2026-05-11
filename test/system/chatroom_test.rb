require "application_system_test_case"

class ChatroomTest < ApplicationSystemTestCase
  test "visitor posts a message" do
    visit root_path

    assert_text "General"

    fill_in "Name", with: "Yos"
    fill_in "Message", with: "Hello from the browser"
    click_on "Send"

    assert_text "Yos"
    assert_text "Hello from the browser"
  end
end
