
```
# 💰 RealDin: Educação Financeira para a Realidade Brasileira

> **"Acordando jovens adultos para a liberdade financeira através da consciência e tecnologia."**

O **RealDin** é uma plataforma interativa desenvolvida para combater a falta de educação financeira entre jovens de baixa renda no Brasil. Através de uma jornada de usuário guiada, transformamos dados complexos em diagnósticos claros e ferramentas práticas para o dia a dia.

---

## 🎯 O Projeto

A aplicação utiliza uma abordagem de **Alto Impacto Visual (Home Page)** com um fluxo de conversão focado em um **Quiz de Perfil Financeiro**.

### 🚀 Funcionalidades Principais

* **Diagnóstico de Perfil:** Quiz inteligente que classifica o comportamento financeiro do usuário.
* **Trilha de Conscientização:** Conteúdo personalizado sobre os riscos do mercado financeiro brasileiro.
* **Simulador de Juros:** Ferramenta prática para entender o impacto de dívidas e investimentos no longo prazo.
* **Curadoria Educativa:** Indicações selecionadas de livros e cursos gratuitos.
* **Mobile-First:** Experiência otimizada para smartphones, garantindo acessibilidade para todos os públicos.

---

## 🛠️ Stack Técnica

Para garantir performance e SEO de alto nível, optamos por uma arquitetura **Vanilla Web** (sem dependências externas pesadas):

* **Linguagens:** HTML5, CSS3 (Moderno/Grid/Flexbox) e JavaScript (ES6+).
* **Persistência de Dados:** `localStorage` / `sessionStorage` para experiência offline e rápida.
* **Hospedagem & CI/CD:** Vercel com Deploy Contínuo.
* **Design:** Prototipagem fiel de alta fidelidade via Figma.

---

## 📂 Arquitetura do Projeto

Mantemos uma estrutura organizada para facilitar a escalabilidade e manutenção:

```text
📁 RealDin/
│
├── 📁 assets/                  # Ícones, ilustrações e logos (SVG/PNG)
│   └── 📁 imgs/                # Imagens do projeto em PNG
│   └── 📁 icons/               # Icones em SVG
├── 📁 css/                     # Estilização Modular
│   ├── 📄 global.css           # Reset, Variáveis e Tipografia
│   ├── 📁 components/          # Header, Footer e UI Patterns
│   └── 📁 pages/               # Estilos específicos por módulo
│
├── 📁 js/                      # Lógica da Aplicação (Sprint 2)
│   ├── 📄 main.js              # Lógica global
│   └── 📁 services/            # Manipulação de dados e simuladores
│   └── 📁 pages/               # Scripts específicos por tela
│   └── 📁 components/          # Componentes
│
├── 📁 pages/                   # Telas da Aplicação
│   ├── 📄 login.html
│   ├── 📄 quiz.html
│   ├── 📄 resultado.html
│   ├── 📄 simulador-juros.html
│   └── (outras telas...)
│
└── 📄 index.html                # Home Page (Entry Point)

```

---

## 🔗 Links Úteis

* **Protótipo Figma:** [Acesse o Design](https://www.google.com/search?q=https://www.figma.com/design/uSDxm2OT0j91rQcwE2fcdX/GRUPO-UC1%3Fnode-id%3D567-7)
* **Apresentação do Pitch:** [Apresentação Visual](https://www.google.com/search?q=https://www.figma.com/make/S3AmiQrysGlwvv0dqDSErQ/Apresenta%25C3%25A7%25C3%25A3o-Visual-RealDin)
* **Deploy em Produção:** [realdin.vercel.app](https://www.google.com/search?q=https://RealDin.vercel.app)

---

## 👥 Squad de Desenvolvimento (Colaboradores)

Nosso time é composto por 6 desenvolvedores focados em transformar a realidade financeira do jovem brasileiro:

| Nome | Função | LinkedIn |
| --- | --- | --- |
| **Anderson Reis** | Fullstack Developer | [linkedin.com/in/euandersonreis](https://www.linkedin.com/in/euandersonreis/) |
| **Jaiane D.** | Frontend Developer | [linkedin.com/in/jaiane-d](https://www.linkedin.com/in/jaiane-d-5897802b5/) |
| **João Pedro Pereira** | Frontend Developer | [linkedin.com/in/joao-pedro](https://www.linkedin.com/in/jo%C3%A3o-pedro-pereira-ramos-9089973a3/) |
| **João Victor Santos** | Backend Developer | [linkedin.com/in/joao-victor](https://www.google.com/search?q=https://www.linkedin.com/in/jo%C3%A3o-victor-santos-de-medeiros-936b9536b/) |
| **Kauê Rodrigues** | Frontend Developer | [linkedin.com/in/kaue-rodrigues](https://www.linkedin.com/in/kauê-rodrigues-de-sousa-ba62b33b6/) |
| **Ugus Sousa** | Backend Developer | [linkedin.com/in/ugussousa](https://www.google.com/search?q=https://www.linkedin.com/in/ugussousa/) |

---

## 📝 Como contribuir

1. Clone o repositório: `git clone https://github.com/seu-usuario/realdin.git`
2. Abra o `index.html` no seu navegador (recomendado usar a extensão **Live Server**).
3. Todo commit na branch `main` gera um deploy automático na Vercel.

---

*Este projeto é parte de uma iniciativa educacional para o grupo-5 de UC-1, turma 1 JAVA, PROA primeiro semestre 2026.*
```
