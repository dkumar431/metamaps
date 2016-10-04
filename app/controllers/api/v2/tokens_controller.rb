# frozen_string_literal: true
module Api
  module V2
    class TokensController < RestfulController
      def searchable_columns
        [:description]
      end

      def my_tokens
        authorize resource_class
        instantiate_collection
        respond_with_collection
      end
    end
  end
end
