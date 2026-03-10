// ==================== CALCULADORA DE JUROS ====================
// Script para gerenciar o simulador de juros compostos

document.addEventListener('DOMContentLoaded', () => {
    initSimulador();
});

let lastChartData = null;
let chartResizeBound = false;

function initSimulador() {
    // Elementos do formulário
    const debtTypeButtons = document.querySelectorAll('.debt-type-btn');
    const valorInput = document.getElementById('valorDivida');
    const taxaSlider = document.getElementById('taxaJuros');
    const taxaValue = document.getElementById('taxaValue');
    const periodoSlider = document.getElementById('periodo');
    const periodoValue = document.getElementById('periodoValue');
    const form = document.getElementById('simuladorForm');
    const debtTypeText = document.getElementById('debtTypeText');
    const defaultRateText = document.getElementById('defaultRateText');

    // Estado atual
    let currentDebtType = 'cartao';

    // ==================== BOTÕES DE TIPO DE DÍVIDA ====================
    debtTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active de todos os botões
            debtTypeButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            // Adiciona active no botão clicado
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            // Atualiza tipo de dívida atual
            currentDebtType = button.dataset.debtType;
            const defaultRate = button.dataset.defaultRate;

            // Atualiza taxa padrão
            taxaSlider.value = defaultRate;
            updateTaxaDisplay(defaultRate);
            updateRangeProgress(taxaSlider);

            // Atualiza texto informativo
            const debtTypeNames = {
                cartao: 'Cartão de Crédito',
                emprestimo: 'Empréstimo',
                cheque: 'Cheque Especial'
            };

            debtTypeText.textContent = debtTypeNames[currentDebtType];
            defaultRateText.textContent = `${defaultRate}%`;
        });
    });

    // ==================== FORMATAÇÃO DE MOEDA ====================
    if (valorInput) {
        valorInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length === 0) {
                e.target.value = '';
                return;
            }

            // Converte para número
            const numValue = parseInt(value) / 100;

            // Formata como moeda brasileira
            e.target.value = numValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        });

        valorInput.addEventListener('focus', (e) => {
            if (e.target.value === 'R$ 0,00' || e.target.value === '') {
                e.target.value = '';
            }
        });
    }

    // ==================== SLIDER DE TAXA ====================
    if (taxaSlider) {
        taxaSlider.addEventListener('input', (e) => {
            updateTaxaDisplay(e.target.value);
            updateRangeProgress(taxaSlider);
        });

        // Inicializa progresso
        updateRangeProgress(taxaSlider);
    }

    function updateTaxaDisplay(value) {
        const formattedValue = parseFloat(value).toFixed(1);
        taxaValue.textContent = `${formattedValue}%`;
        taxaSlider.setAttribute('aria-valuenow', value);
    }

    // ==================== SLIDER DE PERÍODO ====================
    if (periodoSlider) {
        periodoSlider.addEventListener('input', (e) => {
            updatePeriodoDisplay(e.target.value);
            updateRangeProgress(periodoSlider);
        });

        // Inicializa progresso
        updateRangeProgress(periodoSlider);
    }

    function updatePeriodoDisplay(value) {
        const meses = parseInt(value);
        periodoValue.textContent = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
        periodoSlider.setAttribute('aria-valuenow', value);
    }

    // ==================== ATUALIZAR PROGRESSO DO RANGE ====================
    function updateRangeProgress(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;

        slider.style.setProperty('--range-progress', `${percentage}%`);
    }

    // ==================== SUBMISSÃO DO FORMULÁRIO ====================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obter valores
            const valorString = valorInput.value.replace(/\D/g, '');
            const valor = parseInt(valorString) / 100;
            const taxa = parseFloat(taxaSlider.value) / 100; // Convertendo para decimal
            const periodo = parseInt(periodoSlider.value);

            // Validações
            if (!valor || valor <= 0) {
                Toast.show('Por favor, insira um valor válido para a dívida.', 'warning');
                valorInput.focus();
                return;
            }

            // Calcular juros compostos
            const resultado = calcularJurosCompostos(valor, taxa, periodo);

            // Exibir resultado na seção de resultados
            exibirResultado(resultado, currentDebtType);

            // Scroll suave até os resultados
            document.getElementById('resultsSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// ==================== CÁLCULO DE JUROS COMPOSTOS ====================
function calcularJurosCompostos(valorInicial, taxaMensal, meses) {
    const montanteFinal = valorInicial * Math.pow(1 + taxaMensal, meses);
    const jurosTotal = montanteFinal - valorInicial;
    const taxaEfetiva = ((montanteFinal / valorInicial - 1) * 100);

    return {
        valorInicial,
        taxaMensal: taxaMensal * 100,
        meses,
        montanteFinal,
        jurosTotal,
        taxaEfetiva,
        parcelas: gerarParcelas(valorInicial, taxaMensal, meses)
    };
}

// ==================== GERAR PARCELAS ====================
function gerarParcelas(valorInicial, taxaMensal, meses) {
    const parcelas = [];
    let saldoDevedor = valorInicial;

    for (let i = 1; i <= meses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const saldoAnterior = saldoDevedor;
        saldoDevedor = saldoDevedor + juros;

        parcelas.push({
            mes: i,
            saldoAnterior,
            juros,
            saldoAtual: saldoDevedor
        });
    }

    return parcelas;
}

// ==================== EXIBIR RESULTADO ====================
function exibirResultado(resultado, debtType) {
    // Log para debug
    console.log('=== SIMULAÇÃO DE DÍVIDA ===');
    console.log(resultado);
    console.table(resultado.parcelas);

    // Mostrar seção de resultados
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Atualizar valores dos cards
    document.getElementById('valorOriginal').textContent = formatarMoeda(resultado.valorInicial);
    document.getElementById('montanteTotal').textContent = formatarMoeda(resultado.montanteFinal);
    document.getElementById('totalJuros').textContent = formatarMoeda(resultado.jurosTotal);
    document.getElementById('percentualJuros').textContent = `${resultado.taxaEfetiva.toFixed(2)}%`;

    // Atualizar severidade do alerta baseado na taxa efetiva
    const alertCritical = document.getElementById('alertCritical');
    const alertMessage = alertCritical.querySelector('.alert-message');

    if (resultado.taxaEfetiva > 300) {
        alertCritical.dataset.severity = 'critical';
        alertMessage.innerHTML = `
            <strong>ALERTA CRÍTICO!</strong> Os juros estão consumindo seu dinheiro rapidamente.
            Busque ajuda financeira urgente e renegocie sua dívida!
        `;
    } else if (resultado.taxaEfetiva > 150) {
        alertCritical.dataset.severity = 'high';
        alertMessage.innerHTML = `
            <strong>ATENÇÃO!</strong> A taxa de juros está muito alta.
            Considere renegociar sua dívida ou buscar alternativas com taxas menores.
        `;
    } else if (resultado.taxaEfetiva > 50) {
        alertCritical.dataset.severity = 'medium';
        alertCritical.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        alertCritical.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        alertMessage.style.color = '#d97706';
        alertMessage.innerHTML = `
            <strong>CUIDADO!</strong> Os juros vão aumentar consideravelmente sua dívida.
            Tente pagar o quanto antes para evitar juros ainda maiores.
        `;
    } else {
        alertCritical.dataset.severity = 'low';
        alertCritical.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        alertCritical.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        alertMessage.style.color = '#16a34a';
        alertMessage.innerHTML = `
            <strong>Taxa Moderada</strong> Os juros estão em um patamar controlável.
            Mantenha os pagamentos em dia para evitar o crescimento da dívida.
        `;
    }

    // Atualizar conteúdo educativo baseado no tipo de dívida
    updateEducationContent(debtType);

    // Gerar gráfico (placeholder - será implementado com Chart.js ou similar)
    generateChart(resultado.parcelas);

    // Salvar no localStorage para uso futuro
    localStorage.setItem('ultimaSimulacao', JSON.stringify({
        ...resultado,
        debtType,
        timestamp: new Date().toISOString()
    }));
}

// ==================== FORMATAÇÃO ====================
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// ==================== EXPORTAR FUNÇÕES (para uso futuro) ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calcularJurosCompostos,
        gerarParcelas,
        formatarMoeda
    };
}

// ==================== ATUALIZAR CONTEÚDO EDUCATIVO ====================
function updateEducationContent(debtType) {
    const educationTitle = document.getElementById('educationTitle');
    const educationDescription = document.getElementById('educationDescription');
    const educationTip = document.getElementById('educationTip');
    const educationCard = document.querySelector('.education-card');

    educationCard.dataset.debtType = debtType;

    const content = {
        cartao: {
            title: 'Cartão de Crédito — Juros Rotativos',
            description: 'O rotativo do cartão de crédito é a modalidade mais cara do mercado. Quando você paga apenas o mínimo da fatura, o restante entra no crédito rotativo, com taxas que podem ultrapassar 400% ao ano. Os juros são compostos, ou seja, você paga juros sobre juros, fazendo a dívida crescer exponencialmente.',
            tip: '⚠️ O cartão de crédito tem os maiores juros do mercado! Sempre que possível, pague a fatura integralmente. Se não conseguir, busque um empréstimo pessoal para quitar o rotativo — a taxa será muito menor.'
        },
        emprestimo: {
            title: 'Empréstimo Pessoal — Juros Menores',
            description: 'O empréstimo pessoal geralmente possui taxas menores que o cartão de crédito, mas ainda assim pode ser caro dependendo da instituição. É importante comparar as taxas entre diferentes bancos e financeiras antes de contratar. Lembre-se que quanto maior o prazo, mais juros você pagará no total.',
            tip: '💡 Compare as taxas! Bancos digitais costumam oferecer taxas mais competitivas. Considere pagar parcelas maiores quando possível para reduzir o montante total de juros.'
        },
        cheque: {
            title: 'Cheque Especial — Emergencial Apenas',
            description: 'O cheque especial deve ser usado apenas em emergências. As taxas são extremamente altas e os juros são cobrados diariamente sobre o valor utilizado. É uma das formas mais caras de crédito, perdendo apenas para o rotativo do cartão. Evite ao máximo usar esse recurso.',
            tip: '🚨 Use apenas em emergências! Se já está usando, procure regularizar o quanto antes. Considere migrar a dívida para um empréstimo pessoal com taxa menor ou negociar diretamente com o banco.'
        }
    };

    const selected = content[debtType] || content.cartao;
    educationTitle.textContent = selected.title;
    educationDescription.textContent = selected.description;
    educationTip.textContent = selected.tip;
}

// ==================== GERAR GRÁFICO ====================
function generateChart(parcelas) {
    const chartContainer = document.getElementById('chartContainer');
    const canvas = document.getElementById('debtChart');
    const placeholder = chartContainer.querySelector('.chart-placeholder');

    if (!canvas || !chartContainer) {
        return;
    }

    lastChartData = parcelas;

    if (placeholder) {
        placeholder.style.display = 'none';
    }

    canvas.style.display = 'block';

    const draw = () => {
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(320, chartContainer.clientWidth - 8);
        const height = Math.max(220, chartContainer.clientHeight - 8);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        if (!parcelas.length) {
            return;
        }

        const padding = { top: 20, right: 20, bottom: 40, left: 65 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const values = parcelas.map((p) => p.saldoAtual);
        const maxValue = Math.max(...values) * 1.1;
        const minValue = 0;

        const x = (idx) => {
            if (parcelas.length === 1) {
                return padding.left + chartW / 2;
            }
            return padding.left + (idx / (parcelas.length - 1)) * chartW;
        };

        const y = (value) => {
            const normalized = (value - minValue) / (maxValue - minValue || 1);
            return padding.top + chartH - normalized * chartH;
        };

        // Grid horizontal + labels do eixo Y
        const yTicks = 5;
        ctx.strokeStyle = '#e5e7eb';
        ctx.fillStyle = '#676f7e';
        ctx.font = '12px Inter, sans-serif';

        for (let i = 0; i <= yTicks; i += 1) {
            const ratio = i / yTicks;
            const yPos = padding.top + chartH - ratio * chartH;
            const val = minValue + ratio * (maxValue - minValue);

            ctx.beginPath();
            ctx.moveTo(padding.left, yPos);
            ctx.lineTo(width - padding.right, yPos);
            ctx.stroke();

            ctx.fillText(formatCompactCurrency(val), 8, yPos + 4);
        }

        // Eixo X
        ctx.strokeStyle = '#9ca3af';
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartH);
        ctx.lineTo(width - padding.right, padding.top + chartH);
        ctx.stroke();

        // Labels do eixo X (meses)
        const step = Math.ceil(parcelas.length / 6);
        ctx.fillStyle = '#676f7e';
        for (let i = 0; i < parcelas.length; i += step) {
            const xPos = x(i);
            ctx.fillText(`${parcelas[i].mes}`, xPos - 6, height - 14);
        }
        if ((parcelas.length - 1) % step !== 0) {
            const lastIdx = parcelas.length - 1;
            ctx.fillText(`${parcelas[lastIdx].mes}`, x(lastIdx) - 6, height - 14);
        }

        // Área sob a curva
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        gradient.addColorStop(0, 'rgba(232, 85, 48, 0.30)');
        gradient.addColorStop(1, 'rgba(232, 85, 48, 0.03)');

        ctx.beginPath();
        ctx.moveTo(x(0), y(values[0]));
        for (let i = 1; i < values.length; i += 1) {
            ctx.lineTo(x(i), y(values[i]));
        }
        ctx.lineTo(x(values.length - 1), padding.top + chartH);
        ctx.lineTo(x(0), padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Linha principal
        ctx.beginPath();
        ctx.moveTo(x(0), y(values[0]));
        for (let i = 1; i < values.length; i += 1) {
            ctx.lineTo(x(i), y(values[i]));
        }
        ctx.strokeStyle = '#e85530';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Pontos de destaque
        const markStep = Math.max(1, Math.floor(values.length / 8));
        for (let i = 0; i < values.length; i += markStep) {
            ctx.beginPath();
            ctx.arc(x(i), y(values[i]), 3.5, 0, 2 * Math.PI);
            ctx.fillStyle = '#e85530';
            ctx.fill();
        }

        // Destacar último ponto
        const lastIndex = values.length - 1;
        ctx.beginPath();
        ctx.arc(x(lastIndex), y(values[lastIndex]), 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#177f72';
        ctx.fill();

        // Títulos dos eixos
        ctx.fillStyle = '#676f7e';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText('Meses', width / 2 - 20, height - 2);

        ctx.save();
        ctx.translate(14, height / 2 + 15);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Saldo devedor', 0, 0);
        ctx.restore();
    };

    draw();

    if (!chartResizeBound) {
        window.addEventListener('resize', () => {
            if (lastChartData) {
                generateChart(lastChartData);
            }
        });
        chartResizeBound = true;
    }

    return;
}

function formatCompactCurrency(value) {
    const v = Number(value) || 0;

    if (v >= 1000000) {
        return `R$ ${(v / 1000000).toFixed(1)}M`;
    }

    if (v >= 1000) {
        return `R$ ${(v / 1000).toFixed(0)}k`;
    }

    return `R$ ${v.toFixed(0)}`;
}
