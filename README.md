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
├── 📁 assets/ # Ícones, ilustrações e logos (SVG/PNG)
│    └── 📁 imgs/               # Imagens do projeto em PNG
│    └── 📁 icons/              # Icones em SvG
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
└── 📄 index.html               # Home Page (Entry Point)

```

---

## 🔗 Links Úteis

* **Protótipo Figma:** [Acesse o Design](https://www.figma.com/design/uSDxm2OT0j91rQcwE2fcdX/GRUPO-UC1?node-id=567-7&t=GayhJ1auLnmrxosq-1)
* **Apresentação do Pitch:** [Canva Link]([https://www.google.com/search?q=https://canva.com.br](https://www.figma.com/make/S3AmiQrysGlwvv0dqDSErQ/Apresenta%C3%A7%C3%A3o-Visual-RealDin?t=9a72dqcnvIWNbNVA-1))
* **Deploy em Produção:** [RealDin.vercel.app](https://www.google.com/search?q=https://RealDin.vercel.app)

---

## 👥 Squad de Desenvolvimento (Colaboradores)

Nosso time é composto por 6 desenvolvedores focados em transformar a realidade financeira do jovem brasileiro:

| Nome | Função | LinkedIn |
| --- | --- | --- |
| **Dev 01** | [linkedin.com/in/dev1]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/euandersonreis/)) |
| **Dev 02** | [linkedin.com/in/dev2]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/jaiane-d-5897802b5/)) |
| **Dev 03** | [linkedin.com/in/dev3]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/jo%C3%A3o-pedro-pereira-ramos-9089973a3/)) |
| **Dev 04** | [linkedin.com/in/dev4]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/joão-victor-santos-de-medeiros-936b9536b?utm_source=share_via&utm_content=profile&utm_medium=member_android)) |
| **Dev 05** | [linkedin.com/in/dev5]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/kauê-rodrigues-de-sousa-ba62b33b6/)) |
| **Dev 06** | [linkedin.com/in/dev6]([https://www.google.com/search?q=%23](https://www.linkedin.com/in/ugussousa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)) |

---

## 📝 Como contribuir

1. Clone o repositório: `git clone https://github.com/seu-usuario/realdin.git`
2. Abra o `index.html` no seu navegador (recomendado usar a extensão **Live Server**).
3. Todo commit na branch `main` gera um deploy automático na Vercel.

---

*Este projeto é parte de uma iniciativa educacional para o grupo-5 de UC-1, turma 1 JAVA, PROA primeiro semestre 2026.*
