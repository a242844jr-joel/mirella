#!/bin/bash

# Colores para los mensajes
VERDE='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${VERDE}--- Iniciando subida automática a GitHub ---${NC}"

# 1. Añadir todos los cambios
echo "Añadiendo archivos..."
git add .

# 2. Pedir mensaje del commit (con valor por defecto)
echo "Introduce un mensaje para estos cambios (Enter para usar el por defecto: 'Actualización automática'):"
read mensaje

if [ -z "$mensaje" ]; then
    mensaje="Actualización automática"
fi

# 3. Hacer commit
echo "Guardando cambios con el mensaje: '$mensaje'..."
git commit -m "$mensaje"

# 4. Subir a GitHub
echo "Subiendo a GitHub..."
git push origin main

echo -e "${VERDE}¡Listo! Todo está actualizado en GitHub. 🚀${NC}"
