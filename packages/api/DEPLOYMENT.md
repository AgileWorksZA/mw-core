# MoneyWorks API Deployment Guide

This guide covers deploying the MoneyWorks API to various platforms.

## Prerequisites

- MoneyWorks server accessible from your deployment environment
- Valid MoneyWorks credentials
- Company file on the MoneyWorks server

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MW_HOST` | MoneyWorks server hostname | `moneyworks.company.com` |
| `MW_USERNAME` | MoneyWorks username | `api-user` |
| `MW_PASSWORD` | MoneyWorks password | `secure-password` |
| `MW_COMPANY` | Company file name | `MyCompany.mwd7` |

Optional environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `MW_PORT` | MoneyWorks server port | `6700` |
| `MW_PROTOCOL` | MoneyWorks protocol | `https` |
| `MW_TIMEZONE` | Timezone for date handling | `UTC` |
| `CACHE_TTL` | Cache time-to-live (seconds) | `300` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

## Deployment Options

### 1. Railway (Recommended)

Railway provides automatic deployments from GitHub with zero configuration.

#### Setup Steps:

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/your-org/mw-core.git
   cd mw-core
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to Variables
   - Add all required environment variables
   - Railway will automatically redeploy

4. **Deploy**
   - Railway automatically detects the Dockerfile
   - Deployment starts immediately
   - Access your API at the provided URL

#### Railway-Specific Features:
- Automatic HTTPS
- Built-in monitoring
- Easy rollbacks
- Preview environments

### 2. Docker

Build and run the API using Docker.

#### Local Development:

```bash
# Build from monorepo root
docker build -f packages/api/Dockerfile -t mw-api .

# Run with environment variables
docker run -p 3000:3000 \
  -e MW_HOST=your-server \
  -e MW_USERNAME=your-user \
  -e MW_PASSWORD=your-pass \
  -e MW_COMPANY=your-company \
  mw-api
```

#### Docker Compose:

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: packages/api/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - MW_HOST=${MW_HOST}
      - MW_USERNAME=${MW_USERNAME}
      - MW_PASSWORD=${MW_PASSWORD}
      - MW_COMPANY=${MW_COMPANY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3. Manual Deployment (VPS/EC2)

Deploy to any Linux server with Bun installed.

#### Setup Steps:

1. **Install Bun**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/mw-core.git
   cd mw-core
   ```

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Configure Environment**
   ```bash
   # Copy example environment
   cp packages/api/.env.example packages/api/.env
   
   # Edit with your values
   nano packages/api/.env
   ```

5. **Start with PM2** (recommended)
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start API
   pm2 start "bun run packages/api/src/index.ts" --name mw-api
   
   # Save PM2 config
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx** (optional)
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### 4. Kubernetes

Deploy to Kubernetes cluster using the provided manifests.

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mw-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mw-api
  template:
    metadata:
      labels:
        app: mw-api
    spec:
      containers:
      - name: api
        image: your-registry/mw-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: MW_HOST
          valueFrom:
            secretKeyRef:
              name: mw-secrets
              key: host
        - name: MW_USERNAME
          valueFrom:
            secretKeyRef:
              name: mw-secrets
              key: username
        - name: MW_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mw-secrets
              key: password
        - name: MW_COMPANY
          valueFrom:
            secretKeyRef:
              name: mw-secrets
              key: company
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Post-Deployment

### 1. Verify Deployment

Check the health endpoint:

```bash
curl https://your-api-url/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "checks": {
    "api": "ok",
    "moneyworks": "ok"
  },
  "version": {
    "api": "0.1.0"
  }
}
```

### 2. Access Swagger Documentation

Visit `https://your-api-url/api/v1/swagger` to explore the API.

### 3. Monitor Logs

- **Railway**: View logs in the Railway dashboard
- **Docker**: `docker logs mw-api`
- **PM2**: `pm2 logs mw-api`
- **Kubernetes**: `kubectl logs -l app=mw-api`

### 4. Set Up Monitoring

Consider adding:
- Uptime monitoring (e.g., Pingdom, UptimeRobot)
- Application monitoring (e.g., New Relic, DataDog)
- Log aggregation (e.g., Loggly, Papertrail)

## Troubleshooting

### Connection Issues

1. **Check MoneyWorks accessibility**
   ```bash
   telnet your-mw-server 6700
   ```

2. **Verify credentials**
   - Ensure username/password are correct
   - Check company file name (case-sensitive)

3. **Network/Firewall**
   - Ensure port 6700 is open
   - Check if deployment environment can reach MW server

### Performance Issues

1. **Enable caching**
   - Set appropriate `CACHE_TTL`
   - Monitor cache hit rates

2. **Scale horizontally**
   - Increase replicas in Kubernetes
   - Use load balancer for multiple instances

3. **Optimize queries**
   - Use pagination for large datasets
   - Select only required fields

### Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

Check the response body for detailed error messages.

## Security Considerations

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Secure credentials** - Use secrets management (Railway secrets, K8s secrets, etc.)
3. **Network isolation** - Restrict access to MoneyWorks server
4. **API authentication** - Consider adding API key authentication
5. **Rate limiting** - Implement rate limiting for public APIs

## Support

For deployment issues:
1. Check the [API README](./README.md)
2. Review deployment logs
3. Open an issue on GitHub
4. Contact the MoneyWorks Core team