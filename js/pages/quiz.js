document.addEventListener('DOMContentLoaded', () => {
  console.log('[Quiz] Página carregada, iniciando configuração.');
  const session = window.SessionService;
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

  const estiloOpcao = {
    bordaPadrao: '2px solid transparent',
    fundoHover: '#f3f7ff',
    bordaHover: '2px solid #9db7ff',
    fundoSelecionado: '#dfe9ff',
    bordaSelecionado: '2px solid #4f7cff'
  };

  const pontuacaoInicial = session?.QUIZ_DEFAULT_SCORES || {
    Poupador: 0,
    Gastador: 0,
    Descontrolado: 0,
    Desligado: 0,
    Financista: 0
  };

  function resetPontuacao() {
    if (session?.resetQuizState) {
      session.resetQuizState();
    } else {
      sessionStorage.setItem('pontuacao', JSON.stringify(pontuacaoInicial));
      sessionStorage.removeItem('quizFinalizado');
    }

    console.log('[Quiz] Pontuação resetada na sessão.', pontuacaoInicial);
  }

  function obterPontuacaoAtual() {
    if (session?.getQuizState) {
      return {
        ...pontuacaoInicial,
        ...(session.getQuizState().scores || {})
      };
    }

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

    if (session?.setQuizState) {
      session.setQuizState({
        currentQuestionIndex: estado.indiceAtual,
        totalQuestions: total
      });
    }

    console.log(`[Quiz] Progresso atualizado: ${atual}/${total} (${percentual.toFixed(2)}%).`);
  }

  function limparSelecao() {
    Object.values(opcoesMap).forEach(({ container }) => {
      if (container) {
        container.classList.remove('selecionada');
        aplicarEstiloPadrao(container);
      }
    });

    estado.opcaoSelecionada = null;
    btnProximo.disabled = true;
  }

  function atualizarTextoBotao() {
    const ultima = estado.indiceAtual === estado.perguntas.length - 1;
    textoBotao.textContent = ultima ? 'Ver Resultado' : 'Próxima Pergunta';
    console.log(`[Quiz] Texto do botão: ${textoBotao.textContent}.`);
  }

  function renderPergunta() {
    const perguntaAtual = estado.perguntas[estado.indiceAtual];
    if (!perguntaAtual) {
      return;
    }

    console.log('[Quiz] Renderizando pergunta:', {
      indice: estado.indiceAtual,
      id: perguntaAtual.id,
      pergunta: perguntaAtual.pergunta,
      totalOpcoes: perguntaAtual.opcoes.length
    });

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
      console.log('[Quiz] Pergunta com menos de 5 opções: ocultando D e E.');
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
        aplicarEstiloPadrao(opcaoContainer);
      }
    });

    container.classList.add('selecionada');
    aplicarEstiloSelecionado(container);
    estado.opcaoSelecionada = container;
    btnProximo.disabled = false;
    console.log('[Quiz] Opção selecionada:', {
      opcao: container.id,
      perfil: container.dataset.perfil
    });
  }

  function aplicarEstiloPadrao(container) {
    const fundoInterno = container.querySelector('.background');
    container.style.backgroundColor = '';
    container.style.border = estiloOpcao.bordaPadrao;
    container.style.borderRadius = '12px';

    if (fundoInterno) {
      fundoInterno.style.backgroundColor = '';
      fundoInterno.style.border = estiloOpcao.bordaPadrao;
      fundoInterno.style.borderRadius = '12px';
      fundoInterno.style.transition = 'background-color 0.18s ease, border-color 0.18s ease';
    }
  }

  function aplicarEstiloSelecionado(container) {
    const fundoInterno = container.querySelector('.background');
    container.style.backgroundColor = estiloOpcao.fundoSelecionado;
    container.style.border = estiloOpcao.bordaSelecionado;
    container.style.borderRadius = '12px';

    if (fundoInterno) {
      fundoInterno.style.backgroundColor = estiloOpcao.fundoSelecionado;
      fundoInterno.style.border = estiloOpcao.bordaSelecionado;
      fundoInterno.style.borderRadius = '12px';
    }
  }

  function aplicarHover(container, ativo) {
    if (!container) {
      return;
    }

    const fundoInterno = container.querySelector('.background');
    const estaSelecionada = container.classList.contains('selecionada');

    if (ativo) {
      container.style.transform = 'translateY(-2px)';
      container.style.transition = 'transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease';
      container.style.cursor = 'pointer';
      if (!estaSelecionada) {
        container.style.backgroundColor = estiloOpcao.fundoHover;
        container.style.border = estiloOpcao.bordaHover;
        container.style.borderRadius = '12px';

        if (fundoInterno) {
          fundoInterno.style.backgroundColor = estiloOpcao.fundoHover;
          fundoInterno.style.border = estiloOpcao.bordaHover;
          fundoInterno.style.borderRadius = '12px';
        }
      }
      return;
    }

    container.style.transform = '';
    if (!estaSelecionada) {
      aplicarEstiloPadrao(container);
    }
  }

  function avancar() {
    if (!estado.opcaoSelecionada) {
      console.log('[Quiz] Clique em próximo ignorado: nenhuma opção selecionada.');
      return;
    }

    const perfil = estado.opcaoSelecionada.dataset.perfil;
    const pontuacao = obterPontuacaoAtual();

    if (perfil && Object.prototype.hasOwnProperty.call(pontuacao, perfil)) {
      if (session?.incrementQuizScore) {
        session.incrementQuizScore(perfil);
      } else {
        pontuacao[perfil] += 1;
        sessionStorage.setItem('pontuacao', JSON.stringify(pontuacao));
      }

      console.log('[Quiz] Pontuação atualizada:', pontuacao);
    }

    const ultimaPergunta = estado.indiceAtual === estado.perguntas.length - 1;

    if (ultimaPergunta) {
      if (session?.finalizeQuiz) {
        session.finalizeQuiz();
      } else {
        sessionStorage.setItem('quizFinalizado', 'true');
      }

      console.log('[Quiz] Quiz finalizado. Redirecionando para resultados.');
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
      container.addEventListener('mouseenter', () => aplicarHover(container, true));
      container.addEventListener('mouseleave', () => aplicarHover(container, false));
      container.style.cursor = 'pointer';
      aplicarEstiloPadrao(container);
    });

    btnProximo.addEventListener('click', avancar);

    const botaoSair = document.querySelector('.header .button');
    if (botaoSair) {
      botaoSair.addEventListener('click', () => {
        if (session?.clearUserSession) {
          session.clearUserSession();
        }
        console.log('[Quiz] Sessão de usuário limpa ao clicar em Sair.');
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
      console.log('[Quiz] Buscando perguntas em ../data/perguntas.json');
      const resposta = await fetch('../data/perguntas.json');
      if (!resposta.ok) {
        throw new Error('Falha ao carregar perguntas.');
      }

      const dados = await resposta.json();
      estado.perguntas = Array.isArray(dados.perguntas) ? dados.perguntas : [];
      console.log('[Quiz] Perguntas carregadas com sucesso:', estado.perguntas.length);

      if (!estado.perguntas.length) {
        throw new Error('Nenhuma pergunta encontrada.');
      }

      configurarEventos();
      renderPergunta();
    } catch (error) {
      console.error('[Quiz] Erro ao iniciar quiz:', error);
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
