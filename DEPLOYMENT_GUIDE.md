# GREIA Platform Deployment Guide

## Step 1: Push to GitHub

Since we need authentication, follow these steps:

### Option A: Create Personal Access Token (Recommended)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token
5. Run these commands:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/d4rent/GREIA-Lifes-Operating-System.git
git push -u origin main
```

### Option B: Use GitHub CLI
```bash
# Install GitHub CLI if not installed
# Then authenticate and push
gh auth login
git push -u origin main
```

## Step 2: Deploy to AWS

### Option 1: AWS Amplify (Easiest - Recommended)

1. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify/
   - Click "New app" > "Host web app"

2. **Connect Repository**
   - Select "GitHub" as source
   - Authorize AWS Amplify to access your GitHub
   - Select repository: `d4rent/GREIA-Lifes-Operating-System`
   - Select branch: `main`

3. **Configure Build Settings**
   - Amplify will auto-detect the `amplify.yml` file we created
   - Build command: `bun install && bun run build`
   - Output directory: `.next`

4. **Deploy**
   - Click "Save and deploy"
   - Your app will be live at: `https://main.XXXXXX.amplifyapp.com`

### Option 2: AWS EC2 with Docker

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Instance type: t3.medium (recommended)
   - Configure security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect and Setup**
```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Clone your repository
git clone https://github.com/d4rent/GREIA-Lifes-Operating-System.git
cd GREIA-Lifes-Operating-System

# Build and run with Docker
docker build -t greia-platform .
docker run -d -p 80:3000 --name greia-app greia-platform
```

### Option 3: Vercel (Alternative)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-deploy your Next.js app
4. Your app will be live at: `https://your-app.vercel.app`

## Environment Variables

For production, you'll need to set these environment variables:

```env
# Database (if using external PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# File Upload
UPLOAD_DIR=/tmp/uploads

# Next.js
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

## Database Setup

### For AWS RDS PostgreSQL:
1. Create RDS PostgreSQL instance
2. Update DATABASE_URL environment variable
3. Run database migrations (when implemented)

### For local development:
```bash
createdb greia_platform
# Set PGUSER, PGPASSWORD, PGDATABASE environment variables
```

## Domain Setup

### For AWS Amplify:
1. Go to Domain management in Amplify console
2. Add your custom domain
3. Follow DNS configuration instructions

### For EC2:
1. Point your domain's A record to EC2 public IP
2. Set up SSL with Let's Encrypt:
```bash
sudo apt install certbot nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Monitoring and Logs

### AWS Amplify:
- Built-in monitoring and logs in Amplify console

### EC2:
```bash
# View application logs
docker logs greia-app

# Monitor system resources
htop
```

## Next Steps After Deployment

1. **Test all functionality**
   - Properties listings
   - Services booking
   - Leisure experiences
   - Connect/CRM features
   - Verification flow

2. **Set up monitoring**
   - AWS CloudWatch (for AWS deployments)
   - Error tracking (Sentry recommended)

3. **Configure backups**
   - Database backups
   - File upload backups

4. **Security hardening**
   - Enable HTTPS
   - Configure CORS
   - Set up rate limiting

Your GREIA platform is ready for deployment! 🚀
