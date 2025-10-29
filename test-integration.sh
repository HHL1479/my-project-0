#!/bin/bash

echo "🚀 AI Life Coach - Integration Test Suite"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Check if backend is running
echo "1. Checking backend server..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    print_status 0 "Backend is running and responding"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend is not accessible"
    print_warning "Make sure to start the backend first:"
    print_warning "cd backend && npm run dev"
    ((TESTS_FAILED++))
fi

# Test 2: Check frontend structure
echo -e "\n2. Checking frontend structure..."
if [ -d "frontend/src" ]; then
    print_status 0 "Frontend source directory exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Frontend source directory not found"
    ((TESTS_FAILED++))
fi

# Check key files
KEY_FILES=(
    "frontend/package.json"
    "frontend/vite.config.js"
    "frontend/src/main.jsx"
    "frontend/src/App.jsx"
    "frontend/src/context/AuthContext.jsx"
    "frontend/src/services/api.js"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
        ((TESTS_PASSED++))
    else
        print_status 1 "$file not found"
        ((TESTS_FAILED++))
    fi
done

# Test 3: Check backend structure
echo -e "\n3. Checking backend structure..."
if [ -d "backend/src" ]; then
    print_status 0 "Backend source directory exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend source directory not found"
    ((TESTS_FAILED++))
fi

# Check backend key files
BACKEND_FILES=(
    "backend/package.json"
    "backend/server.js"
    "backend/models/User.js"
    "backend/routes/auth.js"
    "backend/routes/goals.js"
    "backend/routes/tasks.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
        ((TESTS_PASSED++))
    else
        print_status 1 "$file not found"
        ((TESTS_FAILED++))
    fi
done

# Test 4: Check API documentation
echo -e "\n4. Checking documentation..."
if [ -f "backend/API.md" ]; then
    print_status 0 "API documentation exists"
    ((TESTS_PASSED++))
else
    print_status 1 "API documentation not found"
    ((TESTS_FAILED++))
fi

if [ -f "frontend/README.md" ]; then
    print_status 0 "Frontend documentation exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Frontend documentation not found"
    ((TESTS_FAILED++))
fi

# Test 5: Check environment files
echo -e "\n5. Checking environment configuration..."
if [ -f "backend/.env.example" ]; then
    print_status 0 "Backend environment template exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend environment template not found"
    ((TESTS_FAILED++))
fi

if [ -f "frontend/.env.example" ]; then
    print_status 0 "Frontend environment template exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Frontend environment template not found"
    ((TESTS_FAILED++))
fi

# Test 6: Check start scripts
echo -e "\n6. Checking start scripts..."
if [ -f "frontend/start.sh" ] && [ -x "frontend/start.sh" ]; then
    print_status 0 "Frontend start script exists and is executable"
    ((TESTS_PASSED++))
else
    print_status 1 "Frontend start script not found or not executable"
    ((TESTS_FAILED++))
fi

if [ -f "backend/start.sh" ] && [ -x "backend/start.sh" ]; then
    print_status 0 "Backend start script exists and is executable"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend start script not found or not executable"
    ((TESTS_FAILED++))
fi

# Test 7: Check Docker configuration
echo -e "\n7. Checking Docker configuration..."
if [ -f "backend/Dockerfile" ]; then
    print_status 0 "Backend Dockerfile exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend Dockerfile not found"
    ((TESTS_FAILED++))
fi

if [ -f "backend/docker-compose.yml" ]; then
    print_status 0 "Backend docker-compose.yml exists"
    ((TESTS_PASSED++))
else
    print_status 1 "Backend docker-compose.yml not found"
    ((TESTS_FAILED++))
fi

# Final Summary
echo -e "\n" + "=".repeat(60)
echo "FINAL TEST SUMMARY"
echo "=".repeat(60)

echo -e "\nTests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}The AI Life Coach application is ready to use!${NC}"
    echo -e "\nNext steps:"
    echo "1. Start the backend: cd backend && npm run dev"
    echo "2. Start the frontend: cd frontend && npm run dev"
    echo "3. Open http://localhost:5173 in your browser"
    echo "4. Register an account or use demo credentials:"
    echo "   Email: demo@example.com"
    echo "   Password: demo123"
    echo "5. Start planning your goals!"
else
    echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}Please check the failed tests above and fix any issues.${NC}"
    echo -e "\nCommon issues:"
    echo "- Backend not running: Start it with 'cd backend && npm run dev'"
    echo "- Missing files: Ensure all files are present in the output directory"
    echo "- Permissions: Make sure start scripts are executable"
fi

echo -e "\nFor more information, check the documentation:"
echo "- Backend API: backend/API.md"
echo "- Frontend Guide: frontend/README.md"
echo "- Deployment Guide: DEPLOYMENT_GUIDE.md"
echo "- Project Summary: PROJECT_SUMMARY.md"

echo -e "\n${GREEN}Happy coding! 🚀${NC}"