#!/bin/bash

# Auth0 Setup Script for Todo App
# This script helps you set up Auth0 authentication

echo "🔐 Auth0 Todo App Setup"
echo "======================="
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing Auth0 dependency..."
npm install @auth0/auth0-react

if [ $? -ne 0 ]; then
    echo "❌ Failed to install @auth0/auth0-react"
    echo "Please try manually: npm install @auth0/auth0-react"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Step 2: Check for .env.local
echo "🔧 Step 2: Checking environment configuration..."

if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cat > .env.local << EOF
# Auth0 Configuration
# Replace these values with your Auth0 application credentials
# Get these from: https://manage.auth0.com/dashboard

VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
EOF
    echo "✅ Created .env.local - PLEASE UPDATE WITH YOUR AUTH0 CREDENTIALS"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Go to https://auth0.com and create an account"
    echo "   2. Create a new Single Page Application"
    echo "   3. Copy your Domain and Client ID"
    echo "   4. Edit .env.local with your credentials"
    echo "   5. Configure Allowed Callback URLs: http://localhost:5173"
    echo "   6. Configure Allowed Logout URLs: http://localhost:5173"
    echo "   7. Configure Allowed Web Origins: http://localhost:5173"
    echo ""
else
    echo "✅ .env.local exists"
    
    # Check if it has placeholder values
    if grep -q "your-domain.auth0.com" .env.local || grep -q "your-client-id" .env.local; then
        echo "⚠️  .env.local contains placeholder values"
        echo "   Please update with your actual Auth0 credentials"
    else
        echo "✅ .env.local appears to be configured"
    fi
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "To start the development server:"
echo "   npm run dev"
echo ""
