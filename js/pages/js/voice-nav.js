const COMANDOS_VOZ = [
    // --- COMANDOS DE NAVEGAÇÃO GLOBAL ---
    {
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
        frases: ['quiz'],
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

    // --- COMANDOS DE ROLAGEM  ---
    {
        frases: ['subir', 'topo', 'início da página'],
        acao: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
        frases: ['descer', 'rolar para baixo', 'próximo'],
        acao: () => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
    },

    // --- COMANDOS CONTEXTUAIS  ---
    {
        frases: ['recomendações', 'ver recomendações', 'meu perfil'],
        acao: () => document.querySelector('.btn-recomenda-perfil')?.click()
    },
    {
        frases: ['começar', 'começar agora', 'quero começar'],
        acao: () => document.querySelector('.btn-cta-verde, .btn-fazer-teste')?.click()
    },
    {
        frases: ['cursos', 'ver cursos'],
        acao: () => document.querySelector('.cursos-container')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
        frases: ['quiz', 'iniciar quiz'],
        acao: () => document.querySelector('.btn-iniciar-quiz')?.click()
    }
];

  
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Speech Recognition não suportado neste navegador.');
  } else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;     
    recognition.interimResults = false; 

    
    const mic = document.createElement('button');
    mic.id = 'btn-mic';
    mic.innerHTML = '🎙️';
    mic.title = 'Ativar navegação por voz';
    mic.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #59bda3;
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 9999;
      transition: background 0.2s, transform 0.2s;
    `;
    document.body.appendChild(mic);

    
    function falarFeedback(texto) {
      let toast = document.getElementById('voice-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'voice-toast';
        toast.style.cssText = `
          position: fixed;
          bottom: 96px;
          right: 28px;
          background: rgba(0,0,0,0.75);
          color: #fff;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-family: Inter, sans-serif;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        `;
        document.body.appendChild(toast);
      }
      toast.textContent = texto;
      toast.style.opacity = '1';
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.style.opacity = '0', 2500);
    }

    let ativo = false;

    mic.addEventListener('click', () => {
      if (!ativo) {
        recognition.start();
        ativo = true;
        mic.style.background = '#e05555';
        mic.innerHTML = '🔴';
        falarFeedback('🎙️ Ouvindo... diga um comando');
      } else {
        recognition.stop();
        ativo = false;
        mic.style.background = '#59bda3';
        mic.innerHTML = '🎙️';
        falarFeedback('Voz desativada');
      }
    });

    
    recognition.addEventListener('result', (e) => {
      const dito = e.results[e.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      falarFeedback(`"${dito}"`);

      const match = COMANDOS_VOZ.find(cmd =>
        cmd.frases.some(f => dito.includes(f))
      );

      if (match) {
        match.acao();
      } else {
        falarFeedback(`❓ Comando não reconhecido: "${dito}"`);
      }
    });

    recognition.addEventListener('error', (e) => {
      falarFeedback('Erro no microfone: ' + e.error);
      ativo = false;
      mic.style.background = '#59bda3';
      mic.innerHTML = '🎙️';
    });

    
    recognition.addEventListener('end', () => {
      if (ativo) recognition.start();
    });
  }