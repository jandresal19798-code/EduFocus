#!/bin/bash

# EduFocus Deploy Script
# Este script prepara el proyecto para GitHub y Render

set -e

echo "🚀 EduFocus - Preparando para GitHub..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar Git
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado"
    exit 1
fi

# Inicializar Git si no existe
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git branch -M main
else
    echo "✅ Git ya inicializado"
fi

# Configurar gitignore
echo "📋 Configurando .gitignore..."
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log

# Build outputs
dist/
build/

# Environment files
.env
.env.local

# Database
*.db
*.sqlite
prisma/migrations/

# OS files
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/

# Logs
logs/
*.log

# Expo
.expo/
web-build/
EOF
fi

# Verificar y configurar backend
echo "⚙️ Configurando backend..."
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "📝 Copiado backend/.env.example → backend/.env"
        echo "⚠️  IMPORTANTE: Edita backend/.env con tus credenciales reales"
    fi
fi

# Verificar y configurar mobile
echo "⚙️ Configurando mobile..."
if [ ! -f "mobile/.env" ]; then
    cat > mobile/.env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EOF
    echo "📝 Creado mobile/.env"
fi

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install 2>/dev/null || echo "⚠️  npm install falló (es normal si no hay conexión)"
cd ..

echo ""
echo "========================================"
echo "✅ Preparación completada!"
echo "========================================"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Crea un repositorio en GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Conecta y sube el código:"
echo "   git add ."
echo "   git commit -m 'Initial commit: EduFocus app'"
echo "   git remote add origin https://github.com/TU_USUARIO/EduFocus.git"
echo "   git push -u origin main"
echo ""
echo "3. Configura Render:"
echo "   - Crea PostgreSQL en Render"
echo "   - Crea Web Service para el backend"
echo "   - Añade Environment Variables"
echo ""
echo "📖 Ver README.md para instrucciones detalladas"
echo ""
