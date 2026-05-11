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

  test "visitor can format message text as bold" do
    visit root_path

    fill_in "Display name", with: "Yos"
    fill_in "Message", with: "bold text"
    find("button[aria-label='Bold message text']").click

    assert_field "Message", with: "**bold text**"

    click_on "Send"

    assert_selector "strong", text: "bold text"
  end

  test "visitor can format message text as italic" do
    visit root_path

    fill_in "Display name", with: "Yos"
    fill_in "Message", with: "italic text"
    find("button[aria-label='Italic message text']").click

    assert_field "Message", with: "*italic text*"

    click_on "Send"

    assert_selector "em", text: "italic text"
  end

  test "message appears before the server responds" do
    visit root_path

    page.execute_script("window.fetch = () => new Promise(() => {})")

    fill_in "Display name", with: "Yos"
    fill_in "Message", with: "Optimistic hello"
    click_on "Send"

    assert_field "Message", with: ""
    assert_text "Optimistic hello"
    assert_text "sending"
  end

  test "failed message is restored to the composer" do
    visit root_path

    page.execute_script("window.fetch = () => Promise.reject(new Error('offline'))")

    fill_in "Display name", with: "Yos"
    fill_in "Message", with: "Bring this back"
    click_on "Send"

    assert_field "Message", with: "Bring this back"
    assert_no_text "sending"
    assert_text "Message could not be sent. Try again."
  end

  test "visitor can move between rooms" do
    visit root_path

    click_on "Random"

    assert_current_path chatroom_path(chatrooms(:two))
    assert_text "Random"
  end

  test "visitor can create a room" do
    visit root_path

    fill_in "New room", with: "Design"
    click_on "Create room"

    chatroom = Chatroom.find_by!(name: "Design")

    assert_current_path chatroom_path(chatroom)
    assert_text "Design"
  end
end
