/* ═══════════════════════════════════════
   Delícias da Jade — Scripts
═══════════════════════════════════════ */

/* ── CARDÁPIO ── */
const cardapio = {
    "Mini bolo vulcão": [
        { nome: "Brigadeiro tradicional",          preco: 15 },
        { nome: "Brigadeiro c/ Ninho",             preco: 15 },
        { nome: "Brigadeiro c/ Geleia de morango", preco: 18 },
        { nome: "Ninho tradicional",               preco: 15 },
        { nome: "Ninho c/ Oreo",                   preco: 18 },
        { nome: "Ninho c/ Nutella",                preco: 18 },
        { nome: "Ninho c/ Geleia de morango",      preco: 18 },
    ],
    "Bolo tradicional": [
        { nome: "Brigadeiro tradicional", preco: 36 },
        { nome: "Brigadeiro c/ Ninho",    preco: 45 },
        { nome: "Ninho tradicional",      preco: 40 },
        { nome: "Maracujá",               preco: 42 },
    ]
};

/* ── ATUALIZA OPÇÕES DE RECHEIO CONFORME O TIPO ── */
function atualizarSabores() {
    const tipo = document.getElementById("tipo").value;
    const sel  = document.getElementById("sabor");
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
    const tipo  = document.getElementById("tipo").value;
    const sabor = document.getElementById("sabor").value;
    const item  = cardapio[tipo].find(i => i.nome === sabor);
    const preco = item ? item.preco : 0;
    document.getElementById("preco-display").textContent =
        "R$ " + preco.toFixed(2).replace(".", ",");
}

/* ── ENVIAR PEDIDO PELO WHATSAPP ── */
function enviarPedido() {
    const tipo      = document.getElementById("tipo").value;
    const massa     = document.getElementById("massa").value;
    const sabor     = document.getElementById("sabor").value;
    const nome      = document.getElementById("nome").value.trim();
    const obs       = document.getElementById("obs").value.trim();
    const preco     = document.getElementById("preco-display").textContent;
    const nomeInput = document.getElementById("nome");

    if (!nome) {
        nomeInput.focus();
        nomeInput.style.borderColor = "#c0392b";
        nomeInput.placeholder = " Por favor, informe seu nome";
        setTimeout(() => {
            nomeInput.style.borderColor = "";
            nomeInput.placeholder = "Digite seu nome";
        }, 2000);
        return;
    }

    const mensagem =
`Olá! Vim pelo site da Delícias da Jade 

*Pedido:*
 Tipo: ${tipo}
 Massa: ${massa}
 Recheio: ${sabor}
 Valor: ${preco}

 Nome: ${nome}
 Obs: ${obs || "Nenhuma"}

Gostaria de confirmar disponibilidade!`;

    const url = `https://wa.me/5569992295106?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

/* ── ANIMAÇÕES DE SCROLL (FADE-IN) ── */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

/* ── SMOOTH SCROLL PARA ÂNCORAS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute("href"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

/* ── INICIALIZAÇÃO ── */
atualizarSabores();