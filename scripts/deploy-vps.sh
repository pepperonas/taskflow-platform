#!/bin/bash

set -e

echo "🚀 TaskFlow Platform - VPS Deployment Script"
echo "=============================================="

# Configuration
VPS_HOST="69.62.121.168"
VPS_USER="root"
DEPLOY_DIR="/opt/taskflow-platform"
NGINX_CONF="/etc/nginx/sites-available/taskflow"

echo "📦 Creating deployment directory..."
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${DEPLOY_DIR}"

echo "📤 Uploading files to VPS..."
rsync -avz --exclude='node_modules' --exclude='target' --exclude='.git' \
    ./ ${VPS_USER}@${VPS_HOST}:${DEPLOY_DIR}/

echo "🐳 Installing Docker and Docker Compose on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'EOF'
# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "✅ Docker installation complete"
EOF

echo "🔧 Setting up environment variables..."
ssh ${VPS_USER}@${VPS_HOST} << EOF
cd ${DEPLOY_DIR}
cat > .env << 'ENVEOF'
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

# Frontend
REACT_APP_API_URL=http://${VPS_HOST}:8080/api
REACT_APP_WS_URL=ws://${VPS_HOST}:8080/ws
ENVEOF
EOF

echo "🏗️ Building and starting Docker containers..."
ssh ${VPS_USER}@${VPS_HOST} << EOF
cd ${DEPLOY_DIR}/infrastructure/docker
docker-compose down || true
docker-compose up -d --build
EOF

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking container status..."
ssh ${VPS_USER}@${VPS_HOST} << EOF
cd ${DEPLOY_DIR}/infrastructure/docker
docker-compose ps
EOF

echo "✅ Deployment complete!"
echo ""
echo "📝 Access your application:"
echo "   Frontend: http://${VPS_HOST}:3001"
echo "   Backend API: http://${VPS_HOST}:8080/api"
echo "   Swagger UI: http://${VPS_HOST}:8080/swagger-ui.html"
echo ""
echo "📊 To view logs:"
echo "   ssh ${VPS_USER}@${VPS_HOST}"
echo "   cd ${DEPLOY_DIR}/infrastructure/docker"
echo "   docker-compose logs -f"
