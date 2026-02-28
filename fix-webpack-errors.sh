#!/bin/bash

# Script to fix webpack module loading errors
# Run this whenever you encounter "Cannot read properties of undefined (reading 'call')" errors

echo "🔧 Fixing webpack module loading errors..."
echo ""

# Step 1: Stop any running dev server
echo "1️⃣ Stopping development server..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Step 2: Clean build cache and dependencies
echo "2️⃣ Cleaning build cache and dependencies..."
rm -rf .next node_modules pnpm-lock.yaml

# Step 3: Clean pnpm store
echo "3️⃣ Cleaning pnpm store..."
pnpm store prune

# Step 4: Reinstall dependencies
echo "4️⃣ Reinstalling dependencies..."
pnpm install

echo ""
echo "✅ Fixed! You can now run 'pnpm dev' to start the development server."
echo ""
echo "💡 Tip: If you still encounter issues, try restarting your IDE/editor."
