#!/bin/bash

set -e

echo "🚀 TaskFlow Platform - VPS Deployment Script"
echo "=============================================="

# Configuration
VPS_HOST="celox"
DEPLOY_DIR="/opt/taskflow-platform"
NGINX_CONF="/etc/nginx/sites-available/taskflow"

echo "📦 Creating deployment directory..."
ssh ${VPS_HOST} "mkdir -p ${DEPLOY_DIR}"

echo "📤 Uploading files to VPS (excluding large directories)..."
rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='target' \
    --exclude='.git' \
    --exclude='build' \
    --exclude='dist' \
    --exclude='*.log' \
    --exclude='.idea' \
    --exclude='.vscode' \
    --exclude='*.iml' \
    ./ ${VPS_HOST}:${DEPLOY_DIR}/

echo "🐳 Checking Docker installation on VPS..."
ssh ${VPS_HOST} << 'EOF'
# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found, installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker already installed: $(docker --version)"
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose not found, installing..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed: $(docker-compose --version)"
fi
EOF

echo "🔧 Setting up environment variables..."
ssh ${VPS_HOST} << EOF
cd ${DEPLOY_DIR}
cat > .env << ENVEOF
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskflow
DB_USER=taskflow
DB_PASSWORD=taskflow-prod-password-change-me

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
KAFKA_GROUP_ID=taskflow-group

# JWT
JWT_SECRET=taskflow-production-secret-key-please-change-this-to-a-random-string
JWT_EXPIRATION=86400000

# Ports
TASK_SERVICE_PORT=8080
NOTIFICATION_SERVICE_PORT=8081

# Email Configuration (SMTP) - Set via environment variables or update manually
MAIL_HOST=\${MAIL_HOST:-premium269-4.web-hosting.com}
MAIL_PORT=\${MAIL_PORT:-465}
MAIL_USERNAME=\${MAIL_USERNAME:-martin.pfeffer@celox.io}
MAIL_PASSWORD=\${MAIL_PASSWORD:-}

# Frontend
REACT_APP_API_URL=http://${VPS_HOST}:8080/api
REACT_APP_WS_URL=ws://${VPS_HOST}:8080/ws
ENVEOF

# If MAIL_PASSWORD is set as environment variable, update .env file
if [ -n "\$MAIL_PASSWORD" ]; then
    sed -i "s|MAIL_PASSWORD=.*|MAIL_PASSWORD=\$MAIL_PASSWORD|" .env
fi
if [ -n "\$MAIL_USERNAME" ]; then
    sed -i "s|MAIL_USERNAME=.*|MAIL_USERNAME=\$MAIL_USERNAME|" .env
fi
if [ -n "\$MAIL_HOST" ]; then
    sed -i "s|MAIL_HOST=.*|MAIL_HOST=\$MAIL_HOST|" .env
fi
if [ -n "\$MAIL_PORT" ]; then
    sed -i "s|MAIL_PORT=.*|MAIL_PORT=\$MAIL_PORT|" .env
fi
EOF

echo "🔍 Checking current port usage and other services..."
ssh ${VPS_HOST} << 'EOF'
echo "📊 Current ports in use:"
netstat -tlnp 2>/dev/null | grep -E ':(80|443|3001|3002|3003|8080|8081|5432|2181|9092)' || \
ss -tlnp 2>/dev/null | grep -E ':(80|443|3001|3002|3003|8080|8081|5432|2181|9092)' || \
echo "⚠️  Could not check ports (netstat/ss not available)"

echo ""
echo "🐳 Current Docker containers (all):"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No containers running"

echo ""
echo "🔍 TaskFlow containers specifically:"
docker ps --filter "name=docker-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No TaskFlow containers found"

echo ""
echo "📋 PM2 processes (other apps):"
pm2 list 2>/dev/null || echo "PM2 not running or not installed"

echo ""
echo "✅ Port check complete - proceeding with deployment..."
EOF

echo "🏗️ Building and starting Docker containers (incremental update)..."
ssh ${VPS_HOST} << EOF
cd ${DEPLOY_DIR}/infrastructure/docker

# Check if containers are already running
RUNNING_CONTAINERS=\$(docker-compose -f docker-compose.prod.yml ps -q 2>/dev/null | wc -l)

if [ "\$RUNNING_CONTAINERS" -gt 0 ]; then
    echo "📦 Containers are running (\$RUNNING_CONTAINERS containers), performing incremental update..."
    echo "   This will only rebuild and restart changed services..."
    
    # Build only the services that changed (backend and frontend)
    echo "🔨 Building task-service..."
    docker-compose -f docker-compose.prod.yml build task-service || echo "⚠️  Build warning for task-service"
    
    echo "🔨 Building frontend..."
    docker-compose -f docker-compose.prod.yml build frontend || echo "⚠️  Build warning for frontend"
    
    echo "🔨 Building notification-service..."
    docker-compose -f docker-compose.prod.yml build notification-service || echo "⚠️  Build warning for notification-service"
    
    # Restart only the services we rebuilt (without affecting dependencies)
    echo "🔄 Restarting services..."
    docker-compose -f docker-compose.prod.yml up -d --no-deps task-service frontend notification-service
    
    echo "✅ Incremental update complete"
else
    echo "📦 Starting containers for the first time..."
    docker-compose -f docker-compose.prod.yml up -d --build
fi

# Wait for services to be healthy (with timeout)
echo "⏳ Waiting for services to be healthy (max 2 minutes)..."
timeout=120
elapsed=0
healthy=false

while [ \$elapsed -lt \$timeout ]; do
    # Check if postgres is healthy
    POSTGRES_HEALTHY=\$(docker-compose -f docker-compose.prod.yml ps postgres | grep -q "healthy" && echo "yes" || echo "no")
    
    # Check if task-service is running
    TASK_SERVICE_UP=\$(docker-compose -f docker-compose.prod.yml ps task-service | grep -q "Up" && echo "yes" || echo "no")
    
    if [ "\$POSTGRES_HEALTHY" = "yes" ] && [ "\$TASK_SERVICE_UP" = "yes" ]; then
        echo "✅ Services are healthy"
        healthy=true
        break
    fi
    
    sleep 5
    elapsed=\$((elapsed + 5))
    if [ \$((elapsed % 15)) -eq 0 ]; then
        echo "   Still waiting... (\$elapsed/\$timeout seconds)"
    fi
done

if [ "\$healthy" = "false" ]; then
    echo "⚠️  Warning: Services may not be fully healthy yet"
fi

echo ""
echo "🔍 Final container status:"
docker-compose -f docker-compose.prod.yml ps
EOF

echo "🌐 Setting up Nginx configuration..."
ssh ${VPS_HOST} << EOF
# Backup existing nginx config if it exists
if [ -f ${NGINX_CONF} ]; then
    cp ${NGINX_CONF} ${NGINX_CONF}.backup.\$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up existing nginx config"
fi

# Copy nginx config
cp ${DEPLOY_DIR}/infrastructure/nginx/nginx.conf ${NGINX_CONF}

# Create symlink if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/taskflow ]; then
    ln -s ${NGINX_CONF} /etc/nginx/sites-enabled/taskflow
    echo "✅ Created nginx symlink"
fi

# Test nginx configuration
if nginx -t 2>&1; then
    echo "✅ Nginx configuration is valid"
    # Reload nginx (graceful reload, won't drop connections)
    systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null || nginx -s reload
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration test failed! Restoring backup..."
    if [ -f ${NGINX_CONF}.backup.* ]; then
        cp \$(ls -t ${NGINX_CONF}.backup.* | head -1) ${NGINX_CONF}
        echo "✅ Restored backup configuration"
    fi
    exit 1
fi
EOF

echo "🔒 Setting up SSL with Let's Encrypt (if not already configured)..."
ssh ${VPS_HOST} << 'EOF'
if ! [ -d /etc/letsencrypt/live/taskflow.celox.io ]; then
    echo "⚠️  SSL certificate not found. Please run:"
    echo "   certbot --nginx -d taskflow.celox.io"
    echo "   Or configure SSL manually"
else
    echo "✅ SSL certificate already configured"
fi
EOF

echo "✅ Deployment complete!"
echo ""
echo "📝 Access your application:"
echo "   Frontend: https://taskflow.celox.io"
echo "   Backend API: https://taskflow.celox.io/api"
echo "   Swagger UI: https://taskflow.celox.io/swagger-ui.html"
echo ""
echo "📊 To view logs:"
echo "   ssh ${VPS_HOST}"
echo "   cd ${DEPLOY_DIR}/infrastructure/docker"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
