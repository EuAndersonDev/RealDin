const COMANDOS_VOZ = [{
    frases: ['ir para o início', 'página inicial', 'inicio', 'home'],
    acao: () => window.location.href = '/index.html'
  },
  {
    frases: ['entrar', 'fazer login', 'ir para login'],
    acao: () => window.location.href = '/pages/login.html'
  },
  {
    frases: ['cadastrar', 'registrar', 'criar conta'],
    acao: () => window.location.href = '/pages/register.html'
  },
  {
    frases: ['sobre nós', 'quem somos'],
    acao: () => window.location.href = '/pages/sobrenos.html'
  },
  {
    frases: ['resultados', 'resultado'],
    acao: () => window.location.href = '/pages/resultado.html'
  },
  {
    frases: ['quiz', 'iniciar quiz'],
    acao: () => window.location.href = '/pages/quiz.html'
  },
  {
    frases: ['indicações', 'indicação'],
    acao: () => window.location.href = '/pages/indicacoes.html'
  },
  {
    frases: ['conscientização'],
    acao: () => window.location.href = '/pages/conscientizacao.html'
  },
  {
    frases: ['simulador'],
    acao: () => window.location.href = '/pages/simulador.html'
  },

  {
    frases: ['subir', 'sobe', 'topo', 'cima', 'para cima', 'início da página'],
    acao: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },
  {
    frases: ['descer', 'desce', 'baixo', 'para baixo', 'rolar', 'próximo', 'continuar', 'mais', 'avançar', 'vai', 'ver mais'],
    acao: () => window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  },

  {
    frases: ['recomendações', 'ver recomendações'],
    acao: () => document.querySelector('.btn-recomenda-perfil')?.click()
  },
  {
    frases: ['começar', 'começar agora'],
    acao: () => document.querySelector('.btn-cta-verde, .btn-fazer-teste')?.click()
  },
  {
    frases: ['cursos', 'ver cursos'],
    acao: () => document.querySelector('.cursos-container')?.scrollIntoView({
      behavior: 'smooth'
    })
  },
  {
    frases: ['perfil', 'meu perfil'],
    acao: () => document.querySelector('.perfil-secao')?.scrollIntoView({
      behavior: 'smooth'
    })
  },
  {
    frases: ['livros', 'recomendados'],
    acao: () => document.querySelector('.recomendados')?.scrollIntoView({
      behavior: 'smooth'
    })
  },
  {
    frases: ['ajuda', 'comandos', 'o que posso falar'],
    acao: () => mostrarAjuda()
  },
];


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.warn('Speech Recognition não suportado.');
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;

  //  Botão mic 
  const mic = document.createElement('button');
  mic.id = 'btn-mic';
  mic.title = 'Navegação por voz';
  mic.style.cssText = `
    position:fixed; bottom:28px; right:28px;
    width:60px; height:60px; border-radius:50%;
    border:none; background:#59bda3; cursor:pointer;
    box-shadow:0 4px 20px rgba(89,189,163,0.5);
    z-index:9999; transition:background 0.25s, box-shadow 0.25s;
    display:flex; align-items:center; justify-content:center;
  `;
  mic.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
  document.body.appendChild(mic);

  // Anel de pulso 
  const pulso = document.createElement('div');
  pulso.style.cssText = `
    position:fixed; bottom:28px; right:28px;
    width:60px; height:60px; border-radius:50%;
    border:3px solid #59bda3; z-index:9998;
    pointer-events:none; opacity:0; transform:scale(1);
    transition:opacity 0.3s, transform 0.8s;
  `;
  document.body.appendChild(pulso);

  // Toast 
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:100px; right:28px;
    background:rgba(15,15,15,0.85); color:#fff;
    padding:12px 20px; border-radius:14px;
    font-size:14px; font-family:Inter,sans-serif;
    z-index:9999; opacity:0; transform:translateY(6px);
    transition:opacity 0.25s, transform 0.25s;
    pointer-events:none; max-width:260px; line-height:1.5;
  `;
  document.body.appendChild(toast);

  // Transcrição 
  const transcricao = document.createElement('div');
  transcricao.style.cssText = `
    position:fixed; bottom:100px; left:50%;
    transform:translateX(-50%) translateY(8px);
    background:rgba(26,167,213,0.92); color:white;
    padding:10px 22px; border-radius:30px;
    font-size:15px; font-family:Inter,sans-serif;
    z-index:9999; opacity:0;
    transition:opacity 0.2s, transform 0.2s;
    pointer-events:none; white-space:nowrap;
    max-width:80vw; overflow:hidden; text-overflow:ellipsis;
  `;
  document.body.appendChild(transcricao);

  // Utilitários 
  function mostrarTranscricao(texto) {
    transcricao.textContent = `"${texto}"`;
    transcricao.style.opacity = '1';
    transcricao.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(transcricao._t);
    transcricao._t = setTimeout(() => {
      transcricao.style.opacity = '0';
      transcricao.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2000);
  }

  function falarFeedback(texto, tipo = 'info') {
    const cores = {
      info: 'rgba(15,15,15,0.85)',
      ok: 'rgba(15,110,86,0.9)',
      erro: 'rgba(160,45,45,0.9)'
    };
    toast.style.background = cores[tipo] || cores.info;
    toast.textContent = texto;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
    }, 3000);
  }

  function bater(frases, dito) {
    const palavras = dito.split(/\s+/);
    return frases.some(f => dito.includes(f) || palavras.includes(f));
  }

  let pulsoInterval;

  function iniciarPulso() {
    pulso.style.opacity = '0.6';
    let s = 1;
    pulsoInterval = setInterval(() => {
      s = s === 1 ? 1.5 : 1;
      pulso.style.transform = `scale(${s})`;
      pulso.style.opacity = s === 1 ? '0.6' : '0';
    }, 800);
  }

  function pararPulso() {
    clearInterval(pulsoInterval);
    pulso.style.opacity = '0';
    pulso.style.transform = 'scale(1)';
  }

  // ── Modal 
  function fecharModal() {
    document.getElementById('ajuda-overlay')?.remove();
  }

  function mostrarAjuda() {
    if (document.getElementById('ajuda-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ajuda-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0;
      background:rgba(0,0,0,0.6); z-index:10000;
      display:flex; align-items:center; justify-content:center;
      backdrop-filter:blur(4px); padding:20px;
    `;
    overlay.innerHTML = `
      <div id="ajuda-card" style="background:white; border-radius:20px; padding:32px; max-width:420px; width:100%; font-family:Inter,sans-serif; max-height:80vh; overflow-y:auto;">
        <h3 style="margin:0 0 8px; font-size:18px; color:#1a1a2e;">Comandos de voz disponíveis</h3>
        <p style="font-size:13px; color:#888; margin-bottom:4px;">
          Diga <strong style="color:#59bda3">"descer"</strong> ou <strong style="color:#59bda3">"subir"</strong> para navegar aqui dentro.
        </p>
        <p style="font-size:13px; color:#888; margin-bottom:20px;">
          Diga <strong style="color:#e05555">"fechar"</strong> para fechar.
        </p>
        <div style="display:grid; gap:10px; font-size:14px; color:#444;">
          ${COMANDOS_VOZ.map(c => `
            <div style="background:#f5f9f8; border-radius:10px; padding:10px 14px;">
              ${c.frases.map(f => `
                <span style="background:#e1f5ee; color:#0f6e56; border-radius:6px; padding:2px 8px; margin:2px; display:inline-block; font-weight:600;">"${f}"</span>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <button id="btn-fechar-ajuda" style="margin-top:24px; width:100%; padding:14px; background:#59bda3; color:white; border:none; border-radius:10px; font-weight:700; cursor:pointer; font-size:15px;">
          Fechar
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('btn-fechar-ajuda').addEventListener('click', fecharModal);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) fecharModal();
    });
  }

  // Estado 
  let ativo = sessionStorage.getItem('voz-ativa') === 'true';

  function ativarVoz() {
    try {
      recognition.start();
    } catch (e) {}
    ativo = true;
    sessionStorage.setItem('voz-ativa', 'true');
    mic.style.background = '#e05555';
    mic.style.boxShadow = '0 4px 20px rgba(224,85,85,0.5)';
    iniciarPulso();
    falarFeedback('Ouvindo... diga um comando');
  }

  function desativarVoz() {
    recognition.stop();
    ativo = false;
    sessionStorage.setItem('voz-ativa', 'false');
    mic.style.background = '#59bda3';
    mic.style.boxShadow = '0 4px 20px rgba(89,189,163,0.5)';
    pararPulso();
    falarFeedback('Voz desativada');
  }

  if (ativo) setTimeout(ativarVoz, 500);
  mic.addEventListener('click', () => ativo ? desativarVoz() : ativarVoz());

  //  LISTENER ÚNICO 
  recognition.addEventListener('result', (e) => {
    const resultado = e.results[e.results.length - 1];
    const dito = resultado[0].transcript.toLowerCase().trim();

    mostrarTranscricao(dito);
    if (!resultado.isFinal) return;

    const card = document.getElementById('ajuda-card');

    // Modal aberto 
    if (card) {
      if (bater(['descer', 'desce', 'baixo', 'mais', 'próximo', 'continuar', 'avançar', 'vai'], dito)) {
        falarFeedback('✓ descendo', 'ok');
        card.scrollBy({
          top: 200,
          behavior: 'smooth'
        });

      } else if (bater(['subir', 'sobe', 'cima', 'volta', 'voltar'], dito)) {
        falarFeedback('✓ subindo', 'ok');
        card.scrollBy({
          top: -200,
          behavior: 'smooth'
        });

      } else if (bater(['fechar', 'fecha', 'sair'], dito)) {
        falarFeedback('✓ fechando', 'ok');
        fecharModal();
      }
      return;
    }

    //  Página normal 
    const match = COMANDOS_VOZ.find(cmd => bater(cmd.frases, dito));
    if (!match) return;

    falarFeedback(`✓ "${dito}"`, 'ok');

    const ehNavegacao = COMANDOS_VOZ.slice(0, 9).find(cmd => bater(cmd.frases, dito));
    if (ehNavegacao) recognition.stop();

    setTimeout(() => match.acao(), 300);
  });

  recognition.addEventListener('error', (e) => {
    if (e.error === 'not-allowed') {
      falarFeedback('Permissão de microfone negada', 'erro');
      desativarVoz();
    }
  });

  recognition.addEventListener('end', () => {
    if (ativo) setTimeout(() => {
      try {
        recognition.start();
      } catch (e) {}
    }, 300);
  });

}