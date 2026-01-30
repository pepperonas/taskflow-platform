#!/bin/bash

set -e

echo "🔧 Fixing KIEZFORM Nginx Configuration"
echo "========================================"

# Configuration
VPS_HOST="69.62.121.168"
VPS_USER="root"

echo "📤 Uploading KIEZFORM nginx configuration..."
scp infrastructure/nginx/kiezform.conf ${VPS_USER}@${VPS_HOST}:/tmp/kiezform.conf

echo "🔧 Setting up KIEZFORM Nginx configuration on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'EOF'
# Copy nginx config
cp /tmp/kiezform.conf /etc/nginx/sites-available/kiezform.de.conf

# Create symlink if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/kiezform.de.conf ]; then
    ln -s /etc/nginx/sites-available/kiezform.de.conf /etc/nginx/sites-enabled/kiezform.de.conf
fi

# Test nginx configuration
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    # Reload nginx
    systemctl reload nginx || service nginx reload
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# Show active nginx sites
echo ""
echo "📋 Active Nginx sites:"
ls -la /etc/nginx/sites-enabled/

# Show which ports are in use
echo ""
echo "🔌 Ports in use:"
netstat -tlnp | grep -E ':(80|443|3001|3002|8080)' || ss -tlnp | grep -E ':(80|443|3001|3002|8080)'
EOF

echo ""
echo "✅ KIEZFORM Nginx configuration updated!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify KIEZFORM is running on the correct port (check output above)"
echo "   2. If KIEZFORM runs on a different port, update /etc/nginx/sites-available/kiezform.de.conf"
echo "   3. Test: https://kiezform.de"
echo ""
echo "🔍 To check which port KIEZFORM uses:"
echo "   ssh ${VPS_USER}@${VPS_HOST}"
echo "   pm2 list  # if using PM2"
echo "   docker ps  # if using Docker"
echo "   netstat -tlnp | grep -E ':(3000|3001|3002|8080)'"
