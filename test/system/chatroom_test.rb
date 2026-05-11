require "application_system_test_case"

class ChatroomTest < ApplicationSystemTestCase
  test "visitor posts a message" do
    visit root_path

    assert_text "General"

    fill_in "Display name", with: "Yos"
    fill_in "Message", with: "Hello from the browser"
    click_on "Send"

    assert_text "Yos"
    assert_text "Hello from the browser"
  end

  test "visitor can collapse and expand the sidebar" do
    visit root_path

    find("button[aria-label='Collapse sidebar']").click

    assert_selector "button[aria-label='Expand sidebar']"

    find("button[aria-label='Expand sidebar']").click

    assert_selector "button[aria-label='Collapse sidebar']"
  end

  test "display name survives page refresh" do
    visit root_path

    fill_in "Display name", with: "Yos"
    refresh

    assert_field "Display name", with: "Yos"
  end
end
