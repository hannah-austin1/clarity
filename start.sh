#!/bin/bash

# Spiritual Clarity - Quick Start Script

echo "🔮 Starting Spiritual Clarity App..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "✅ Created .env file"
    echo "⚠️  IMPORTANT: Edit .env and add your Hugging Face API key!"
    echo "   Get one FREE at: https://huggingface.co/settings/tokens"
    echo ""
    read -p "Press Enter once you've added your API key to .env..."
fi

# Check if OPENROUTER_API_KEY is set
if grep -q "sk-or-v1-your_token_here" .env 2>/dev/null; then
    echo "⚠️  WARNING: You still need to add your OpenRouter API key to .env"
    echo "   Get one FREE at: https://openrouter.ai/keys"
    echo "   No credit card required!"
    echo ""
fi

echo "🚀 Starting development server..."
echo ""

pnpm dev
