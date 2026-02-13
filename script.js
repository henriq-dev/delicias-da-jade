/* ═══════════════════════════════════════
   Delícias da Jade — Scripts
═══════════════════════════════════════ */

/* ── CARDÁPIO ── */
const cardapio = {
    "Mini bolo vulcão": [
        { nome: "Brigadeiro tradicional", preco: 15 },
        { nome: "Brigadeiro c/ Ninho", preco: 15 },
        { nome: "Brigadeiro c/ Geleia de morango", preco: 18 },
        { nome: "Ninho tradicional", preco: 15 },
        { nome: "Ninho c/ Oreo", preco: 18 },
        { nome: "Ninho c/ Nutella", preco: 18 },
        { nome: "Ninho c/ Geleia de morango", preco: 18 },
    ],
    "Bolo tradicional": [
        { nome: "Brigadeiro tradicional", preco: 36 },
        { nome: "Brigadeiro c/ Ninho", preco: 45 },
        { nome: "Ninho tradicional", preco: 40 },
        { nome: "Maracujá", preco: 42 },
    ]
};

/* ── NAVBAR STICKY ── */
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ── BOTÃO VOLTAR AO TOPO ── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ── ATUALIZA OPÇÕES DE RECHEIO CONFORME O TIPO ── */
function atualizarSabores() {
    const tipo = document.getElementById("tipo").value;
    const sel = document.getElementById("sabor");
    sel.innerHTML = "";
    cardapio[tipo].forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.nome;
        opt.textContent = `${item.nome}  —  R$ ${item.preco.toFixed(2).replace(".", ",")}`;
        sel.appendChild(opt);
    });
    atualizarPreco();
}

/* ── ATUALIZA PRÉVIA DE PREÇO ── */
function atualizarPreco() {
    const tipo = document.getElementById("tipo").value;
    const sabor = document.getElementById("sabor").value;
    const quantidade = parseInt(document.getElementById("quantidade").value) || 1;

    const item = cardapio[tipo].find(i => i.nome === sabor);
    const precoUnitario = item ? item.preco : 0;

    const total = precoUnitario * quantidade;

    document.getElementById("preco-display").textContent =
        "R$ " + total.toFixed(2).replace(".", ",");
}

/* ── CONTROLE DE QUANTIDADE ── */
function alterarQuantidade(delta) {
    const input = document.getElementById("quantidade");
    let valor = parseInt(input.value) || 1;
    valor += delta;
    
    // Limita entre 1 e 50
    if (valor < 1) valor = 1;
    if (valor > 50) valor = 50;
    
    input.value = valor;
    atualizarPreco();
}

/* ── MÁSCARA DE TELEFONE ── */
const telefoneInput = document.getElementById("telefone");
if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, "($1");
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
            }
        }
        
        e.target.value = value;
    });
}

/* ── VALIDAÇÕES ── */
function validarNome(nome) {
    if (!nome || nome.trim().length < 2) {
        return "Por favor, informe seu nome completo";
    }
    return null;
}

function validarTelefone(telefone) {
    if (!telefone) return null; // Telefone é opcional
    
    const numeroLimpo = telefone.replace(/\D/g, "");
    if (numeroLimpo.length > 0 && numeroLimpo.length < 10) {
        return "Telefone inválido. Use o formato (00) 00000-0000";
    }
    return null;
}

function mostrarErro(campo, mensagem) {
    const input = document.getElementById(campo);
    const erroSpan = document.getElementById(`${campo}-erro`);
    
    if (mensagem) {
        input.classList.add("error");
        if (erroSpan) {
            erroSpan.textContent = mensagem;
            erroSpan.classList.add("show");
        }
        return false;
    } else {
        input.classList.remove("error");
        if (erroSpan) {
            erroSpan.textContent = "";
            erroSpan.classList.remove("show");
        }
        return true;
    }
}

/* ── TOAST NOTIFICATION ── */
function mostrarToast(mensagem, tipo = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.className = `toast ${tipo}`;
    
    // Mostra o toast
    setTimeout(() => toast.classList.add("show"), 100);
    
    // Esconde após 3 segundos
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* ── LOADING OVERLAY ── */
function mostrarLoading(show = true) {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (show) {
        loadingOverlay.classList.add("active");
    } else {
        loadingOverlay.classList.remove("active");
    }
}

/* ── ENVIAR PEDIDO PELO WHATSAPP ── */
function enviarPedido(event) {
    if (event) event.preventDefault();
    
    // Limpa erros anteriores
    mostrarErro("nome", null);
    mostrarErro("telefone", null);
    
    // Coleta dados
    const tipo = document.getElementById("tipo").value;
    const massa = document.getElementById("massa").value;
    const sabor = document.getElementById("sabor").value;
    const quantidade = document.getElementById("quantidade").value;
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const obs = document.getElementById("obs").value.trim();
    const preco = document.getElementById("preco-display").textContent;
    
    // Validações
    let temErro = false;
    
    const erroNome = validarNome(nome);
    if (erroNome) {
        mostrarErro("nome", erroNome);
        temErro = true;
    }
    
    const erroTelefone = validarTelefone(telefone);
    if (erroTelefone) {
        mostrarErro("telefone", erroTelefone);
        temErro = true;
    }
    
    if (temErro) {
        mostrarToast("Por favor, corrija os erros no formulário", "error");
        // Foca no primeiro campo com erro
        const primeiroErro = document.querySelector(".error");
        if (primeiroErro) primeiroErro.focus();
        return;
    }
    
    // Mostra loading
    mostrarLoading(true);
    
    // Monta mensagem (sem emojis para melhor compatibilidade com WhatsApp)
    const mensagem = `Olá! Vim pelo site da Delícias da Jade

*Pedido:*
Tipo: ${tipo}
Massa: ${massa}
Recheio: ${sabor}
Quantidade: ${quantidade}
Valor: ${preco}

Nome: ${nome}${telefone ? `
Telefone: ${telefone}` : ''}
Obs: ${obs || "Nenhuma"}

Gostaria de confirmar disponibilidade!`;

    // Simula delay de processamento (opcional)
    setTimeout(() => {
        mostrarLoading(false);
        mostrarToast("Redirecionando para WhatsApp...", "success");
        
        // Abre WhatsApp após 500ms
        setTimeout(() => {
            const url = `https://wa.me/5569992295106?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        }, 500);
    }, 800);
}

// Adiciona listener ao formulário
document.getElementById("pedido-form").addEventListener("submit", enviarPedido);

/* ── LIGHTBOX GALERIA ── */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

// Abre lightbox ao clicar em imagem da galeria
document.querySelectorAll(".gallery-item").forEach(item => {
    const abrirLightbox = () => {
        const imageSrc = item.querySelector("img").src;
        const imageAlt = item.querySelector("img").alt;
        const caption = item.querySelector(".gallery-caption").textContent;
        
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCaption.textContent = caption;
        lightbox.classList.add("active");
        
        // Previne scroll da página
        document.body.style.overflow = "hidden";
    };
    
    // Click
    item.addEventListener("click", abrirLightbox);
    
    // Enter key para acessibilidade
    item.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirLightbox();
        }
    });
});

// Fecha lightbox
const fecharLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", fecharLightbox);

// Fecha ao clicar fora da imagem
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        fecharLightbox();
    }
});

// Fecha com tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
        fecharLightbox();
    }
});

/* ── ANIMAÇÕES DE SCROLL (FADE-IN) ── */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { 
        if (e.isIntersecting) {
            e.target.classList.add("visible");
        }
    });
}, { 
    threshold: 0.1, 
    rootMargin: "0px 0px -40px 0px" 
});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

/* ── SMOOTH SCROLL PARA ÂNCORAS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();
        const targetId = a.getAttribute("href");
        
        if (targetId === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.getElementById("navbar").offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }
    });
});

/* ── VALIDAÇÃO EM TEMPO REAL ── */
document.getElementById("nome").addEventListener("blur", function() {
    const erro = validarNome(this.value);
    mostrarErro("nome", erro);
});

if (telefoneInput) {
    telefoneInput.addEventListener("blur", function() {
        const erro = validarTelefone(this.value);
        mostrarErro("telefone", erro);
    });
}

/* ── PREVENÇÃO DE VALORES INVÁLIDOS NA QUANTIDADE ── */
document.getElementById("quantidade").addEventListener("input", function() {
    let valor = parseInt(this.value);
    
    if (isNaN(valor) || valor < 1) {
        this.value = 1;
    } else if (valor > 50) {
        this.value = 50;
    }
    
    atualizarPreco();
});

/* ── LAZY LOADING DE IMAGENS (fallback para navegadores antigos) ── */
if ('loading' in HTMLImageElement.prototype) {
    // Navegador suporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback para navegadores antigos
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ── ANALYTICS DE PERFORMANCE (opcional) ── */
// Registra quando a página está completamente carregada
window.addEventListener('load', () => {
    // Performance timing
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página carregada em ${pageLoadTime}ms`);
    }
});

/* ── INICIALIZAÇÃO ── */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa sabores
    atualizarSabores();
    
    // Log de boas-vindas
    console.log('%c🍰 Delícias da Jade', 'color: #8b5a9e; font-size: 24px; font-weight: bold;');
    console.log('%cSite desenvolvido com amor e dedicação 💜', 'color: #c8a2d0; font-size: 14px;');
    console.log('%cDesenvolvido por: henriq-dev', 'color: #666; font-size: 12px;');
});

/* ── SERVICE WORKER (PWA - opcional) ── */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Descomente a linha abaixo quando tiver um service worker configurado
        // navigator.serviceWorker.register('/sw.js');
    });
}

/* ── ACESSIBILIDADE: Trap focus no lightbox ── */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

// Aplica trap focus quando lightbox abre
lightbox.addEventListener('transitionend', () => {
    if (lightbox.classList.contains('active')) {
        lightboxClose.focus();
        trapFocus(lightbox);
    }
});