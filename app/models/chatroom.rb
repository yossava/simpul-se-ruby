class Chatroom < ApplicationRecord
  has_many :messages, dependent: :destroy

  before_validation :normalize_name

  validates :name, presence: true, length: { maximum: 60 }, uniqueness: { case_sensitive: false }

  private

  def normalize_name
    self.name = name.to_s.strip.squeeze(" ")
  end
end
