#!/bin/bash

# ═══════════════════════════════════════════════════════════
# Script de Otimização - Delícias da Jade
# Converte imagens para WebP e minifica CSS/JS
# ═══════════════════════════════════════════════════════════

echo "🍰 Delícias da Jade - Script de Otimização"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ── VERIFICAR DEPENDÊNCIAS ──
echo -e "${BLUE}📦 Verificando dependências...${NC}"

# Verifica cwebp
if ! command -v cwebp &> /dev/null; then
    echo -e "${YELLOW}⚠️  cwebp não encontrado. Instalando...${NC}"
    sudo apt update
    sudo apt install -y webp
fi

# Verifica csso
if ! command -v csso &> /dev/null; then
    echo -e "${YELLOW}⚠️  csso não encontrado. Instalando...${NC}"
    npm install -g csso-cli
fi

# Verifica terser
if ! command -v terser &> /dev/null; then
    echo -e "${YELLOW}⚠️  terser não encontrado. Instalando...${NC}"
    npm install -g terser
fi

echo -e "${GREEN}✓ Todas as dependências instaladas!${NC}"
echo ""

# ── CONVERTER IMAGENS PARA WEBP ──
echo -e "${BLUE}🖼️  Convertendo imagens para WebP...${NC}"

if [ -d "imagens" ]; then
    cd imagens
    count=0
    
    for img in *.jpeg *.jpg *.png 2>/dev/null; do
        if [ -f "$img" ]; then
            filename="${img%.*}"
            
            # Converte com qualidade 85
            cwebp -q 85 "$img" -o "${filename}.webp"
            
            if [ $? -eq 0 ]; then
                original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
                webp_size=$(stat -f%z "${filename}.webp" 2>/dev/null || stat -c%s "${filename}.webp")
                saved=$((original_size - webp_size))
                saved_percent=$((saved * 100 / original_size))
                
                echo -e "${GREEN}  ✓${NC} $img → ${filename}.webp (economizou ${saved_percent}%)"
                ((count++))
            fi
        fi
    done
    
    cd ..
    echo -e "${GREEN}✓ $count imagens convertidas!${NC}"
else
    echo -e "${YELLOW}⚠️  Pasta 'imagens/' não encontrada${NC}"
fi

echo ""

# ── MINIFICAR CSS ──
echo -e "${BLUE}🎨 Minificando CSS...${NC}"

if [ -f "estilo.css" ]; then
    csso estilo.css -o estilo.min.css
    
    if [ $? -eq 0 ]; then
        original_size=$(stat -f%z "estilo.css" 2>/dev/null || stat -c%s "estilo.css")
        mini_size=$(stat -f%z "estilo.min.css" 2>/dev/null || stat -c%s "estilo.min.css")
        saved=$((original_size - mini_size))
        saved_percent=$((saved * 100 / original_size))
        
        echo -e "${GREEN}  ✓${NC} estilo.css → estilo.min.css (economizou ${saved_percent}%)"
    fi
else
    echo -e "${YELLOW}⚠️  Arquivo 'estilo.css' não encontrado${NC}"
fi

echo ""

# ── MINIFICAR JAVASCRIPT ──
echo -e "${BLUE}⚡ Minificando JavaScript...${NC}"

if [ -f "script.js" ]; then
    terser script.js -o script.min.js --compress --mangle
    
    if [ $? -eq 0 ]; then
        original_size=$(stat -f%z "script.js" 2>/dev/null || stat -c%s "script.js")
        mini_size=$(stat -f%z "script.min.js" 2>/dev/null || stat -c%s "script.min.js")
        saved=$((original_size - mini_size))
        saved_percent=$((saved * 100 / original_size))
        
        echo -e "${GREEN}  ✓${NC} script.js → script.min.js (economizou ${saved_percent}%)"
    fi
else
    echo -e "${YELLOW}⚠️  Arquivo 'script.js' não encontrado${NC}"
fi

echo ""
echo -e "${GREEN}✓ Otimização concluída!${NC}"
echo ""
echo "📝 Próximos passos:"
echo "1. Atualize as referências no HTML:"
echo "   <link rel='stylesheet' href='estilo.min.css'>"
echo "   <script src='script.min.js'></script>"
echo ""
echo "2. Use WebP com fallback:"
echo "   <picture>"
echo "     <source srcset='imagens/foto.webp' type='image/webp'>"
echo "     <img src='imagens/foto.jpeg' alt='...'>"
echo "   </picture>"
echo ""
echo "🚀 Seu site agora carrega muito mais rápido!"
