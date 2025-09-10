# 🤖 Chatbot da Hora Games - versão: 1.0.1 - beta3

Este projeto é um chatbot automatizado para WhatsApp, projetado para a loja Da Hora Games. Ele utiliza o
**[whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)** para interagir com os usuários e o Supabase para gerenciar sessões e registrar pedidos de serviços, como desbloqueio de consoles e instalação de jogos.

O sistema foi desenvolvido para a loja **Da Hora Games**, permitindo que clientes iniciem atendimentos, solicitem serviços de desbloqueio, instalação de jogos e recebam informações personalizadas.

---

## 🚀 Funcionalidades

O chatbot oferece uma variedade de recursos para otimizar o atendimento ao cliente:

- Atendimento Automatizado: Inicia e gerencia conversas com os clientes via WhatsApp.
- FAQ Interativo: Permite que os usuários tirem dúvidas sobre o serviço de desbloqueio RGH 3.0 para Xbox 360, incluindo requisitos, valor e prazo.
- Fluxo de Pedidos: Guia o cliente através de um processo passo a passo para coletar informações como nome, e-mail, endereço, modelo e ano do console.
- Geração de QR Code: Facilita o login na web do WhatsApp.
- Gerenciamento de Dados: Salva sessões e pedidos no Supabase.
- Opções de Controle: O cliente pode reiniciar o fluxo (digitando 0) ou encerrar o atendimento (digitando 9) a qualquer momento.
- Lista de Jogos: Apresenta uma lista de 26 jogos disponíveis para instalação.
- Resumo do Pedido: Gera um resumo com um ID de serviço único para cada pedido.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- Node.js
- Express
- whatsapp-web.js
- Supabase
- Docker
- Railway

---

## ⚙️ Pré-requisitos

Para rodar o projeto, você precisa ter instalado:

- Node.js 20+
- Docker (opcional, para rodar em container)
- Conta no Railway ou no Supabase.

---

## ▶️ Executando localmente

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/chatbot-hora-games.git
cd chatbot-hora-games
Instale as dependências:
```

```bash
npm install
Execute o projeto:
```

```bash
npm start
Rotas Locais
http://localhost:3000/: Rota de healthcheck.
http://localhost:3000/qr: Exibe o QR Code para login no WhatsApp.
```

---

## 🐳 Rodando com Docker

Se preferir usar Docker, o projeto já está configurado.

Construa a imagem Docker:

```bash
docker build -t chatbot-hora-games .
Execute o container:
```

```bash
docker run -p 3000:3000 --env-file .env chatbot-hora-games
```

---

## 🚀 Deploy no Railway

O projeto inclui arquivos Dockerfile e railway.json para facilitar o deploy.

Inicialize o Git e faça o commit inicial:

```bash
git init
git add .
git commit -m "Initial deploy"
Suba para o Railway:
railway up
```

---

## 📋 Estrutura do Projeto

A estrutura do projeto é a seguinte:

- index.js: Arquivo principal que inicializa o chatbot e o servidor Express.
- config.js: Contém a lista de jogos disponíveis e a localização da loja.
- content.js: Gerencia as mensagens e fluxos de conversa do bot.
- flowHandlers.js: Trata a lógica de cada etapa do fluxo de atendimento.
- utils.js: Inclui funções utilitárias para logs e envio de mensagens.
- package.json: Lista as dependências e scripts do projeto.
- Dockerfile: Configura o container para o ambiente de execução.
- railway.json: Define as configurações de build para o Railway.
- .gitignore: Ignora arquivos e pastas que não devem ser versionados, como node_modules e .env.

## 👨‍💻 Autor

Elton Sousa
Email: eltonsousadesigner@gmail.com

---
