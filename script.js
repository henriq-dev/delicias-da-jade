/* ═══════════════════════════════════════
   Delícias da Jade — Scripts
   v2.0 — Sistema de Carrinho de Compras
═══════════════════════════════════════ */

/* ── CARDÁPIO ── */
const cardapio = {
    "Mini bolo vulcão": [
        { nome: "Brigadeiro tradicional",           preco: 15 },
        { nome: "Brigadeiro c/ Ninho",              preco: 15 },
        { nome: "Brigadeiro c/ Geleia de morango",  preco: 18 },
        { nome: "Ninho tradicional",                preco: 15 },
        { nome: "Ninho c/ Oreo",                    preco: 18 },
        { nome: "Ninho c/ Nutella",                 preco: 18 },
        { nome: "Ninho c/ Geleia de morango",       preco: 18 },
    ],
    "Bolo tradicional": [
        { nome: "Brigadeiro tradicional", preco: 36 },
        { nome: "Brigadeiro c/ Ninho",    preco: 45 },
        { nome: "Ninho tradicional",      preco: 40 },
        { nome: "Maracuja",               preco: 42 },
    ]
};

/* ════════════════════════════════════════
   ESTADO DO CARRINHO
════════════════════════════════════════ */

// Carrega do localStorage ou começa vazio
let carrinho = JSON.parse(localStorage.getItem("jade_carrinho") || "[]");

function salvarCarrinho() {
    localStorage.setItem("jade_carrinho", JSON.stringify(carrinho));
}

/* ════════════════════════════════════════
   NAVBAR + SCROLL
════════════════════════════════════════ */

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
    backToTopBtn.classList.toggle("visible", window.scrollY > 300);
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ════════════════════════════════════════
   FORMULARIO — SELECAO DE ITEM
════════════════════════════════════════ */

function atualizarSabores() {
    const tipo = document.getElementById("tipo").value;
    const sel  = document.getElementById("sabor");
    sel.innerHTML = "";
    cardapio[tipo].forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.nome;
        opt.textContent = item.nome + "  —  R$ " + item.preco.toFixed(2).replace(".", ",");
        sel.appendChild(opt);
    });
    atualizarPreco();
}

function atualizarPreco() {
    const tipo      = document.getElementById("tipo").value;
    const sabor     = document.getElementById("sabor").value;
    const qtd       = parseInt(document.getElementById("quantidade").value) || 1;
    const item      = cardapio[tipo].find(i => i.nome === sabor);
    const total     = item ? item.preco * qtd : 0;
    document.getElementById("preco-display").textContent =
        "R$ " + total.toFixed(2).replace(".", ",");
}

function alterarQuantidade(delta) {
    const input = document.getElementById("quantidade");
    let v = (parseInt(input.value) || 1) + delta;
    if (v < 1)  v = 1;
    if (v > 50) v = 50;
    input.value = v;
    atualizarPreco();
}

document.getElementById("quantidade").addEventListener("input", function () {
    let v = parseInt(this.value);
    if (isNaN(v) || v < 1) this.value = 1;
    else if (v > 50)        this.value = 50;
    atualizarPreco();
});

/* ════════════════════════════════════════
   MASCARA DE TELEFONE
════════════════════════════════════════ */

function aplicarMascaraTelefone(input) {
    input.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length <= 2)       v = v.replace(/(\d{0,2})/, "($1");
        else if (v.length <= 7)  v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        else                     v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
        e.target.value = v;
    });
}

const telFormInput  = document.getElementById("telefone");
const telFinalInput = document.getElementById("telefone-final");
if (telFormInput)  aplicarMascaraTelefone(telFormInput);
if (telFinalInput) aplicarMascaraTelefone(telFinalInput);

/* ════════════════════════════════════════
   VALIDACOES
════════════════════════════════════════ */

function validarNome(nome) {
    return (!nome || nome.trim().length < 2)
        ? "Por favor, informe seu nome completo"
        : null;
}

function validarTelefone(tel) {
    if (!tel) return null;
    const limpo = tel.replace(/\D/g, "");
    return (limpo.length > 0 && limpo.length < 10)
        ? "Telefone invalido. Use o formato (00) 00000-0000"
        : null;
}

function mostrarErro(campoId, mensagem) {
    const input = document.getElementById(campoId);
    const span  = document.getElementById(campoId + "-erro");
    if (!input) return;
    if (mensagem) {
        input.classList.add("error");
        if (span) { span.textContent = mensagem; span.classList.add("show"); }
    } else {
        input.classList.remove("error");
        if (span) { span.textContent = ""; span.classList.remove("show"); }
    }
}

const nomeInput = document.getElementById("nome-final");
if (nomeInput) {
    nomeInput.addEventListener("blur", function () {
        mostrarErro("nome-final", validarNome(this.value));
    });
}

/* ════════════════════════════════════════
   TOAST & LOADING
════════════════════════════════════════ */

function mostrarToast(mensagem, tipo) {
    tipo = tipo || "success";
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.className = "toast " + tipo;
    setTimeout(function () { toast.classList.add("show"); }, 50);
    setTimeout(function () { toast.classList.remove("show"); }, 3200);
}

function mostrarLoading(show) {
    document.getElementById("loadingOverlay").classList.toggle("active", !!show);
}

/* ════════════════════════════════════════
   RENDERIZACAO DO CARRINHO
════════════════════════════════════════ */

function renderizarCarrinho() {
    const wrapper = document.getElementById("carrinho-wrapper");
    const lista   = document.getElementById("carrinho-lista");
    const totalEl = document.getElementById("carrinho-total-valor");

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        wrapper.classList.remove("visivel");
        return;
    }

    wrapper.classList.add("visivel");

    var totalGeral = 0;

    carrinho.forEach(function (item, idx) {
        var subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        var li = document.createElement("li");
        li.className = "carrinho-item";
        li.setAttribute("role", "listitem");
        li.innerHTML =
            '<div class="carrinho-item-info">' +
                '<div class="carrinho-item-titulo">' + item.tipo + '</div>' +
                '<div class="carrinho-item-detalhe">' +
                    item.massa + ' \u00b7 ' + item.sabor + ' \u00b7 ' + item.quantidade + 'x' +
                '</div>' +
            '</div>' +
            '<div class="carrinho-item-preco">R$ ' + subtotal.toFixed(2).replace(".", ",") + '</div>' +
            '<button class="btn-remover-item" onclick="removerItem(' + idx + ')" ' +
                'aria-label="Remover ' + item.sabor + ' do carrinho" title="Remover">\u00d7</button>';

        lista.appendChild(li);
    });

    totalEl.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");

    if (carrinho.length === 1) {
        wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

/* ════════════════════════════════════════
   ADICIONAR AO CARRINHO
════════════════════════════════════════ */

document.getElementById("pedido-form").addEventListener("submit", function (e) {
    e.preventDefault();

    var tipo      = document.getElementById("tipo").value;
    var massa     = document.getElementById("massa").value;
    var sabor     = document.getElementById("sabor").value;
    var qtd       = parseInt(document.getElementById("quantidade").value) || 1;
    var itemRef   = cardapio[tipo].find(function (i) { return i.nome === sabor; });

    if (!itemRef) return;

    // Se ja existe item identico -> atualiza quantidade
    var existente = carrinho.find(function (c) {
        return c.tipo === tipo && c.massa === massa && c.sabor === sabor;
    });

    if (existente) {
        existente.quantidade = Math.min(existente.quantidade + qtd, 50);
        mostrarToast('Quantidade de "' + sabor + '" atualizada!');
    } else {
        carrinho.push({ tipo: tipo, massa: massa, sabor: sabor, quantidade: qtd, preco: itemRef.preco });
        mostrarToast('"' + sabor + '" adicionado ao carrinho!');
    }

    salvarCarrinho();
    renderizarCarrinho();

    // Animacao no botao
    var btn = document.querySelector(".btn-adicionar");
    btn.classList.add("added");
    btn.addEventListener("animationend", function () { btn.classList.remove("added"); }, { once: true });

    // Reseta quantidade
    document.getElementById("quantidade").value = 1;
    atualizarPreco();
});

/* ════════════════════════════════════════
   REMOVER ITEM
════════════════════════════════════════ */

function removerItem(idx) {
    var nome = carrinho[idx] ? carrinho[idx].sabor : "Item";
    carrinho.splice(idx, 1);
    salvarCarrinho();
    renderizarCarrinho();
    mostrarToast('"' + nome + '" removido do carrinho.', "error");
}

/* ════════════════════════════════════════
   LIMPAR CARRINHO
════════════════════════════════════════ */

function limparCarrinho() {
    if (carrinho.length === 0) return;
    if (!confirm("Deseja realmente limpar todo o carrinho?")) return;
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    mostrarToast("Carrinho limpo.", "error");
}

/* ════════════════════════════════════════
   FINALIZAR PEDIDO — WHATSAPP
════════════════════════════════════════ */

function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarToast("Adicione pelo menos um item ao carrinho!", "error");
        return;
    }

    var nome     = document.getElementById("nome-final").value.trim();
    var telefone = document.getElementById("telefone-final").value.trim();
    var obs      = document.getElementById("obs-final").value.trim();

    mostrarErro("nome-final", null);

    var erroNome = validarNome(nome);
    if (erroNome) {
        mostrarErro("nome-final", erroNome);
        mostrarToast("Por favor, informe seu nome.", "error");
        document.getElementById("nome-final").focus();
        return;
    }

    var erroTel = validarTelefone(telefone);
    if (erroTel) {
        mostrarToast(erroTel, "error");
        document.getElementById("telefone-final").focus();
        return;
    }

    mostrarLoading(true);

    // Monta lista de itens
    var totalGeral = 0;
    var listaItens = "";

    carrinho.forEach(function (item, idx) {
        var subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        listaItens +=
            "\n*Item " + (idx + 1) + ":* " + item.tipo +
            "\n   Massa: " + item.massa +
            "\n   Recheio: " + item.sabor +
            "\n   Qtd: " + item.quantidade + "x  |  R$ " + subtotal.toFixed(2).replace(".", ",");
    });

    var mensagem =
        "Ola! Vim pelo site da Delicias da Jade \uD83C\uDF70\n\n" +
        "*\uD83D\uDCCB MEU PEDIDO:*\n" +
        "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501" +
        listaItens + "\n\n" +
        "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n" +
        "\uD83D\uDCB0 *Total: R$ " + totalGeral.toFixed(2).replace(".", ",") + "*\n" +
        "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n" +
        "\uD83D\uDC64 *Nome:* " + nome +
        (telefone ? "\n\uD83D\uDCF1 *Telefone:* " + telefone : "") +
        (obs ? "\n\uD83D\uDCDD *Obs:* " + obs : "") +
        "\n\nGostaria de confirmar disponibilidade! \uD83D\uDC9C";

    setTimeout(function () {
        mostrarLoading(false);
        mostrarToast("Redirecionando para o WhatsApp...");
        setTimeout(function () {
            var url = "https://wa.me/5569992295106?text=" + encodeURIComponent(mensagem);
            window.open(url, "_blank");
        }, 500);
    }, 800);
}

/* ════════════════════════════════════════
   LIGHTBOX DA GALERIA
════════════════════════════════════════ */

var lightbox      = document.getElementById("lightbox");
var lightboxImage = document.getElementById("lightbox-image");
var lightboxCap   = document.getElementById("lightbox-caption");
var lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".gallery-item").forEach(function (item) {
    function abrir() {
        lightboxImage.src = item.querySelector("img").src;
        lightboxImage.alt = item.querySelector("img").alt;
        lightboxCap.textContent = item.querySelector(".gallery-caption").textContent;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    item.addEventListener("click", abrir);
    item.addEventListener("keypress", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
    });
});

function fecharLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}
lightboxClose.addEventListener("click", fecharLightbox);
lightbox.addEventListener("click", function (e) { if (e.target === lightbox) fecharLightbox(); });
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) fecharLightbox();
});

function trapFocus(el) {
    var focusables = el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusables[0], last = focusables[focusables.length - 1];
    el.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault(); } }
        else            { if (document.activeElement === last)  { first.focus(); e.preventDefault(); } }
    });
}
lightbox.addEventListener("transitionend", function () {
    if (lightbox.classList.contains("active")) { lightboxClose.focus(); trapFocus(lightbox); }
});

/* ════════════════════════════════════════
   ANIMACOES DE SCROLL (FADE-IN)
════════════════════════════════════════ */

var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".fade-in").forEach(function (el) { observer.observe(el); });

/* ════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
        e.preventDefault();
        var id = a.getAttribute("href");
        if (id === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
        var alvo = document.querySelector(id);
        if (alvo) {
            var offset = document.getElementById("navbar").offsetHeight + 20;
            window.scrollTo({ top: alvo.offsetTop - offset, behavior: "smooth" });
        }
    });
});

/* ════════════════════════════════════════
   LAZY LOADING FALLBACK
════════════════════════════════════════ */

if (!("loading" in HTMLImageElement.prototype)) {
    var imgObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src || img.src;
                obs.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) { imgObs.observe(img); });
}

/* ════════════════════════════════════════
   INICIALIZACAO
════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {
    atualizarSabores();
    renderizarCarrinho();  // Restaura carrinho salvo no localStorage
    console.log("%c Delicias da Jade", "color:#8b5a9e;font-size:22px;font-weight:bold;");
    console.log("%cCarrinho v2.0 — feito com amor", "color:#c8a2d0;font-size:13px;");
});
