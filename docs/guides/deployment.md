# Deployment

Production deployment guide for Luqma.

## Prerequisites

### Server Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 2GB
- Storage: 10GB
- Public IP with HTTPS support

**Software:**
- Java 25+
- Node.js 24+ (build only)
- nginx or Apache
- Systemd
- SSL certificates

**See [Getting Started](getting-started.md#prerequisites) for installation.**

### External Services

- **Spoonacular API Key:** Paid tier recommended. [Setup](configuration.md#getting-a-spoonacular-api-key)
- **Domain:** For HTTPS
- **DNS:** Pointed to server IP

---

## Build

### Backend

```bash
cd backend
./gradlew clean build -x test
# Output: build/libs/luqma-backend.jar
```

### Frontend

```bash
cd frontend
npm run build
# Output: dist/
```

---

## Deploy Backend

### 1. Upload JAR

```bash
scp backend/build/libs/luqma-backend.jar user@server:/opt/luqma/
```

### 2. Configure Environment

```bash
# /opt/luqma/.env
SPOONACULAR_API_KEY=your_prod_key
SPRING_PROFILES_ACTIVE=prod
```

### 3. Create Systemd Service

```ini
# /etc/systemd/system/luqma-backend.service
[Unit]
Description=Luqma Backend
After=network.target

[Service]
Type=simple
User=luqma
WorkingDirectory=/opt/luqma
ExecStart=/usr/bin/java -jar luqma-backend.jar
Restart=always
EnvironmentFile=/opt/luqma/.env

[Install]
WantedBy=multi-user.target
```

### 4. Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable luqma-backend
sudo systemctl start luqma-backend
sudo systemctl status luqma-backend
```

---

## Deploy Frontend

### 1. Upload Build

```bash
scp -r frontend/dist/* user@server:/var/www/luqma/
```

### 2. Configure nginx

```nginx
# /etc/nginx/sites-available/luqma
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /var/www/luqma;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Enable and Restart

```bash
sudo ln -s /etc/nginx/sites-available/luqma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (runs automatically)
sudo certbot renew --dry-run
```

---

## Monitoring

### Health Checks

**Backend:**
```bash
curl https://yourdomain.com/api/v1/actuator/health
```

**Frontend:**
```bash
curl -I https://yourdomain.com
```

### Logs

**Backend:**
```bash
sudo journalctl -u luqma-backend -f
```

**nginx:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Updates

```bash
# 1. Build new version
./gradlew clean build -x test

# 2. Stop service
sudo systemctl stop luqma-backend

# 3. Upload new JAR
scp build/libs/luqma-backend.jar user@server:/opt/luqma/

# 4. Start service
sudo systemctl start luqma-backend

# 5. Verify
curl https://yourdomain.com/api/v1/actuator/health
```

---

## Rollback

```bash
# Keep previous version as backup
cp luqma-backend.jar luqma-backend.jar.backup

# To rollback:
sudo systemctl stop luqma-backend
mv luqma-backend.jar.backup luqma-backend.jar
sudo systemctl start luqma-backend
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Firewall configured (ports 80, 443, 8080 only)
- [ ] `.env` files not world-readable
- [ ] Regular security updates
- [ ] Backups configured
- [ ] Monitoring alerts set up
- [ ] Rate limiting enabled
- [ ] CORS properly configured

---

## Troubleshooting

**Service won't start:**
```bash
sudo journalctl -u luqma-backend -n 50
```

**Port conflicts:**
```bash
sudo lsof -i :8080
```

**nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**SSL issues:**
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

More: [Troubleshooting Guide](../TROUBLESHOOTING.md)
