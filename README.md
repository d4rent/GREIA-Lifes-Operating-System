# GREIA - Life's Operating System

A comprehensive multi-service platform connecting properties, services, leisure, and social networking with integrated verification and CRM features.

## Features

### 🏠 Properties
- Verified real estate agents and listings
- Property viewing scheduling
- Secure messaging and payments
- Document verification system

### 🔧 Services  
- Licensed professional services
- Instant booking and payments
- Real-time messaging
- Service guarantees and ratings

### 🎯 Leisure
- Event tickets and bookings
- Restaurant reservations
- Tours and experiences
- Car rental services

### 🤝 Connect
- Professional social networking
- Business CRM tools
- Organization and group management
- Task management system

## Verification System

All listings require comprehensive verification:
- Professional licenses/certifications
- Government ID verification
- Professional photos
- Supporting documentation

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **File Upload**: Multer for document handling

## Local Development

```bash
# Install dependencies
bun install

# Set up database
createdb -h localhost greia_platform

# Run development server
bun dev
```

## Deployment Options

### AWS Amplify (Recommended)
1. Connect your GitHub repository to AWS Amplify
2. Use the included `amplify.yml` build configuration
3. Deploy automatically on git push

### Docker Deployment
```bash
# Build Docker image
docker build -t greia-platform .

# Run container
docker run -p 3000:3000 greia-platform
```

### AWS ECS/Fargate
Use the included Dockerfile for containerized deployment on AWS ECS or Fargate.

## Environment Variables

Create a `.env.local` file:

```env
# Database
PGHOST=localhost
PGPORT=5432
PGDATABASE=greia_platform
PGUSER=your_username
PGPASSWORD=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret

# File Upload
UPLOAD_DIR=./uploads
```

## Database Schema

The application uses PostgreSQL with tables for:
- Users and authentication
- Property listings
- Service providers
- Events and experiences
- Social connections
- CRM data
- Verification documents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
