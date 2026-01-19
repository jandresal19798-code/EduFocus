#!/bin/bash

# EduFocus - Script de configuración de GROQ_API_KEY
# Este script ayuda a configurar la API key de Groq en Render

set -e

echo "🔑 Configuración de GROQ_API_KEY para EduFocus"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar si ya tiene una key
if [ -n "$GROQ_API_KEY" ]; then
    echo -e "${GREEN}✅ GROQ_API_KEY ya está configurada${NC}"
    echo "Key: ${GROQ_API_KEY:0:10}..."
else
    echo -e "${YELLOW}⚠️  GROQ_API_KEY no encontrada${NC}"
    echo ""
fi

echo ""
echo "📋 Instrucciones para obtener tu GROQ_API_KEY:"
echo ""
echo "1. Ve a https://console.groq.com/keys"
echo "2. Inicia sesión o crea una cuenta"
echo "3. Click en 'Create API Key'"
echo "4. Copia la key generada (comienza con gsk_) "
echo ""
echo "📝 Para agregar la key en Render:"
echo ""
echo "Opción 1: Usando gh CLI (si está configurado)"
echo "  gh variable set GROQ_API_KEY --body 'tu-key-aqui' -R jandresal19798-code/EduFocus"
echo ""
echo "Opción 2: Manual en el dashboard de Render"
echo "  1. Ve a https://dashboard.render.com"
echo "  2. Selecciona tu servicio 'edufocus-api'"
echo "  3. Click en 'Environment'"
echo "  4. Agrega: GROQ_API_KEY=gsk_tu_key_aqui"
echo "  5. Save Changes"
echo ""
echo "Opción 3: Usando curl con tu API key de Render"
echo "  curl -X PUT https://api.render.com/v1/services/YOUR_SERVICE_ID/env-vars/GROQ_API_KEY \\
#     -H \"Authorization: Bearer YOUR_RENDER_API_KEY\" \\
#     -H \"Content-Type: application/json\" \\
#     -d '{\"value\":\"tu-groq-key\"}'"
echo ""

# Verificar estado del tutor
echo "🔍 Verificando estado del tutor IA..."
echo ""

# Token de ejemplo (reemplazar con token real)
EXAMPLE_TOKEN="TU_TOKEN_AQUI"

echo "Para probar el tutor después de configurar la key:"
echo "  curl -X POST https://edufocus-api.onrender.com/api/tutor/conversations \\"
echo "    -H 'Authorization: Bearer \$TOKEN' \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"subject\":\"Matemática\",\"topic\":\"Fracciones\",\"initialMessage\":\"¿Qué es una fracción?\"}'"
echo ""

echo "✅ Configuración completada!"
echo "📌 Recuerda hacer redeploy del servicio en Render después de agregar la key"
