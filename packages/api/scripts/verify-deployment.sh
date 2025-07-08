#!/bin/bash

echo "🔍 Verifying API deployment setup..."
echo ""

# Check if required files exist
echo "📁 Checking required files:"

files=(
  "Dockerfile"
  ".dockerignore"
  ".env.example"
  "railway.json"
  "package.json"
  "src/index.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
  fi
done

echo ""
echo "🔧 Checking environment variables:"

# Check if example env vars are documented
if [ -f ".env.example" ]; then
  echo "✅ Environment variables documented in .env.example"
  echo ""
  echo "Required variables:"
  grep -E "^MW_|^PORT|^NODE_ENV" .env.example | grep -v "^#" | cut -d'=' -f1 | sed 's/^/  - /'
else
  echo "❌ .env.example not found"
fi

echo ""
echo "📦 Checking package.json scripts:"

if [ -f "package.json" ]; then
  echo "Available scripts:"
  grep -A 10 '"scripts"' package.json | grep '"' | grep -v "scripts" | cut -d'"' -f2,4 | sed 's/"/ -> /'
else
  echo "❌ package.json not found"
fi

echo ""
echo "🚀 Deployment readiness:"

if [ -f "Dockerfile" ] && [ -f "railway.json" ] && [ -f ".env.example" ]; then
  echo "✅ API is ready for Railway deployment"
  echo ""
  echo "Next steps:"
  echo "1. Commit these changes to your repository"
  echo "2. Push to GitHub"
  echo "3. Create a new Railway project"
  echo "4. Connect your GitHub repository"
  echo "5. Add the required environment variables"
  echo "6. Deploy!"
else
  echo "❌ Missing required deployment files"
fi