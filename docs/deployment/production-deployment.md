# Q-Ease Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Domain name with SSL certificate
- Server with minimum 2GB RAM
- SMTP server for email notifications (optional)

---

## 1. Server Setup

### Option A: VPS (DigitalOcean, AWS, etc.)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Option B: Docker Deployment

See `docker-compose.yml` for containerized deployment.

---

## 2. Database Setup

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE qease_production;
CREATE USER qease_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE qease_production TO qease_user;
\q

# Test connection
psql -h localhost -U qease_user -d qease_production
```

---

## 3. Backend Deployment

### Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/q-ease.git
cd q-ease/backend

# Install dependencies
npm install --production

# Copy environment file
cp .env.example .env
```

### Configure Environment

Edit `.env`:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="postgresql://qease_user:your_password@localhost:5432/qease_production"

# JWT
JWT_SECRET="your_very_secure_random_secret_key_here"
JWT_EXPIRES_IN=24h

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Firebase (Optional - for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed
```

### Add Database Indexes

```bash
# Apply performance indexes
psql -h localhost -U qease_user -d qease_production -f prisma/migrations/add_indexes.sql
```

### Start with PM2

```bash
# Start application
pm2 start src/server.js --name qease-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

---

## 4. Frontend Deployment

### Build Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create production .env
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env
echo "VITE_SOCKET_URL=https://api.yourdomain.com" >> .env

# Build for production
npm run build
```

### Deploy Static Files

```bash
# Copy build to web server
sudo cp -r dist/* /var/www/qease/
sudo chown -R www-data:www-data /var/www/qease
```

---

## 5. Nginx Configuration

### Backend Proxy

Create `/etc/nginx/sites-available/qease-api`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO support
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### Frontend Static Files

Create `/etc/nginx/sites-available/qease-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/qease;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/qease-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/qease-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 7. Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs qease-backend

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Log Rotation

Create `/etc/logrotate.d/qease`:

```
/home/user/q-ease/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 user user
    sharedscripts
}
```

---

## 8. Backup Strategy

### Database Backup

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR
pg_dump -h localhost -U qease_user qease_production | gzip > $BACKUP_DIR/qease_$DATE.sql.gz
# Keep only last 7 days
find $BACKUP_DIR -name "qease_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/user/backup-db.sh
```

---

## 9. Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable firewall (UFW)
- [ ] Configure fail2ban
- [ ] Keep system updated
- [ ] Use HTTPS only
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable security headers (Helmet)
- [ ] Audit npm packages regularly

### Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 10. Environment Variables Checklist

**Backend:**
- [ ] NODE_ENV=production
- [ ] DATABASE_URL (production database)
- [ ] JWT_SECRET (strong random string)
- [ ] FRONTEND_URL (production domain)
- [ ] SMTP credentials (if using email)

**Frontend:**
- [ ] VITE_API_URL (production API URL)
- [ ] VITE_SOCKET_URL (production Socket.IO URL)

---

## 11. Post-Deployment Testing

```bash
# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com

# Test API endpoints
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test Socket.IO
# Use browser console on frontend
```

---

## 12. Scaling (Optional)

### Load Balancing

For high traffic, use multiple backend instances:

```nginx
upstream qease_backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    location / {
        proxy_pass http://qease_backend;
    }
}
```

### Redis for Session Storage

```bash
# Install Redis
sudo apt install redis-server

# Update backend to use Redis for sessions
```

---

## 13. Troubleshooting

### Backend won't start
```bash
pm2 logs qease-backend
# Check for database connection errors
# Verify environment variables
```

### Database connection failed
```bash
# Test connection
psql -h localhost -U qease_user -d qease_production
# Check DATABASE_URL format
```

### 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 14. Maintenance

### Update Application

```bash
# Pull latest code
cd /home/user/q-ease
git pull origin main

# Backend
cd backend
npm install --production
npx prisma migrate deploy
pm2 restart qease-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/qease/
```

### Database Maintenance

```bash
# Vacuum database
psql -h localhost -U qease_user -d qease_production -c "VACUUM ANALYZE;"

# Check database size
psql -h localhost -U qease_user -d qease_production -c "SELECT pg_size_pretty(pg_database_size('qease_production'));"
```

---

## Quick Deployment Checklist

- [ ] Server provisioned
- [ ] PostgreSQL installed and configured
- [ ] Database created and migrated
- [ ] Indexes applied
- [ ] Backend environment configured
- [ ] Backend running with PM2
- [ ] Frontend built and deployed
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring set up
- [ ] Post-deployment tests passed

---

**Deployment Time Estimate:** 2-4 hours

**Support:** For issues, check logs in `/home/user/q-ease/backend/logs/`