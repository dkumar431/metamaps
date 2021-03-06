# frozen_string_literal: true

class UserPreference
  attr_accessor :metacodes, :metacode_focus, :follow_topic_on_created, :follow_topic_on_contributed,
                :follow_map_on_created, :follow_map_on_contributed

  def initialize
    @metacodes = init_metacodes.compact
    @metacode_focus = @metacodes[0]
    initialize_follow_settings
  end

  private

  def init_metacodes
    %w[Action Aim Idea Question Note Wildcard Subject].map do |m|
      begin
        metacode = Metacode.find_by(name: m)
        metacode.id.to_s if metacode
      rescue ActiveRecord::StatementInvalid
        if m == 'Action'
          Rails.logger.warn('TODO: remove this travis workaround in user_preference.rb')
        end
      end
    end.compact
  end

  def initialize_follow_settings
    @follow_topic_on_created = false
    @follow_topic_on_contributed = false
    @follow_map_on_created = true
    @follow_map_on_contributed = false
  end
end
