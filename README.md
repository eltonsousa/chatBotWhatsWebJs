# 🤖 Chatbot da Hora Games - versão: 1.0.1 - beta2

Este projeto é um chatbot automatizado para WhatsApp utilizando **[whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)**, integrado com **Supabase** para gerenciamento de sessões e pedidos.

O sistema foi desenvolvido para a loja **Da Hora Games**, permitindo que clientes iniciem atendimentos, solicitem serviços de desbloqueio, instalação de jogos e recebam informações personalizadas.

---

## 🚀 Funcionalidades

- Atendimento automatizado via **WhatsApp**
- Seção FAQ para dúvidas do cliente
- Fluxo interativo com perguntas e respostas
- Geração de **QR Code** para login na pagina Web
- Armazenamento de sessões e pedidos no **Supabase**
- Opção de **reiniciar (0)** ou **encerrar (9)** o atendimento
- Registro de pedidos com ID único de serviço
- Listagem de jogos disponíveis
- Envio de link de localização da loja

---

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Supabase](https://supabase.com/)
- [Docker](https://www.docker.com/) (para deploy no Railway)
- [Railway](https://railway.app/)

---

## ⚙️ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (para rodar em container, opcional)
- Conta no [Railway](https://railway.app/) ou no [Supabase](https://supabase.com/).

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/chatbot-hora-games.git
cd chatbot-hora-games
```

---

## ▶️ Executando localmente

```bash
npm start

```

---

## Acesse:

- http://localhost:3000/ → healthcheck (OK)
- http://localhost:3000/qr → QR Code para login no WhatsApp

---

## 🐳 Rodando com Docker

```bash
docker build -t chatbot-hora-games .
docker run -p 3000:3000 --env-file .env chatbot-hora-games
```

---

## 🚀 Deploy no Railway

O projeto já está preparado com Dockerfile e railway.json. Basta subir para o Railway:

```bash
git init
git add .
git commit -m "Deploy inicial"
railway up
```

---

## 📋 Estrutura do Projeto

```bash
├── index.js # Arquivo principal (chatbot e servidor Express)
├── config.js # Lista de jogos e localização
├── content.js # Mensagens e fluxos do bot
├── Dockerfile # Configuração do container
├── package.json # Dependências e scripts
├── railway.json # Configuração para deploy no Railway
└── README.md # Documentação do projeto
```

---

## 👨‍💻 Autor

- Projeto desenvolvido por Elton Sousa 🚀
  - Referencias:
  - Gemini
  - ChatGPT
- 📧 Email: eltonsousadesigner@gmail.com

- 📍 Localização: Brasil

---
