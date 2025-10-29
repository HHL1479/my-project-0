# AI Life Coach Backend - Deployment Guide

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone and navigate to the backend directory
cd backend

# Start with Docker Compose
docker-compose up -d

# The backend will be available at http://localhost:5000
```

### Option 2: Local Development
```bash
# Make the start script executable and run it
chmod +x start.sh
./start.sh

# Or manually:
cd backend
npm install
npm run dev
```

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** or **yarn**

### Optional Software
- **Docker** (for containerized deployment)
- **OpenAI API Key** (for AI task generation features)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai_life_coach

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# OpenAI API (optional - for AI task generation)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### Option B: MongoDB with Docker
```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=ai_life_coach \
  mongo:6.0

# Update your .env file with:
# MONGODB_URI=mongodb://admin:password123@localhost:27017/ai_life_coach?authSource=admin
```

## 🏗️ Building for Production

### Local Production Build
```bash
cd backend
npm install --production
npm run build  # If there's a build step
npm start
```

### Docker Production Build
```bash
cd backend
docker build -t ai-life-coach-backend .
docker run -d \
  --name ai-life-coach-backend \
  -p 5000:5000 \
  --env-file .env \
  ai-life-coach-backend
```

## 🌐 Deployment Options

### 1. Railway.app (Recommended for beginners)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway add
railway deploy

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
```

### 2. Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a your-app-name
git push heroku main
```

### 3. AWS EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js and Git
sudo yum update -y
sudo yum install -y nodejs npm git

# Clone and setup your application
git clone your-repo-url
cd your-repo/backend
npm install --production

# Use PM2 to keep the app running
npm install -g pm2
pm2 start server.js --name ai-life-coach
pm2 startup
pm2 save
```

### 4. DigitalOcean App Platform
```bash
# Create a new app on DigitalOcean
# Connect your GitHub repository
# Configure environment variables
# Deploy automatically on push to main branch
```

## 🔍 Testing the Deployment

### Health Check
```bash
# Check if the API is running
curl http://localhost:5000/api/health

# Should return:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### API Testing
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## 📊 Monitoring & Logs

### Application Logs
```bash
# Local development
npm run dev

# Production with PM2
pm2 logs ai-life-coach

# Docker logs
docker logs ai-life-coach-backend
```

### Database Monitoring
```bash
# MongoDB logs
docker logs mongodb

# Connect to MongoDB
mongosh mongodb://localhost:27017/ai_life_coach
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   
   # Check MongoDB logs
   tail -f /var/log/mongodb/mongod.log
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

3. **CORS Issues**
   ```bash
   # Update FRONTEND_URL in .env file
   FRONTEND_URL=http://your-frontend-domain.com
   ```

4. **JWT Secret Issues**
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Debug Mode
```bash
# Enable debug mode
DEBUG=express:* npm run dev

# Or set in .env
NODE_ENV=development
DEBUG=true
```

## 🛡️ Security Considerations

### Production Checklist
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT_SECRET
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Set up proper CORS configuration
- [ ] Regular security updates
- [ ] Database backup strategy
- [ ] Monitor application logs

### Environment Variables Security
```bash
# Never commit .env file to git
echo ".env" >> .gitignore

# Use different secrets for different environments
dev: JWT_SECRET=dev_secret_123
staging: JWT_SECRET=staging_secret_456  
prod: JWT_SECRET=prod_secret_789
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use a load balancer (Nginx, AWS ELB)
- Session storage in Redis
- Database connection pooling
- Microservices architecture for large scale

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Database indexing
- Caching strategies (Redis)

## 🎉 Next Steps

1. **Frontend Integration**: Connect your React frontend to the API
2. **Custom Domain**: Set up a custom domain with SSL
3. **Monitoring**: Add application monitoring (New Relic, DataDog)
4. **CI/CD**: Set up automated deployment pipeline
5. **User Feedback**: Collect and implement user feedback

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is accessible
4. Test API endpoints individually
5. Review the API documentation in `API.md`

For technical support, refer to the comprehensive documentation included with the backend code.