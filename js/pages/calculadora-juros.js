// ==========================================
// CALCULADORA-JUROS.JS — RealDin
// Simulador de Dívidas + Simulador de Investimentos
// com toggle entre os dois modos
//
// CORREÇÃO APLICADA (2025):
//   - Simulador de Juros migrado para Tabela Price
//     (amortização padrão do mercado brasileiro)
//   - gerarParcelasJuros: saldo agora DECRESCE mês a mês
//   - calcularJurosCompostos: montanteFinal = total desembolsado (PMT × n)
//   - taxaPeriodo: (jurosTotal / principal) × 100 — percentual real
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initModeToggle();
    initSimuladorJuros();
    initSimuladorInvest();
});

// ============================================================
// TOGGLE DE MODO
// ============================================================
function initModeToggle() {
    const modeButtons = document.querySelectorAll('.mode-toggle-btn[data-mode]');
    const panelJuros = document.getElementById('panelJuros');
    const panelInvest = document.getElementById('panelInvest');
    const hero = document.getElementById('heroSection');

    // IDs das seções exclusivas de cada modo
    const sectionsJuros = ['resultsSection', 'freeSection'];
    const sectionsInvest = ['investResultsSection'];

    if (!modeButtons.length || !panelJuros || !panelInvest || !hero) return;

    function showMode(mode) {
        const isJuros = mode === 'juros';

        // Botões (sincroniza todos os toggles presentes na tela)
        modeButtons.forEach((btn) => {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        // Painéis — alterna com animação CSS
        if (isJuros) {
            panelInvest.classList.add('calc-panel--hidden');
            panelJuros.classList.remove('calc-panel--hidden');
        } else {
            panelJuros.classList.add('calc-panel--hidden');
            panelInvest.classList.remove('calc-panel--hidden');
        }

        // Cor de fundo do hero
        hero.classList.toggle('mode-invest', !isJuros);

        // Mostra/esconde seções conforme o modo ativo
        // wasVisible = 'true' significa que o usuário já rodou uma simulação naquele modo
        sectionsJuros.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.display = isJuros && el.dataset.wasVisible === 'true' ? 'block' : 'none';
        });
        sectionsInvest.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.display = !isJuros && el.dataset.wasVisible === 'true' ? 'block' : 'none';
        });

        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => showMode(btn.dataset.mode));
    });
}

// ============================================================
// UTILITÁRIOS COMPARTILHADOS
// ============================================================
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatCompactCurrency(value) {
    const v = Number(value) || 0;
    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
    return `R$ ${v.toFixed(0)}`;
}

function formatPeriodo(meses) {
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const anos = Math.floor(meses / 12);
    const resto = meses % 12;
    const aStr = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    return resto > 0 ? `${aStr} e ${resto} ${resto === 1 ? 'mês' : 'meses'}` : aStr;
}

function bindCurrencyInput(input) {
    if (!input) return;
    input.addEventListener('input', (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw.length) { e.target.value = ''; return; }
        e.target.value = (parseInt(raw) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });
    input.addEventListener('focus', (e) => {
        if (e.target.value === 'R$ 0,00' || e.target.value === '') e.target.value = '';
    });
}

function parseCurrency(str) {
    const raw = (str || '').replace(/\D/g, '');
    return raw.length ? parseInt(raw) / 100 : 0;
}

function updateRangeProgress(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--range-progress', `${pct}%`);
}

// ============================================================
// SIMULADOR DE JUROS (DÍVIDAS)
// ============================================================
let lastDebtChartData = null;
let debtChartResizeBound = false;

function initSimuladorJuros() {
    const debtTypeButtons = document.querySelectorAll('.debt-type-btn');
    const valorInput = document.getElementById('valorDivida');
    const taxaSlider = document.getElementById('taxaJuros');
    const taxaValueEl = document.getElementById('taxaValue');
    const periodoSlider = document.getElementById('periodo');
    const periodoValueEl = document.getElementById('periodoValue');
    const form = document.getElementById('simuladorForm');
    const debtTypeText = document.getElementById('debtTypeText');
    const defaultRateText = document.getElementById('defaultRateText');

    if (!form) return;

    let currentDebtType = 'cartao';

    // Botões de tipo de dívida
    debtTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            debtTypeButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentDebtType = btn.dataset.debtType;
            const rate = btn.dataset.defaultRate;
            taxaSlider.value = rate;
            taxaValueEl.textContent = `${parseFloat(rate).toFixed(1)}%`;
            taxaSlider.setAttribute('aria-valuenow', rate);
            updateRangeProgress(taxaSlider);
            const names = { cartao: 'Cartão de Crédito', emprestimo: 'Empréstimo', cheque: 'Cheque Especial' };
            if (debtTypeText) debtTypeText.textContent = names[currentDebtType];
            if (defaultRateText) defaultRateText.textContent = `${rate}%`;
        });
    });

    // Input moeda
    bindCurrencyInput(valorInput);

    // Slider taxa
    if (taxaSlider) {
        taxaSlider.addEventListener('input', () => {
            taxaValueEl.textContent = `${parseFloat(taxaSlider.value).toFixed(1)}%`;
            taxaSlider.setAttribute('aria-valuenow', taxaSlider.value);
            updateRangeProgress(taxaSlider);
        });
        updateRangeProgress(taxaSlider);
    }

    // Slider período
    if (periodoSlider) {
        periodoSlider.addEventListener('input', () => {
            const m = parseInt(periodoSlider.value);
            periodoValueEl.textContent = `${m} ${m === 1 ? 'mês' : 'meses'}`;
            periodoSlider.setAttribute('aria-valuenow', m);
            updateRangeProgress(periodoSlider);
        });
        updateRangeProgress(periodoSlider);
    }

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valor = parseCurrency(valorInput.value);
        const taxa = parseFloat(taxaSlider.value) / 100;
        const periodo = parseInt(periodoSlider.value);

        if (!valor || valor <= 0) {
            if (typeof Toast !== 'undefined') Toast.show('Por favor, insira um valor válido para a dívida.', 'warning');
            valorInput.focus();
            return;
        }

        const resultado = calcularJurosCompostos(valor, taxa, periodo);
        exibirResultadoJuros(resultado, currentDebtType);
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ============================================================
// CÁLCULO DE JUROS — TABELA PRICE (CORRIGIDO)
//
// Antes: saldo crescia exponencialmente sem nunca ser pago
//        (equivalia a um devedor que jamais faz nenhum pagamento)
//
// Agora: parcela fixa mensal (PMT) abate juros + amortização do principal
//        Fórmula Price: PMT = PV × [i(1+i)^n] / [(1+i)^n − 1]
//        O saldo devedor decresce a cada mês até zerar no último período.
// ============================================================
function calcularJurosCompostos(valorInicial, taxaMensal, meses) {
    const fator = Math.pow(1 + taxaMensal, meses);

    // Parcela fixa mensal (Tabela Price)
    // Caso borda: taxa zero → divisão simples do principal
    const parcelaFixa = taxaMensal === 0
        ? valorInicial / meses
        : valorInicial * (taxaMensal * fator) / (fator - 1);

    const totalPago = parcelaFixa * meses;          // total desembolsado pelo devedor
    const jurosTotal = totalPago - valorInicial;      // custo real do crédito

    // Taxa anual equivalente — base para os alertas de severidade (independe do prazo)
    const taxaAnualEquivalente = (Math.pow(1 + taxaMensal, 12) - 1) * 100;

    // Percentual de juros sobre o principal: quanto a mais o devedor paga
    const taxaPeriodo = (jurosTotal / valorInicial) * 100;

    return {
        valorInicial,
        taxaMensal: taxaMensal * 100,
        taxaAnualEquivalente,
        taxaPeriodo,
        meses,
        montanteFinal: totalPago,   // mantido com o mesmo nome para compatibilidade com o restante do código
        jurosTotal,
        parcelaFixa,
        parcelas: gerarParcelasJuros(valorInicial, taxaMensal, meses, parcelaFixa)
    };
}

// ============================================================
// TABELA PRICE MÊS A MÊS
//
// Antes: saldo += juros  → curva sempre crescente (errado)
// Agora: saldo -= amortização  → curva decrescente até zero (correto)
//
// Cada parcela fixa é composta por:
//   juros       = saldo_devedor_atual × taxa_mensal
//   amortização = parcela_fixa − juros
//   novo_saldo  = saldo_anterior − amortização
//
// No início do contrato os juros dominam a parcela;
// no final, a amortização domina — padrão Price.
// ============================================================
function gerarParcelasJuros(valorInicial, taxaMensal, meses, parcelaFixa) {
    const parcelas = [];
    let saldo = valorInicial;

    for (let i = 1; i <= meses; i++) {
        const juros = saldo * taxaMensal;           // juros do mês (sobre saldo atual)
        const amortizacao = parcelaFixa - juros;          // capital abatido nesta parcela
        const saldoAnterior = saldo;
        saldo = Math.max(0, saldo - amortizacao);         // saldo devedor após pagamento

        parcelas.push({
            mes: i,
            saldoAnterior,
            juros,
            amortizacao,
            parcelaFixa,
            saldoAtual: saldo                            // usado pelo gráfico (curva decrescente)
        });
    }

    return parcelas;
}

function exibirResultadoJuros(resultado, debtType) {
    const resultsSection = document.getElementById('resultsSection');
    const freeSection = document.getElementById('freeSection');

    resultsSection.style.display = 'block';
    resultsSection.dataset.wasVisible = 'true';
    freeSection.style.display = 'block';
    freeSection.dataset.wasVisible = 'true';

    document.getElementById('valorOriginal').textContent = formatarMoeda(resultado.valorInicial);
    document.getElementById('montanteTotal').textContent = formatarMoeda(resultado.montanteFinal);
    document.getElementById('totalJuros').textContent = formatarMoeda(resultado.jurosTotal);
    document.getElementById('percentualJuros').textContent = `${resultado.taxaPeriodo.toFixed(2)}%`;

    // Alertas baseados na taxa ANUAL equivalente (independente do prazo)
    const alertCritical = document.getElementById('alertCritical');
    const alertMessage = alertCritical.querySelector('.alert-message');
    const taxa = resultado.taxaAnualEquivalente;

    alertCritical.removeAttribute('style');
    alertMessage.removeAttribute('style');

    if (taxa > 200) {
        alertCritical.dataset.severity = 'critical';
        alertMessage.innerHTML = `<strong>ALERTA CRÍTICO!</strong> Taxa equivalente a ${taxa.toFixed(0)}% ao ano. Os juros estão consumindo seu dinheiro rapidamente. Renegocie urgente!`;
    } else if (taxa > 100) {
        alertCritical.dataset.severity = 'high';
        alertMessage.innerHTML = `<strong>ATENÇÃO!</strong> Taxa equivalente a ${taxa.toFixed(0)}% ao ano. Considere renegociar ou buscar alternativas com taxas menores.`;
    } else if (taxa > 30) {
        alertCritical.dataset.severity = 'medium';
        alertCritical.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        alertCritical.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        alertMessage.style.color = '#d97706';
        alertMessage.innerHTML = `<strong>CUIDADO!</strong> Taxa equivalente a ${taxa.toFixed(0)}% ao ano. Tente pagar o quanto antes para evitar o crescimento da dívida.`;
    } else {
        alertCritical.dataset.severity = 'low';
        alertCritical.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        alertCritical.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        alertMessage.style.color = '#16a34a';
        alertMessage.innerHTML = `<strong>Taxa Moderada.</strong> Equivalente a ${taxa.toFixed(0)}% ao ano. Mantenha os pagamentos em dia.`;
    }

    updateEducationContent(debtType);
    generateDebtChart(resultado.parcelas);

    // Salva para o comparativo de investimentos
    try {
        localStorage.setItem('ultimaSimulacao', JSON.stringify({
            ...resultado, debtType, timestamp: new Date().toISOString()
        }));
    } catch (_) { }
}

function updateEducationContent(debtType) {
    const titleEl = document.getElementById('educationTitle');
    const descEl = document.getElementById('educationDescription');
    const tipEl = document.getElementById('educationTip');
    const card = document.querySelector('.education-card');
    if (!titleEl) return;

    card.dataset.debtType = debtType;
    const content = {
        cartao: {
            title: 'Cartão de Crédito — Juros Rotativos',
            description: 'O rotativo do cartão de crédito é a modalidade mais cara do mercado. Quando você paga apenas o mínimo da fatura, o restante entra no crédito rotativo, com taxas que podem ultrapassar 400% ao ano. Os juros são compostos — você paga juros sobre juros, fazendo a dívida crescer exponencialmente.',
            tip: '⚠️ O cartão de crédito tem os maiores juros do mercado! Sempre que possível, pague a fatura integralmente. Se não conseguir, busque um empréstimo pessoal para quitar o rotativo — a taxa será muito menor.'
        },
        emprestimo: {
            title: 'Empréstimo Pessoal — Juros Menores',
            description: 'O empréstimo pessoal geralmente possui taxas menores que o cartão de crédito, mas ainda assim pode ser caro dependendo da instituição. Sempre compare as taxas entre diferentes bancos antes de contratar. Quanto maior o prazo, mais juros você pagará no total.',
            tip: '💡 Compare as taxas! Bancos digitais costumam oferecer condições mais competitivas. Considere pagar parcelas maiores quando possível para reduzir o total de juros.'
        },
        cheque: {
            title: 'Cheque Especial — Emergencial Apenas',
            description: 'O cheque especial deve ser usado apenas em emergências absolutas. As taxas são extremamente altas e os juros são cobrados diariamente. O Banco Central limita a taxa máxima em 8% ao mês, mas isso ainda representa quase 150% ao ano.',
            tip: '🚨 Use apenas em emergências! Se já está usando, procure regularizar o quanto antes. Considere migrar a dívida para um empréstimo pessoal com taxa menor ou negociar diretamente com o banco.'
        }
    };

    const s = content[debtType] || content.cartao;
    titleEl.textContent = s.title;
    descEl.textContent = s.description;
    tipEl.textContent = s.tip;
}

// ============================================================
// GRÁFICO DE DÍVIDA — CUSTO ACUMULADO (canvas manual)
//
// Antes: plotava saldoAtual (curva decrescente — confuso para o usuário)
// Agora: plota custo acumulado mês a mês com duas áreas empilhadas:
//   Área cinza (baixo) = principal acumulado pago
//   Área vermelha (cima) = juros acumulados pagos
//
// A curva total cresce da esquerda para a direita, chegando ao
// montante final (PMT × n), tornando o "peso dos juros" visível.
// ============================================================
function generateDebtChart(parcelas) {
    const container = document.getElementById('chartContainer');
    const canvas = document.getElementById('debtChart');
    const placeholder = container?.querySelector('.chart-placeholder');
    if (!canvas || !container) return;

    lastDebtChartData = parcelas;
    if (placeholder) placeholder.style.display = 'none';
    canvas.style.display = 'block';

    const draw = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(320, container.clientWidth - 8);
        const height = Math.max(220, container.clientHeight - 8);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        if (!parcelas.length) return;

        const pad = { top: 24, right: 20, bottom: 40, left: 65 };
        const chartW = width - pad.left - pad.right;
        const chartH = height - pad.top - pad.bottom;

        // Acumula principal pago e juros pagos mês a mês
        let acumPrincipal = 0;
        let acumJuros = 0;
        const pontos = parcelas.map(p => {
            acumPrincipal += p.amortizacao;
            acumJuros += p.juros;
            return {
                mes: p.mes,
                principal: acumPrincipal,           // área cinza (base)
                total: acumPrincipal + acumJuros // área vermelha (topo)
            };
        });

        const maxVal = pontos[pontos.length - 1].total * 1.08;
        const n = pontos.length;

        const xFn = i => n === 1 ? pad.left + chartW / 2 : pad.left + (i / (n - 1)) * chartW;
        const yFn = v => pad.top + chartH - (v / (maxVal || 1)) * chartH;

        // Grid Y
        ctx.strokeStyle = '#e5e7eb';
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px Inter,sans-serif';
        for (let i = 0; i <= 5; i++) {
            const r = i / 5;
            const yp = pad.top + chartH - r * chartH;
            ctx.beginPath(); ctx.moveTo(pad.left, yp); ctx.lineTo(width - pad.right, yp); ctx.stroke();
            ctx.fillText(formatCompactCurrency(r * maxVal), 8, yp + 4);
        }

        // Eixo X
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.left, pad.top + chartH); ctx.lineTo(width - pad.right, pad.top + chartH); ctx.stroke();
        const step = Math.ceil(n / 6);
        ctx.fillStyle = '#9ca3af';
        for (let i = 0; i < n; i += step) ctx.fillText(`${pontos[i].mes}`, xFn(i) - 6, height - 14);
        if ((n - 1) % step !== 0) ctx.fillText(`${pontos[n - 1].mes}`, xFn(n - 1) - 6, height - 14);

        // ── Área cinza: principal acumulado (base) ──────────────
        ctx.beginPath();
        ctx.moveTo(xFn(0), yFn(pontos[0].principal));
        for (let i = 1; i < n; i++) ctx.lineTo(xFn(i), yFn(pontos[i].principal));
        ctx.lineTo(xFn(n - 1), pad.top + chartH);
        ctx.lineTo(xFn(0), pad.top + chartH);
        ctx.closePath();
        ctx.fillStyle = 'rgba(156,163,175,0.35)';
        ctx.fill();

        // ── Área vermelha: juros acumulados (empilhada sobre o principal) ──
        const gradR = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
        gradR.addColorStop(0, 'rgba(232,85,48,0.45)');
        gradR.addColorStop(1, 'rgba(232,85,48,0.08)');
        ctx.beginPath();
        ctx.moveTo(xFn(0), yFn(pontos[0].total));
        for (let i = 1; i < n; i++) ctx.lineTo(xFn(i), yFn(pontos[i].total));
        // desce até a linha do principal (base da área vermelha)
        for (let i = n - 1; i >= 0; i--) ctx.lineTo(xFn(i), yFn(pontos[i].principal));
        ctx.closePath();
        ctx.fillStyle = gradR;
        ctx.fill();

        // ── Linha: total acumulado (topo) ────────────────────────
        ctx.beginPath();
        ctx.moveTo(xFn(0), yFn(pontos[0].total));
        for (let i = 1; i < n; i++) ctx.lineTo(xFn(i), yFn(pontos[i].total));
        ctx.strokeStyle = '#e85530'; ctx.lineWidth = 2.5; ctx.stroke();

        // ── Linha tracejada: principal acumulado ─────────────────
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(xFn(0), yFn(pontos[0].principal));
        for (let i = 1; i < n; i++) ctx.lineTo(xFn(i), yFn(pontos[i].principal));
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.setLineDash([]);

        // ── Ponto final destacado ────────────────────────────────
        const last = n - 1;
        ctx.beginPath();
        ctx.arc(xFn(last), yFn(pontos[last].total), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#e85530'; ctx.fill();

        // ── Labels dos eixos ─────────────────────────────────────
        ctx.fillStyle = '#9ca3af'; ctx.font = '600 11px Inter,sans-serif';
        ctx.fillText('Meses', width / 2 - 20, height - 2);
        ctx.save();
        ctx.translate(13, height / 2 + 30);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Total pago', 0, 0);
        ctx.restore();

        // ── Legenda inline ───────────────────────────────────────
        const lx = pad.left + 8;
        const ly = pad.top + 10;
        ctx.fillStyle = 'rgba(232,85,48,0.5)';
        ctx.fillRect(lx, ly - 8, 12, 10);
        ctx.fillStyle = '#9ca3af'; ctx.font = '10px Inter,sans-serif';
        ctx.fillText('Juros', lx + 16, ly);

        ctx.fillStyle = 'rgba(156,163,175,0.5)';
        ctx.fillRect(lx + 56, ly - 8, 12, 10);
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('Principal', lx + 72, ly);
    };

    draw();

    if (!debtChartResizeBound) {
        window.addEventListener('resize', () => { if (lastDebtChartData) generateDebtChart(lastDebtChartData); });
        debtChartResizeBound = true;
    }
}

// ============================================================
// SIMULADOR DE INVESTIMENTOS
// ============================================================
let lastInvestChartData = null;
let investChartResizeBound = false;

function initSimuladorInvest() {
    const valorInput = document.getElementById('investValor');
    const aporteInput = document.getElementById('investAporte');
    const taxaSlider = document.getElementById('investTaxa');
    const taxaOutput = document.getElementById('investTaxaValue');
    const periodoSlider = document.getElementById('investPeriodo');
    const periodoOutput = document.getElementById('investPeriodoValue');
    const presetBtns = document.querySelectorAll('.invest-preset');
    const form = document.getElementById('investForm');

    if (!form) return;

    bindCurrencyInput(valorInput);
    bindCurrencyInput(aporteInput);

    // Slider taxa
    if (taxaSlider) {
        taxaSlider.addEventListener('input', () => {
            taxaOutput.textContent = `${parseFloat(taxaSlider.value).toFixed(1)}%`;
            updateRangeProgress(taxaSlider);
            presetBtns.forEach(b => b.classList.remove('active'));
        });
        updateRangeProgress(taxaSlider);
    }

    // Slider período
    if (periodoSlider) {
        periodoSlider.addEventListener('input', () => {
            periodoOutput.textContent = formatPeriodo(parseInt(periodoSlider.value));
            updateRangeProgress(periodoSlider);
        });
        updateRangeProgress(periodoSlider);
    }

    // Presets de rentabilidade
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            taxaSlider.value = btn.dataset.taxa;
            taxaOutput.textContent = `${parseFloat(btn.dataset.taxa).toFixed(1)}%`;
            updateRangeProgress(taxaSlider);
        });
    });

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valorInicial = parseCurrency(valorInput.value);
        const aporteMensal = parseCurrency(aporteInput.value);
        const taxaMensal = parseFloat(taxaSlider.value) / 100;
        const meses = parseInt(periodoSlider.value);

        if (valorInicial <= 0 && aporteMensal <= 0) {
            if (typeof Toast !== 'undefined') Toast.show('Insira um valor inicial ou aporte mensal.', 'warning');
            return;
        }

        const resultado = calcularInvestimento(valorInicial, aporteMensal, taxaMensal, meses);
        exibirResultadoInvest(resultado);
        document.getElementById('investResultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Cálculo: M = PV*(1+i)^n + PMT * [((1+i)^n - 1) / i]
function calcularInvestimento(valorInicial, aporteMensal, taxaMensal, meses) {
    const pontos = [];
    let patrimonio = valorInicial;
    let totalAportado = valorInicial;

    for (let mes = 1; mes <= meses; mes++) {
        patrimonio = patrimonio * (1 + taxaMensal) + aporteMensal;
        totalAportado += aporteMensal;
        pontos.push({ mes, patrimonio, totalAportado, rendimento: patrimonio - totalAportado });
    }

    const taxaPeriodo = totalAportado > 0 ? ((patrimonio / totalAportado) - 1) * 100 : 0;

    return {
        valorInicial, aporteMensal, taxaMensal, meses,
        patrimonioFinal: patrimonio,
        totalAportado,
        rendimentoTotal: patrimonio - totalAportado,
        taxaPeriodo,
        pontos
    };
}

function exibirResultadoInvest(resultado) {
    const section = document.getElementById('investResultsSection');
    section.style.display = 'block';
    section.dataset.wasVisible = 'true';

    document.getElementById('investTotalAportado').textContent = formatarMoeda(resultado.totalAportado);
    document.getElementById('investPatrimonio').textContent = formatarMoeda(resultado.patrimonioFinal);
    document.getElementById('investRendimento').textContent = formatarMoeda(resultado.rendimentoTotal);
    document.getElementById('investTaxaPeriodo').textContent = `+${resultado.taxaPeriodo.toFixed(1)}%`;

    // Comparativo com última simulação de dívida
    try {
        const ultima = JSON.parse(localStorage.getItem('ultimaSimulacao'));
        document.getElementById('compareDebito').textContent =
            ultima?.montanteFinal ? formatarMoeda(ultima.montanteFinal) : '—';
    } catch (_) {
        document.getElementById('compareDebito').textContent = '—';
    }
    document.getElementById('compareInvest').textContent = formatarMoeda(resultado.patrimonioFinal);

    lastInvestChartData = resultado.pontos;
    generateInvestChart(resultado.pontos);
}

// Gráfico de investimento (canvas manual)
function generateInvestChart(pontos) {
    const container = document.getElementById('investChartContainer');
    const canvas = document.getElementById('investChart');
    if (!canvas || !container) return;

    lastInvestChartData = pontos;
    canvas.style.display = 'block';

    const draw = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(280, container.clientWidth - 4);
        const height = 280;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        if (!pontos.length) return;

        const pad = { top: 20, right: 20, bottom: 38, left: 65 };
        const chartW = width - pad.left - pad.right;
        const chartH = height - pad.top - pad.bottom;
        const maxVal = Math.max(...pontos.map(p => p.patrimonio)) * 1.08;

        const xFn = i => pad.left + (i / (pontos.length - 1 || 1)) * chartW;
        const yFn = v => pad.top + chartH - (v / (maxVal || 1)) * chartH;

        // Grid Y
        ctx.strokeStyle = '#e5e7eb'; ctx.fillStyle = '#9ca3af'; ctx.font = '11px Inter,sans-serif';
        for (let i = 0; i <= 5; i++) {
            const r = i / 5; const yp = pad.top + chartH - r * chartH;
            ctx.beginPath(); ctx.moveTo(pad.left, yp); ctx.lineTo(width - pad.right, yp); ctx.stroke();
            ctx.fillText(formatCompactCurrency(r * maxVal), 8, yp + 4);
        }

        // Eixo X
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.left, pad.top + chartH); ctx.lineTo(width - pad.right, pad.top + chartH); ctx.stroke();
        const step = Math.ceil(pontos.length / 6); ctx.fillStyle = '#9ca3af';
        for (let i = 0; i < pontos.length; i += step) ctx.fillText(`${pontos[i].mes}`, xFn(i) - 6, height - 8);

        // Área cinza (total aportado)
        ctx.beginPath(); ctx.moveTo(xFn(0), yFn(pontos[0].totalAportado));
        for (let i = 1; i < pontos.length; i++) ctx.lineTo(xFn(i), yFn(pontos[i].totalAportado));
        ctx.lineTo(xFn(pontos.length - 1), pad.top + chartH); ctx.lineTo(xFn(0), pad.top + chartH);
        ctx.closePath(); ctx.fillStyle = 'rgba(209,213,219,0.4)'; ctx.fill();

        // Área verde (patrimônio)
        const gradG = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
        gradG.addColorStop(0, 'rgba(10,158,136,0.28)'); gradG.addColorStop(1, 'rgba(10,158,136,0.03)');
        ctx.beginPath(); ctx.moveTo(xFn(0), yFn(pontos[0].patrimonio));
        for (let i = 1; i < pontos.length; i++) ctx.lineTo(xFn(i), yFn(pontos[i].patrimonio));
        ctx.lineTo(xFn(pontos.length - 1), pad.top + chartH); ctx.lineTo(xFn(0), pad.top + chartH);
        ctx.closePath(); ctx.fillStyle = gradG; ctx.fill();

        // Linha cinza tracejada (aportado)
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(xFn(0), yFn(pontos[0].totalAportado));
        for (let i = 1; i < pontos.length; i++) ctx.lineTo(xFn(i), yFn(pontos[i].totalAportado));
        ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.setLineDash([]);

        // Linha verde sólida (patrimônio)
        ctx.beginPath(); ctx.moveTo(xFn(0), yFn(pontos[0].patrimonio));
        for (let i = 1; i < pontos.length; i++) ctx.lineTo(xFn(i), yFn(pontos[i].patrimonio));
        ctx.strokeStyle = '#0a9e88'; ctx.lineWidth = 2.5; ctx.stroke();

        // Último ponto
        const last = pontos.length - 1;
        ctx.beginPath(); ctx.arc(xFn(last), yFn(pontos[last].patrimonio), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#0a9e88'; ctx.fill();

        // Labels eixos
        ctx.fillStyle = '#9ca3af'; ctx.font = '600 11px Inter,sans-serif';
        ctx.fillText('Meses', width / 2 - 20, height - 1);
        ctx.save(); ctx.translate(13, height / 2 + 20); ctx.rotate(-Math.PI / 2); ctx.fillText('Patrimônio', 0, 0); ctx.restore();
    };

    draw();

    if (!investChartResizeBound) {
        window.addEventListener('resize', () => { if (lastInvestChartData) generateInvestChart(lastInvestChartData); });
        investChartResizeBound = true;
    }
}

// Exportar para testes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calcularJurosCompostos, calcularInvestimento, formatarMoeda };
}
