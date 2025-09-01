Rails.application.routes.draw do
  # API versioning
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post '/auth/login', to: 'authentication#login'
      post '/auth/register', to: 'authentication#register'
      post '/auth/refresh', to: 'authentication#refresh'
      delete '/auth/logout', to: 'authentication#logout'
      
      # Location tracking
      resources :locations, only: [:create, :index, :show] do
        collection do
          get :current
          post :track
        end
      end
      
      # Mining operations
      resources :mining_operations, only: [:create, :index, :show, :update] do
        member do
          post :verify_permit
          post :submit_compliance
        end
      end
      
      # Ghana Government API integration
      namespace :government do
        post '/verify_permit', to: 'ghana#verify_permit'
        post '/submit_report', to: 'ghana#submit_report'
        get '/compliance_status/:permit_id', to: 'ghana#compliance_status'
      end
      
      # User management
      resources :users, only: [:show, :update] do
        member do
          get :profile
          post :biometric_enrollment
          post :verify_identity
        end
      end
      
      # Supply chain tracking
      resources :gold_lots, only: [:create, :index, :show, :update] do
        member do
          post :verify_authenticity
          get :chain_of_custody
          post :transfer_ownership
        end
      end
      
      # Payment processing
      resources :payments, only: [:create, :index, :show] do
        member do
          post :check_status
          post :cancel
        end
        
        collection do
          get :stats
          post 'mtn/callback', action: :mtn_callback
          post 'vodafone/callback', action: :vodafone_callback
          get 'providers/health', action: :providers_health
        end
      end
    end
  end
  
  # Health check endpoint
  get '/health', to: 'health#check'
  
  # Root endpoint
  root 'api/v1/base#index'
end