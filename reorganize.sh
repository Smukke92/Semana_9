#!/bin/bash

# Salir si hay error
set -e

echo "🔹 Reorganizando proyecto para que hellow-vue sea la raíz..."

# Verificar que la carpeta hellow-vue exista
if [ ! -d "hellow-vue" ]; then
  echo "❌ La carpeta 'hellow-vue' no existe en el directorio actual."
  exit 1
fi

# Mover archivos y carpetas (incluidos ocultos)
echo "📂 Moviendo contenido de hellow-vue a la raíz..."
shopt -s dotglob nullglob
mv hellow-vue/* ./
mv hellow-vue/.* ./ 2>/dev/null || true
rmdir hellow-vue

# Agregar cambios a git
echo "📝 Haciendo commit de la reorganización..."
git add .
git commit -m "Reorganizar proyecto: hellow-vue como raíz, mover backend y frontend dentro"

echo "✅ Reorganización lista. Puedes hacer git push origin main ahora."

