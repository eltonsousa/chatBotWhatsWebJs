### ChatBot Da Hora Games

Chatbot inteligente para WhatsApp, com integração de IA para classificação de mensagens, fluxo de atendimento automatizado e armazenamento de pedidos no Supabase.

- 🚀 Funcionalidades
- 🤖 IA Gemini: Classifica mensagens automaticamente e direciona o atendimento.
- 📱 WhatsApp Web.js: Comunicação 100% via WhatsApp, com QR Code para autenticação rápida.
- 📋 Pedidos e IDs únicos: Cada interação ou pedido é salvo com ID único no Supabase.
- 🎮 Gestão de jogos: Lista de jogos dinâmica, validada e configurável.
- ⚡ Logs detalhados: Informação completa de chatId, usuário e estágios do atendimento.
- 🐞 Correção de bugs: Melhorias no fluxo, mensagens de saudação e FAQ antes do fluxo principal.

---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/chatbot-whatsapp.git
cd chatbot-whatsapp
```

Instale dependências:

```bash
npm install
```

Inicie o bot:

```bash
node index.js
```

Acesse o QR Code:

http://localhost:3000/qr

---

## 🗂 Estrutura do Projeto

```bash
├─ index.js # Arquivo principal
├─ config.js # Configurações do bot e jogos
├─ flowHandlers.js # Fluxo de atendimento
├─ intentAI.js # Classificação de mensagens pela IA
├─ utils.js # Funções auxiliares e logs
├─ content.js # Conteúdos fixos do bot
└─ package.json # Dependências e scripts
```

---

## 🏷 Versionamento

Usamos tags Git para controlar releases:

- v1.0.1-beta7-dev – Versão beta com IA Gemini e integração completa.

---

## 🛠 Próximos Passos:

- Integração com mais fluxos de atendimento
- Melhorias na resposta automática de FAQ
- Monitoramento em tempo real de pedidos e usuários

---
