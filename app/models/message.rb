class Message < ApplicationRecord
  belongs_to :chatroom

  validates :sender_name, presence: true, length: { maximum: 40 }
  validates :body, presence: true, length: { maximum: 1_000 }
end
