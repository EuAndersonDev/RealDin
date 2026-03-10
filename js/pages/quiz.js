document.addEventListener('DOMContentLoaded', () => {
  const perguntaTexto = document.getElementById('pergunta-texto');
  const progresso = document.getElementById('progresso');
  const barraProgresso = document.getElementById('barra-progresso');
  const btnProximo = document.getElementById('btn-proximo');
  const textoBotao = btnProximo ? btnProximo.querySelector('.prxima-pergunta') : null;

  const opcoesMap = {
    A: {
      container: document.getElementById('opcao-A'),
      texto: document.getElementById('texto-A')
    },
    B: {
      container: document.getElementById('opcao-B'),
      texto: document.getElementById('texto-B')
    },
    C: {
      container: document.getElementById('opcao-C'),
      texto: document.getElementById('texto-C')
    },
    D: {
      container: document.getElementById('opcao-D'),
      texto: document.getElementById('texto-D')
    },
    E: {
      container: document.getElementById('opcao-E'),
      texto: document.getElementById('texto-E')
    }
  };

  const estado = {
    perguntas: [],
    indiceAtual: 0,
    opcaoSelecionada: null
  };

  const pontuacaoInicial = {
    Poupador: 0,
    Gastador: 0,
    Descontrolado: 0,
    Desligado: 0,
    Financista: 0
  };

  function resetPontuacao() {
    sessionStorage.setItem('pontuacao', JSON.stringify(pontuacaoInicial));
    sessionStorage.removeItem('quizFinalizado');
  }

  function obterPontuacaoAtual() {
    const salvo = sessionStorage.getItem('pontuacao');
    if (!salvo) {
      return { ...pontuacaoInicial };
    }

    try {
      const lido = JSON.parse(salvo);
      return { ...pontuacaoInicial, ...lido };
    } catch (error) {
      return { ...pontuacaoInicial };
    }
  }

  function atualizarProgresso() {
    const total = estado.perguntas.length;
    const atual = estado.indiceAtual + 1;
    progresso.textContent = `${atual}/${total}`;

    const percentual = (atual / total) * 100;
    barraProgresso.style.width = `${percentual}%`;
  }

  function limparSelecao() {
    Object.values(opcoesMap).forEach(({ container }) => {
      if (container) {
        container.classList.remove('selecionada');
      }
    });

    estado.opcaoSelecionada = null;
    btnProximo.disabled = true;
  }

  function atualizarTextoBotao() {
    const ultima = estado.indiceAtual === estado.perguntas.length - 1;
    textoBotao.textContent = ultima ? 'Ver Resultado' : 'Próxima Pergunta';
  }

  function renderPergunta() {
    const perguntaAtual = estado.perguntas[estado.indiceAtual];
    if (!perguntaAtual) {
      return;
    }

    perguntaTexto.textContent = perguntaAtual.pergunta;

    Object.values(opcoesMap).forEach(({ container, texto }) => {
      if (container) {
        container.style.display = 'none';
        container.dataset.perfil = '';
      }
      if (texto) {
        texto.textContent = '';
      }
    });

    perguntaAtual.opcoes.forEach((opcao) => {
      const item = opcoesMap[opcao.letra];
      if (!item || !item.container || !item.texto) {
        return;
      }

      item.container.style.display = '';
      item.container.dataset.perfil = opcao.perfil;
      item.texto.textContent = opcao.texto;
    });

    if (perguntaAtual.opcoes.length < 5) {
      if (opcoesMap.D.container) {
        opcoesMap.D.container.style.display = 'none';
      }
      if (opcoesMap.E.container) {
        opcoesMap.E.container.style.display = 'none';
      }
    }

    limparSelecao();
    atualizarProgresso();
    atualizarTextoBotao();
  }

  function selecionarOpcao(container) {
    if (!container || container.style.display === 'none') {
      return;
    }

    Object.values(opcoesMap).forEach(({ container: opcaoContainer }) => {
      if (opcaoContainer) {
        opcaoContainer.classList.remove('selecionada');
      }
    });

    container.classList.add('selecionada');
    estado.opcaoSelecionada = container;
    btnProximo.disabled = false;
  }

  function avancar() {
    if (!estado.opcaoSelecionada) {
      return;
    }

    const perfil = estado.opcaoSelecionada.dataset.perfil;
    const pontuacao = obterPontuacaoAtual();

    if (perfil && Object.prototype.hasOwnProperty.call(pontuacao, perfil)) {
      pontuacao[perfil] += 1;
      sessionStorage.setItem('pontuacao', JSON.stringify(pontuacao));
    }

    const ultimaPergunta = estado.indiceAtual === estado.perguntas.length - 1;

    if (ultimaPergunta) {
      sessionStorage.setItem('quizFinalizado', 'true');
      window.location.href = '../pages/resultados.html';
      return;
    }

    estado.indiceAtual += 1;
    renderPergunta();
  }

  function configurarEventos() {
    Object.values(opcoesMap).forEach(({ container }) => {
      if (!container) {
        return;
      }

      container.addEventListener('click', () => selecionarOpcao(container));
    });

    btnProximo.addEventListener('click', avancar);

    const botaoSair = document.querySelector('.header .button');
    if (botaoSair) {
      botaoSair.addEventListener('click', () => {
        sessionStorage.clear();
      });
    }
  }

  async function iniciarQuiz() {
    if (!perguntaTexto || !progresso || !barraProgresso || !btnProximo || !textoBotao) {
      return;
    }

    resetPontuacao();
    btnProximo.disabled = true;

    try {
      const resposta = await fetch('../data/perguntas.json');
      if (!resposta.ok) {
        throw new Error('Falha ao carregar perguntas.');
      }

      const dados = await resposta.json();
      estado.perguntas = Array.isArray(dados.perguntas) ? dados.perguntas : [];

      if (!estado.perguntas.length) {
        throw new Error('Nenhuma pergunta encontrada.');
      }

      configurarEventos();
      renderPergunta();
    } catch (error) {
      perguntaTexto.textContent = 'Não foi possível carregar o quiz agora.';
      btnProximo.disabled = true;
      Object.values(opcoesMap).forEach(({ container }) => {
        if (container) {
          container.style.display = 'none';
        }
      });
    }
  }

  iniciarQuiz();
});
