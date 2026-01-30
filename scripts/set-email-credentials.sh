#!/bin/bash

# Script to set email credentials on the VPS
# Usage: MAIL_PASSWORD='your-password' ./scripts/set-email-credentials.sh

set -e

VPS_HOST="69.62.121.168"
VPS_USER="root"
DEPLOY_DIR="/opt/taskflow-platform"

if [ -z "$MAIL_PASSWORD" ]; then
    echo "❌ Error: MAIL_PASSWORD environment variable not set"
    echo "Usage: MAIL_PASSWORD='your-password' ./scripts/set-email-credentials.sh"
    exit 1
fi

echo "🔐 Setting email credentials on VPS..."
echo "========================================"

ssh ${VPS_USER}@${VPS_HOST} << EOF
cd ${DEPLOY_DIR}/infrastructure/docker

# Update .env file with email credentials (docker-compose loads .env from current directory)
if [ -f .env ]; then
    # Update existing values
    sed -i 's|^MAIL_HOST=.*|MAIL_HOST=premium269-4.web-hosting.com|' .env
    sed -i 's|^MAIL_PORT=.*|MAIL_PORT=465|' .env
    sed -i 's|^MAIL_USERNAME=.*|MAIL_USERNAME=martin.pfeffer@celox.io|' .env
    sed -i "s|^MAIL_PASSWORD=.*|MAIL_PASSWORD=${MAIL_PASSWORD}|" .env
    echo "✅ Email credentials updated in .env file"
else
    echo "⚠️  .env file not found, creating it..."
    cat > .env << ENVEOF
MAIL_HOST=premium269-4.web-hosting.com
MAIL_PORT=465
MAIL_USERNAME=martin.pfeffer@celox.io
MAIL_PASSWORD=${MAIL_PASSWORD}
ENVEOF
    echo "✅ Created .env file with email credentials"
fi

# Restart task-service to apply new email configuration
echo "🔄 Restarting task-service with new email configuration..."
docker-compose -f docker-compose.prod.yml up -d task-service

echo "✅ Task service restarted with new email configuration"
EOF

echo ""
echo "✅ Email credentials configured successfully!"
echo ""
echo "📧 Email Configuration:"
echo "   Host: premium269-4.web-hosting.com"
echo "   Port: 465 (SSL/TLS)"
echo "   Username: martin.pfeffer@celox.io"
echo "   Password: [configured]"
echo ""
echo "🧪 Test email sending by creating a workflow with an Email node"
